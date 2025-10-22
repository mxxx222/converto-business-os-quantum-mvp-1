/**
 * API client for Converto Business OS
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: T): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: T): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Usage and billing methods
  async getTenantUsage(tenantId: string): Promise<ApiResponse<any>> {
    return this.get(`/api/v1/usage/${tenantId}`);
  }

  async getUsageTimeseries(tenantId: string, days: number): Promise<ApiResponse<any>> {
    return this.get(`/api/v1/usage/${tenantId}/timeseries?days=${days}`);
  }

  async getAdaptivePricing(tenantId: string): Promise<ApiResponse<any>> {
    return this.get(`/api/v1/pricing/${tenantId}/adaptive`);
  }
}

export const apiClient = new ApiClient();
