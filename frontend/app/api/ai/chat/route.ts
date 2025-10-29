import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { messages, model, stream = false } = await req.json();
    const apiBase = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const upstream = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
        ...(process.env.OPENAI_ORG ? { 'OpenAI-Organization': process.env.OPENAI_ORG } : {}),
        ...(process.env.OPENAI_PROJECT ? { 'OpenAI-Project': process.env.OPENAI_PROJECT } : {}),
      },
      body: JSON.stringify({
        model: model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        stream,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(text || 'Upstream error', { status: upstream.status || 500 });
    }

    if (stream) {
      if (!upstream.body) return new Response('No stream body', { status: 502 });
      return new Response(upstream.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    const json = await upstream.json();
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(e?.message || 'Proxy error', { status: 500 });
  }
}

