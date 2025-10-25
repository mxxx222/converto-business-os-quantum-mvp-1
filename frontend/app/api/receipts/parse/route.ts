import { NextRequest, NextResponse } from 'next/server';
import { parseReceiptText } from '@/lib/ocr';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing receipt text' }, { status: 400 });
    }

    const parsed = parseReceiptText(text);

    return NextResponse.json({ success: true, parsed });
  } catch (error) {
    console.error('Receipt parse error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
