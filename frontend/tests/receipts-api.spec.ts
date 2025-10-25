import { test, expect, APIRequestContext } from '@playwright/test';

test.describe('Receipts API', () => {
  test('API endpoints respond', async ({ request }: { request: APIRequestContext }) => {
    // Test GET /api/receipts
    const listResponse = await request.get('/api/receipts');
    expect(listResponse.ok()).toBeTruthy();

    const listData = await listResponse.json();
    expect(listData.success).toBe(true);
    expect(Array.isArray(listData.receipts)).toBe(true);
  });

  test('Receipt status endpoint works', async ({ request }: { request: APIRequestContext }) => {
    // Create a mock receipt ID
    const mockReceiptId = '550e8400-e29b-41d4-a716-446655440000';

    // Test GET /api/receipts/[id]/status (should return 404 for non-existent)
    const statusResponse = await request.get(`/api/receipts/${mockReceiptId}/status`);
    // Should return 404 for non-existent receipt
    expect(statusResponse.status()).toBe(404);
  });
});
