import { NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';

function jsonError(status: number, message: string, details?: unknown) {
  return new Response(JSON.stringify({ error: message, details }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Simple in-memory rate limiter (dev-friendly). For production, back with Redis.
const WINDOW_MS = 60_000;
const DEFAULT_LIMIT = Number(process.env.OPENAI_RATE_LIMIT || 60); // req/IP/60s
const bucket: Map<string, { count: number; ts: number }> = new Map();

function rateLimit(ip: string): { allowed: boolean; msUntilReset: number } {
  const now = Date.now();
  const cur = bucket.get(ip) || { count: 0, ts: now };
  if (now - cur.ts > WINDOW_MS) {
    cur.count = 0;
    cur.ts = now;
  }
  cur.count += 1;
  bucket.set(ip, cur);
  const allowed = cur.count <= DEFAULT_LIMIT;
  const msUntilReset = Math.max(0, WINDOW_MS - (now - cur.ts));
  return { allowed, msUntilReset };
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const rid = req.headers.get('x-request-id') || randomUUID();
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const stream: boolean = !!body?.stream;
    const modelInput: string | undefined = body?.model;

    // Apply rate limit after we know the request intent
    const rl = rateLimit(ip);
    if (!rl.allowed) {
      const retrySec = Math.ceil(rl.msUntilReset / 1000);
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Retry-After': String(retrySec),
        'X-Request-ID': rid,
        'X-Model': modelInput || '',
        'X-Org': process.env.OPENAI_ORG || '',
        'X-Project': process.env.OPENAI_PROJECT || '',
      });
      return new Response(
        JSON.stringify({
          error: 'rate_limited',
          details: { ip, window_ms: WINDOW_MS, limit: DEFAULT_LIMIT, request_id: rid, retry_after_s: retrySec },
        }),
        { status: 429, headers }
      );
    }

    // Basic validation/limits
    if (!messages.length) return jsonError(400, 'messages_required');
    if (messages.length > 30) return jsonError(400, 'too_many_messages');
    for (const m of messages) {
      if (!m || typeof m.role !== 'string' || typeof m.content !== 'string') {
        return jsonError(400, 'invalid_message_shape');
      }
      if (!['user', 'assistant', 'system'].includes(m.role)) {
        return jsonError(400, 'invalid_message_role', m.role);
      }
      if (m.content.length > 8000) {
        return jsonError(400, 'message_too_long');
      }
    }

    const allowedModels = (process.env.OPENAI_ALLOWED_MODELS || 'gpt-4o,gpt-4o-mini,o3-mini')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const model = modelInput || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    if (!allowedModels.includes(model)) {
      return jsonError(400, 'model_not_allowed', { model, allowedModels });
    }

    const apiBase = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort('timeout'), 30000);
    const upstream = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
        ...(process.env.OPENAI_ORG ? { 'OpenAI-Organization': process.env.OPENAI_ORG } : {}),
        ...(process.env.OPENAI_PROJECT ? { 'OpenAI-Project': process.env.OPENAI_PROJECT } : {}),
      },
      body: JSON.stringify({ model, messages, stream }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    if (!upstream.ok) {
      let payload: unknown = undefined;
      try {
        payload = await upstream.json();
      } catch {
        payload = await upstream.text();
      }
      return jsonError(upstream.status || 500, 'upstream_error', { payload, request_id: rid });
    }

    if (stream) {
      if (!upstream.body) return jsonError(502, 'no_stream_body');
      const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Request-ID': rid,
        'X-Model': model,
        'X-Org': process.env.OPENAI_ORG || '',
        'X-Project': process.env.OPENAI_PROJECT || '',
      });
      return new Response(upstream.body, { status: 200, headers });
    }

    const json = await upstream.json();
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Request-ID': rid,
      'X-Model': model,
      'X-Org': process.env.OPENAI_ORG || '',
      'X-Project': process.env.OPENAI_PROJECT || '',
    });
    return new Response(JSON.stringify(json), { status: 200, headers });
  } catch (e: any) {
    const msg = e?.name === 'AbortError' ? 'proxy_timeout' : (e?.message || 'proxy_error');
    return jsonError(500, msg);
  }
}
