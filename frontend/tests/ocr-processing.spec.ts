import { test, expect, Request } from '@playwright/test';

test.describe('OCR Processing', () => {
  test('OCR service processes receipt', async ({ request }: { request: Request }) => {
    const mockReceiptId: string = 'test-receipt-' + Date.now();

    const processResponse = await request.post(`/api/receipts/${mockReceiptId}/process`);
    expect(processResponse.ok()).toBeTruthy();

    const processData = await processResponse.json();
    expect(processData.success).toBe(true);
    expect(processData.receiptId).toBe(mockReceiptId);
    expect(processData.ocrResult).toBeDefined();
    expect(processData.parsedData).toBeDefined();
    expect(processData.parsedData.merchant).toBe('Test Store');
    expect(processData.parsedData.total).toBe(25.99);
  });

  test('OCR parsing extracts receipt data', async ({ request }: { request: Request }) => {
    const sampleReceiptText: string = `
    SUPERMARKET INC
    123 Main Street
    Date: 2024-01-15

    Milk.............$3.49
    Bread............$2.99
    Eggs.............$4.50

    Subtotal: $10.98
    Tax: $1.10
    Total: $12.08

    Thank you for shopping!
    `;

    const parseResponse = await request.post('/api/receipts/parse', {
      data: { text: sampleReceiptText },
    });

    expect(parseResponse.ok()).toBeTruthy();

    const parseData = await parseResponse.json();
    expect(parseData.success).toBe(true);
    expect(parseData.parsed.merchant).toBe('SUPERMARKET INC');
    expect(parseData.parsed.date).toBe('2024-01-15');
    expect(parseData.parsed.total).toBe(12.08);
    expect(parseData.parsed.tax).toBe(1.10);
    expect(Array.isArray(parseData.parsed.items)).toBe(true);
    expect(parseData.parsed.items.length).toBeGreaterThan(0);
  });
});
