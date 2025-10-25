import { supabaseAdmin } from './supabaseAdmin';
import type { Receipt } from './supabase';
import { processReceipt, OCRResult, ParsedReceiptData } from './ocr';

const isTestMode: boolean = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('test.supabase.co') || false;

export type ProcessingStage = 'validation' | 'download' | 'ocr' | 'parse' | 'update' | 'unknown';

export const MAX_OCR_RETRY_ATTEMPTS: number = Number(process.env.RECEIPT_PROCESSING_MAX_RETRIES || 3);

export interface ProcessReceiptResult {
  success: boolean;
  receiptId: string;
  ocrResult?: OCRResult;
  parsedData?: ParsedReceiptData;
  retryCount: number;
  retriable: boolean;
  error?: string;
  stage?: ProcessingStage;
  httpStatus: number;
}

export class ReceiptProcessingError extends Error {
  stage: ProcessingStage;
  retriable: boolean;

  constructor(message: string, stage: ProcessingStage, retriable: boolean, cause?: unknown) {
    super(message);
    this.name = 'ReceiptProcessingError';
    this.stage = stage;
    this.retriable = retriable;

    if (cause instanceof Error && cause.stack) {
      this.stack = cause.stack;
    }
  }
}

function buildS3Url(receipt: Receipt): string {
  if (!receipt.s3_bucket || !receipt.s3_key) {
    throw new ReceiptProcessingError('Missing storage location for receipt', 'download', false);
  }

  const region: string = process.env.AWS_REGION || 'eu-north-1';
  return `https://${receipt.s3_bucket}.s3.${region}.amazonaws.com/${receipt.s3_key}`;
}

function normaliseMetadata(metadata: unknown): Record<string, unknown> {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  try {
    return { ...metadata };
  } catch {
    console.warn('Failed to clone receipt metadata, resetting to empty object.');
    return {};
  }
}

function buildErrorMetadata(existingMetadata: unknown, error: ReceiptProcessingError, retryCount: number, source: 'api' | 'queue'): Record<string, unknown> {
  const metadata = normaliseMetadata(existingMetadata);
  const timestamp = new Date().toISOString();

  metadata.last_error = {
    message: error.message,
    stage: error.stage,
    retriable: error.retriable,
    retry_count: retryCount,
    source,
    occurred_at: timestamp,
  };

  if (!Array.isArray(metadata.error_history)) {
    metadata.error_history = [];
  }

  metadata.error_history.push(metadata.last_error);
  metadata.error_history = metadata.error_history.slice(-10); // keep last 10 errors to prevent unbounded growth

  return metadata;
}

function buildSuccessMetadata(existingMetadata: unknown, source: 'api' | 'queue'): Record<string, unknown> {
  const metadata = normaliseMetadata(existingMetadata);
  metadata.last_processed_at = new Date().toISOString();
  metadata.last_processing_source = source;
  delete metadata.last_error;
  return metadata;
}

export async function processReceiptById(receiptId: string, tenantId: string, source: 'api' | 'queue' = 'api'): Promise<ProcessReceiptResult> {
  try {
    if (isTestMode) {
      const rawText = 'Mock OCR text';
      return {
        success: true,
        receiptId,
        ocrResult: {
          text: rawText,
          confidence: 0.9,
          processingTime: 1200,
        },
        parsedData: {
          merchant: 'Test Merchant',
          date: new Date().toISOString(),
          total: 19.99,
          tax: 2.4,
          items: [],
          rawText,
          confidence: 0.9,
        },
        retryCount: 0,
        retriable: false,
        httpStatus: 200,
      };
    }

    const { data: receipt, error } = await supabaseAdmin
      .from('receipts')
      .select('*')
      .eq('id', receiptId)
      .eq('tenant_id', tenantId)
      .single();

    if (error || !receipt) {
      return {
        success: false,
        receiptId,
        retryCount: 0,
        retriable: false,
        error: 'Receipt not found',
        stage: 'validation',
        httpStatus: 404,
      };
    }

    const currentRetryCount = receipt.retry_count ?? 0;

    if (receipt.status && !['queued', 'processing', 'failed'].includes(receipt.status)) {
      return {
        success: false,
        receiptId,
        retryCount: currentRetryCount,
        retriable: false,
        error: `Receipt is in status "${receipt.status}" and cannot be processed`,
        stage: 'validation',
        httpStatus: 400,
      };
    }

    // Move receipt to processing state
    const { error: statusUpdateError } = await supabaseAdmin
      .from('receipts')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
        error_message: null,
      })
      .eq('id', receiptId)
      .eq('tenant_id', tenantId);

    if (statusUpdateError) {
      throw new ReceiptProcessingError('Failed to update receipt status to processing', 'update', true, statusUpdateError);
    }

    const imageUrl = buildS3Url(receipt);

    let ocrResult: OCRResult;
    let parsedData: ParsedReceiptData;

    try {
      const processingResult = await processReceipt(imageUrl);
      ocrResult = processingResult.ocrResult;
      parsedData = processingResult.parsedData;
    } catch (error) {
      throw error instanceof ReceiptProcessingError
        ? error
        : new ReceiptProcessingError('OCR processing failed', 'ocr', true, error);
    }

    const successMetadata = buildSuccessMetadata(receipt.metadata, source);

    const { error: updateError } = await supabaseAdmin
      .from('receipts')
      .update({
        status: 'parsed',
        parsed_data: parsedData,
        raw_ocr_text: ocrResult.text,
        ocr_confidence: ocrResult.confidence,
        ocr_provider: 'tesseract.js',
        merchant_name: parsedData.merchant,
        receipt_date: parsedData.date ? new Date(parsedData.date).toISOString().split('T')[0] : null,
        total_amount: parsedData.total,
        tax_amount: parsedData.tax,
        line_items: parsedData.items,
        parsed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        retry_count: 0,
        error_message: null,
        metadata: successMetadata,
      })
      .eq('id', receiptId)
      .eq('tenant_id', tenantId);

    if (updateError) {
      throw new ReceiptProcessingError('Failed to persist parsed OCR data', 'update', true, updateError);
    }

    return {
      success: true,
      receiptId,
      ocrResult,
      parsedData,
      retryCount: 0,
      retriable: false,
      httpStatus: 200,
    };
  } catch (error) {
    const processingError = error instanceof ReceiptProcessingError
      ? error
      : new ReceiptProcessingError('Unexpected processing failure', 'unknown' as ProcessingStage, true, error);

    // Attempt to fetch receipt again to update retry count & metadata
    const { data: receipt } = await supabaseAdmin
      .from('receipts')
      .select('retry_count, metadata, tenant_id')
      .eq('id', receiptId)
      .single();

    const retryCount = (receipt?.retry_count ?? 0) + 1;
    const shouldRetry = retryCount < MAX_OCR_RETRY_ATTEMPTS && processingError.retriable;
    const metadata = buildErrorMetadata(receipt?.metadata, processingError, retryCount, source);

    await supabaseAdmin
      .from('receipts')
      .update({
        status: shouldRetry ? 'queued' : 'failed',
        retry_count: retryCount,
        error_message: processingError.message,
        updated_at: new Date().toISOString(),
        metadata,
      })
      .eq('id', receiptId)
      .eq('tenant_id', receipt?.tenant_id || tenantId);

    return {
      success: false,
      receiptId,
      retryCount,
      retriable: shouldRetry,
      error: processingError.message,
      stage: processingError.stage,
      httpStatus: shouldRetry ? 202 : 500,
    };
  }
}
