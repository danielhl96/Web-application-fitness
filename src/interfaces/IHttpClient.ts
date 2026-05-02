/**
 * Abstract HTTP Client interface for making API requests.
 * Allows easy mocking for tests and dependency inversion.
 */
export interface IHttpClient {
  /**
   * Perform a GET request
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;

  /**
   * Perform a POST request
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>>;

  /**
   * Perform a PUT request
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>>;

  /**
   * Perform a DELETE request
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;

  /**
   * Perform a PATCH request
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>>;
}

/**
 * HTTP Response wrapper
 */
export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  withCredentials?: boolean;
}
