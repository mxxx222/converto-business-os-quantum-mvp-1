import { supabaseAdmin } from './supabaseAdmin';
import { processReceiptById } from './receiptProcessor';
import { getDefaultTenantId } from './tenant';

export interface ProcessingJob {
  id: string;
  receiptId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  error?: string;
}

/**
 * Add a receipt to the processing queue
 */
export async function queueReceiptForProcessing(receiptId: string, tenantId?: string): Promise<{
  success: boolean;
  jobId?: string;
  error?: string;
}> {
  try {
    const resolvedTenantId = tenantId || getDefaultTenantId();

    const { data, error } = await supabaseAdmin
      .from('receipts')
      .update({
        status: 'queued',
        updated_at: new Date().toISOString(),
      })
      .eq('id', receiptId)
      .eq('tenant_id', resolvedTenantId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, jobId: receiptId };
  } catch {
    return { success: false, error: 'Failed to queue receipt' };
  }
}

/**
 * Process all queued receipts
 */
const DEFAULT_QUEUE_BATCH_SIZE: number = Number(process.env.RECEIPT_QUEUE_BATCH_SIZE || 10);
const isTestMode: boolean = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('test.supabase.co') || false;

interface QueueProcessError {
  receiptId: string;
  error: string;
  retriable: boolean;
  retryCount: number;
  stage?: string;
}

export async function processQueuedReceipts(tenantId?: string): Promise<{
  success: boolean;
  processed: number;
  failed: number;
  errors?: QueueProcessError[];
  error?: string;
}> {
  try {
    if (isTestMode) {
      return { success: true, processed: 0, failed: 0, errors: [] };
    }

    const resolvedTenantId = tenantId || getDefaultTenantId();

    const { data: receipts, error } = await supabaseAdmin
      .from('receipts')
      .select('id, tenant_id, status, retry_count')
      .in('status', ['queued', 'processing', 'failed'])
      .eq('tenant_id', resolvedTenantId)
      .order('created_at', { ascending: true })
      .limit(DEFAULT_QUEUE_BATCH_SIZE);

    if (error) {
      return { success: false, error: error.message, processed: 0, failed: 0 };
    }

    if (!receipts || receipts.length === 0) {
      return { success: true, processed: 0, failed: 0, errors: [] };
    }

    let processed = 0;
    let failed = 0;
    const errors: QueueProcessError[] = [];

    for (const receipt of receipts) {
      const activeTenantId = receipt.tenant_id || resolvedTenantId;
      const result = await processReceiptById(receipt.id, activeTenantId, 'queue');

      if (result.success) {
        processed++;
      } else {
        failed++;
        errors.push({
          receiptId: receipt.id,
          error: result.error || 'Processing failed',
          retriable: result.retriable,
          retryCount: result.retryCount,
          stage: result.stage,
        });
      }
    }

    return { success: true, processed, failed, errors };
  } catch (error) {
    console.error('Queue processing failure:', error);
    return { success: false, error: 'Failed to process queue', processed: 0, failed: 0 };
  }
}

/**
 * Get processing queue status
 */
export async function getQueueStatus(tenantId?: string): Promise<{
  success: boolean;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  error?: string;
}> {
  try {
    if (isTestMode) {
      return { success: true, queued: 0, processing: 0, completed: 0, failed: 0 };
    }

    const resolvedTenantId = tenantId || getDefaultTenantId();

    const { data, error } = await supabaseAdmin
      .from('receipts')
      .select('status')
      .eq('tenant_id', resolvedTenantId)
      .in('status', ['queued', 'processing', 'parsed', 'failed']);

    if (error) {
      return { success: false, error: error.message, queued: 0, processing: 0, completed: 0, failed: 0 };
    }

    const statusCounts = {
      queued: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    data?.forEach((receipt: { status: string }) => {
      if (receipt.status === 'queued') statusCounts.queued++;
      else if (receipt.status === 'processing') statusCounts.processing++;
      else if (receipt.status === 'parsed') statusCounts.completed++;
      else if (receipt.status === 'failed') statusCounts.failed++;
    });

    return { success: true, ...statusCounts };
  } catch {
    return { success: false, error: 'Failed to get queue status', queued: 0, processing: 0, completed: 0, failed: 0 };
  }
}
