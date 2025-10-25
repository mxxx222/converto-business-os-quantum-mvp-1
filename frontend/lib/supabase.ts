import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface PilotSignup {
  id: string;
  email: string;
  company: string;
  role?: string;
  created_at: string;
  tenant_id?: string;
}

export interface PilotSignupStats {
  total_signups: number;
  today_signups: number;
  this_week_signups: number;
}

// Receipt types
export interface Receipt {
  id: string;
  tenant_id: string;
  user_id?: string;
  filename: string;
  original_filename?: string;
  sha256: string;
  size_bytes: number;
  mime_type: string;
  s3_key: string;
  s3_bucket: string;
  status: 'queued' | 'processing' | 'parsed' | 'needs_review' | 'approved' | 'rejected' | 'failed';
  created_at: string;
  updated_at: string;
  parsed_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  ocr_confidence?: number;
  ocr_provider?: string;
  parsed_data?: unknown;
  raw_ocr_text?: string;
  merchant_name?: string;
  receipt_date?: string;
  total_amount?: number;
  tax_amount?: number;
  currency_code?: string;
  line_items?: unknown[];
  metadata?: unknown;
  error_message?: string;
  retry_count: number;
}

export interface ReceiptUploadResponse {
  success: boolean;
  receiptId?: string;
  presignedUrl?: string;
  s3Key?: string;
  error?: string;
}

export interface ReceiptListResponse {
  success: boolean;
  receipts?: Receipt[];
  pagination?: {
    offset: number;
    limit: number;
    hasMore: boolean;
  };
  error?: string;
}

/**
 * Insert pilot signup
 */
export async function insertPilotSignup(data: {
  email: string;
  company: string;
  role?: string;
  tenant_id?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('pilot_signups')
      .insert([data]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Database error' };
  }
}

/**
 * Get pilot signup stats
 */
export async function getPilotSignupStats(): Promise<{
  success: boolean;
  data?: PilotSignupStats;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('pilot_signups_stats')
      .select('*')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch {
    return { success: false, error: 'Database error' };
  }
}

/**
 * Get recent pilot signups
 */
export async function getRecentPilotSignups(limit: number = 10): Promise<{
  success: boolean;
  data?: PilotSignup[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('pilot_signups')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch {
    return { success: false, error: 'Database error' };
  }
}

/**
 * Upload receipt - get presigned URL and create receipt record
 */
export async function uploadReceipt(file: File, tenantId: string): Promise<ReceiptUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    const response = await fetch('/api/receipts', {
      method: 'POST',
      body: formData,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Upload failed' };
    }

    return result;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get receipts for tenant
 */
export async function getReceipts(
  tenantId: string,
  options: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<ReceiptListResponse> {
  try {
    const { status, limit = 50, offset = 0 } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    const response = await fetch(`/api/receipts?${params}`, {
      headers,
    });
    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to fetch receipts' };
    }

    return result;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Update receipt status
 */
export async function updateReceiptStatus(
  receiptId: string,
  updates: {
    status: string;
    parsedData?: unknown;
    ocrConfidence?: number;
    ocrProvider?: string;
    errorMessage?: string;
  },
  tenantId?: string
): Promise<{ success: boolean; receipt?: Receipt; error?: string }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    const response = await fetch(`/api/receipts/${receiptId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Update failed' };
    }

    return result;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Process queued receipts
 */
export async function processReceiptQueue(tenantId?: string): Promise<{
  success: boolean;
  processed?: number;
  failed?: number;
  errors?: Array<{
    receiptId: string;
    error: string;
    retriable: boolean;
    retryCount: number;
    stage?: string;
  }>;
  error?: string;
}> {
  try {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    const response = await fetch('/api/queue/process', {
      method: 'POST',
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Queue processing failed' };
    }

    return result;
  } catch {
    return { success: false, error: 'Network error' };
  }
}

/**
 * Get queue status
 */
export async function getQueueStatus(tenantId?: string): Promise<{
  success: boolean;
  queued?: number;
  processing?: number;
  completed?: number;
  failed?: number;
  error?: string;
}> {
  try {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }

    const response = await fetch('/api/receipts/queue-status', {
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to load queue status' };
    }

    return result;
  } catch {
    return { success: false, error: 'Network error' };
  }
}
