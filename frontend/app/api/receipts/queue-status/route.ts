import { NextRequest, NextResponse } from 'next/server';
import { getQueueStatus } from '@/lib/queue';
import { getTenantIdFromRequest } from '@/lib/tenant';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const tenantId = getTenantIdFromRequest(request);
    const status = await getQueueStatus(tenantId);

    if (!status.success) {
      return NextResponse.json({ success: false, error: status.error || 'Failed to load queue status' }, { status: 500 });
    }

    const { success, ...rest } = status;
    return NextResponse.json({ success: true, ...rest });
  } catch (error) {
    console.error('Queue status error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
