import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Check if dev mode is enabled
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Dev AI chat not available in production' },
        { status: 403 }
      );
    }

    // Initialize OpenAI client only when needed
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { model, messages, max_tokens } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o-mini',
      messages,
      max_tokens: max_tokens || 500,
      temperature: 0.7,
    });

    return NextResponse.json(completion);
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
