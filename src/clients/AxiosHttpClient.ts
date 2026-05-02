import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IHttpClient, HttpResponse, RequestConfig } from '../interfaces/IHttpClient';

/**
 * Axios-based implementation of IHttpClient.
 * Wraps axios with our interface for dependency inversion.
 */
export class AxiosHttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  private mapResponse<T>(axiosResponse: AxiosResponse<T>): HttpResponse<T> {
    return {
      data: axiosResponse.data,
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      headers: axiosResponse.headers as Record<string, string>,
    };
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.get<T>(url, config);
    return this.mapResponse(response);
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return this.mapResponse(response);
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return this.mapResponse(response);
  }

  async delete<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.delete<T>(url, { ...config, data });
    return this.mapResponse(response);
  }

  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<HttpResponse<T>> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return this.mapResponse(response);
  }
}
