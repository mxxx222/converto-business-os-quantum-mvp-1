import { NextRequest, NextResponse } from 'next/server';
import { processReceiptById } from '@/lib/receiptProcessor';
import { getTenantIdFromRequest } from '@/lib/tenant';

// Check if we're in test mode
const isTestMode: boolean = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('test.supabase.co') || false;

// POST /api/receipts/[id]/process - Process a receipt with OCR
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const tenantId: string = getTenantIdFromRequest(request);

    if (isTestMode) {
      const mockParsedData = {
        merchant: 'Test Store',
        date: new Date().toISOString().split('T')[0],
        total: 25.99,
        tax: 2.60,
        items: [
          { name: 'Test Item 1', price: 10.99 },
          { name: 'Test Item 2', price: 15.00 },
        ],
        rawText: 'Mock OCR text for testing',
      };

      return NextResponse.json({
        success: true,
        receiptId: params.id,
        ocrResult: {
          text: mockParsedData.rawText,
          confidence: 85,
          processingTime: 1500,
        },
        parsedData: mockParsedData,
      });
    }

    const result = await processReceiptById(params.id, tenantId, 'api');

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        receiptId: params.id,
        retriable: result.retriable,
        retryCount: result.retryCount,
        stage: result.stage,
      }, { status: result.httpStatus });
    }

    return NextResponse.json({
      success: true,
      receiptId: params.id,
      ocrResult: result.ocrResult,
      parsedData: result.parsedData,
      retryCount: result.retryCount,
    }, { status: result.httpStatus });

  } catch (error: unknown) {
    console.error('Processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
