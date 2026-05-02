import { IHttpClient } from '../interfaces/IHttpClient';

/**
 * Example service using dependency injection with IHttpClient.
 * This allows easy testing with MockHttpClient.
 */
export class UserService {
  constructor(private httpClient: IHttpClient) {}

  async getUser(userId: string) {
    const response = await this.httpClient.get(`/users/${userId}`);
    return response.data;
  }

  async updateUser(userId: string, data: any) {
    const response = await this.httpClient.put(`/users/${userId}`, data);
    return response.data;
  }

  async deleteUser(userId: string) {
    await this.httpClient.delete(`/users/${userId}`);
  }
}

// Production usage
import { httpClient } from '../Utils/api';
export const userService = new UserService(httpClient);

// Test usage example:
// import { MockHttpClient } from '../clients/MockHttpClient';
// const mockClient = new MockHttpClient();
// mockClient.mockResponse('/users/123', { id: '123', name: 'Test User' });
// const testService = new UserService(mockClient);
