// API Client for Converto Business OS
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ReceiptData {
  id?: string;
  merchant_name?: string;
  amount?: number;
  date?: string;
  items?: ReceiptItem[];
  vat_amount?: number;
  net_amount?: number;
  gross_amount?: number;
}

export interface ReceiptItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  category?: string;
}

export interface Entitlements {
  tier: string;
  modules: Record<string, boolean>;
  limits: Record<string, number>;
  usage: Record<string, number>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Receipt management
  async uploadReceipt(file: File): Promise<ApiResponse<ReceiptData>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/ocr/power`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.detail || 'Upload failed' };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Upload error' };
    }
  }

  async getReceipts(limit = 50, offset = 0): Promise<ApiResponse<ReceiptData[]>> {
    return this.request<ReceiptData[]>(`/api/v1/ocr/results?limit=${limit}&offset=${offset}`);
  }

  async getReceipt(id: string): Promise<ApiResponse<ReceiptData>> {
    return this.request<ReceiptData>(`/api/v1/ocr/results/${id}`);
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ access_token: string; token_type: string }>> {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, company_name: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, company_name }),
    });
  }

  // Entitlements
  async getEntitlements(tenantId = 'tenant_demo'): Promise<ApiResponse<Entitlements>> {
    return this.request<Entitlements>(`/api/v1/entitlements/${tenantId}`);
  }

  async checkFeature(feature: string, tenantId = 'tenant_demo'): Promise<ApiResponse<{ enabled: boolean }>> {
    return this.request<{ enabled: boolean }>(`/api/v1/entitlements/${tenantId}/features/${feature}`);
  }

  // VAT calculation
  async calculateVat(amount: number, category?: string): Promise<ApiResponse<{
    net_amount: number;
    vat_amount: number;
    gross_amount: number;
    vat_rate: number;
  }>> {
    return this.request('/api/v1/vat/calculate', {
      method: 'POST',
      body: JSON.stringify({ amount, category }),
    });
  }

  // Dashboard data
  async getDashboardData(): Promise<ApiResponse<{
    total_receipts: number;
    total_amount: number;
    monthly_usage: Record<string, number>;
  }>> {
    return this.request('/api/v1/dashboard');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual functions for convenience
export const {
  uploadReceipt,
  getReceipts,
  getReceipt,
  login,
  register,
  getEntitlements,
  checkFeature,
  calculateVat,
  getDashboardData,
  healthCheck,
} = apiClient;