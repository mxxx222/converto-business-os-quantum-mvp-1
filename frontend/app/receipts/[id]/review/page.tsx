'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Receipt {
  id: string;
  filename: string;
  original_filename?: string;
  status: string;
  merchant_name?: string;
  receipt_date?: string;
  total_amount?: number;
  tax_amount?: number;
  currency_code?: string;
  line_items?: Array<any>;
  ocr_confidence?: number;
  raw_ocr_text?: string;
  created_at: string;
}

interface ReviewFormData {
  merchant_name: string;
  receipt_date: string;
  total_amount: string;
  tax_amount: string;
  currency_code: string;
  line_items: Array<{
    description: string;
    quantity: string;
    unit_price: string;
    total: string;
  }>;
}

export default function ReceiptReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    merchant_name: '',
    receipt_date: '',
    total_amount: '',
    tax_amount: '',
    currency_code: 'USD',
    line_items: []
  });

  useEffect(() => {
    loadReceipt();
  }, [params.id]);

  const loadReceipt = async () => {
    try {
      const response = await fetch(`/api/receipts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setReceipt(data.receipt);

        // Initialize form with existing data
        setFormData({
          merchant_name: data.receipt.merchant_name || '',
          receipt_date: data.receipt.receipt_date || '',
          total_amount: data.receipt.total_amount?.toString() || '',
          tax_amount: data.receipt.tax_amount?.toString() || '',
          currency_code: data.receipt.currency_code || 'USD',
          line_items: data.receipt.line_items || []
        });
      }
    } catch (error) {
      console.error('Failed to load receipt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ReviewFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineItemChange = (index: number, field: keyof ReviewFormData['line_items'][number], value: string) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, {
        description: '',
        quantity: '1',
        unit_price: '',
        total: ''
      }]
    }));
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
  };

  const handleApprove = async () => {
    await saveReview('approved');
  };

  const handleReject = async () => {
    await saveReview('rejected');
  };

  const saveReview = async (status: 'approved' | 'rejected') => {
    setSaving(true);
    try {
      const reviewData = {
        status,
        parsedData: {
          merchant_name: formData.merchant_name,
          receipt_date: formData.receipt_date,
          total_amount: parseFloat(formData.total_amount) || 0,
          tax_amount: parseFloat(formData.tax_amount) || 0,
          currency_code: formData.currency_code,
          line_items: formData.line_items.map(item => ({
            description: item.description,
            quantity: parseFloat(item.quantity) || 1,
            unit_price: parseFloat(item.unit_price) || 0,
            total: parseFloat(item.total) || 0
          }))
        }
      };

      const response = await fetch(`/api/receipts/${params.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        router.push('/ocr-test');
      } else {
        console.error('Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading receipt...</div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Receipt not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Review Receipt</h1>
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Reject'}
              </button>
              <button
                onClick={handleApprove}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Approve'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Receipt Image */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Receipt Image</h2>
              <div className="border rounded p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">File: {receipt.original_filename || receipt.filename}</p>
                <p className="text-sm text-gray-600 mb-2">Status: <span className="capitalize">{receipt.status}</span></p>
                {receipt.ocr_confidence && (
                  <p className="text-sm text-gray-600 mb-2">
                    OCR Confidence: {(receipt.ocr_confidence * 100).toFixed(1)}%
                  </p>
                )}
                <div className="mt-4 p-4 bg-white border rounded text-sm">
                  <pre className="whitespace-pre-wrap text-xs">
                    {receipt.raw_ocr_text || 'No OCR text available'}
                  </pre>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Review & Edit Data</h2>

              <div className="space-y-4">
                {/* Merchant Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Merchant Name</label>
                  <input
                    type="text"
                    value={formData.merchant_name}
                    onChange={(e) => handleInputChange('merchant_name', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter merchant name"
                  />
                </div>

                {/* Receipt Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">Receipt Date</label>
                  <input
                    type="date"
                    value={formData.receipt_date}
                    onChange={(e) => handleInputChange('receipt_date', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    value={formData.currency_code}
                    onChange={(e) => handleInputChange('currency_code', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="SEK">SEK</option>
                  </select>
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium mb-1">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.total_amount}
                    onChange={(e) => handleInputChange('total_amount', e.target.value)}
                    className="w