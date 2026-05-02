import { IHttpClient, HttpResponse, RequestConfig } from '../interfaces/IHttpClient';

/**
 * Mock HTTP Client for testing purposes.
 * Allows you to stub responses without making real HTTP calls.
 */
export class MockHttpClient implements IHttpClient {
  private responses: Map<string, any> = new Map();

  /**
   * Set a mock response for a specific endpoint
   */
  mockResponse(url: string, data: any, status: number = 200): void {
    this.responses.set(url, { data, status });
  }

  /**
   * Clear all mock responses
   */
  clearMocks(): void {
    this.responses.clear();
  }

  private createResponse<T>(url: string): HttpResponse<T> {
    const mock = this.responses.get(url);
    if (!mock) {
      throw new Error(`No mock response found for ${url}`);
    }

    return {
      data: mock.data,
      status: mock.status,
      statusText: mock.status === 200 ? 'OK' : 'Error',
      headers: {},
    };
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.createResponse<T>(url);
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.createResponse<T>(url);
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.createResponse<T>(url);
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.createResponse<T>(url);
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
    return this.createResponse<T>(url);
  }
}
