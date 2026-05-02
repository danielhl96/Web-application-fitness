import { IHttpClient } from '../interfaces/IHttpClient';
import { httpClient } from '../Utils/api';

class AuthService {
  constructor(private httpClient: IHttpClient) {}

  async login(email: string, password: string): Promise<void> {
    await this.httpClient.post('/auth/login', { email, password });
  }

  async register(email: string, password: string): Promise<{ message: string }> {
    const response = await this.httpClient.post('/auth/register', { email, password });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.httpClient.post('/auth/logout', {}, { withCredentials: true });
  }

  async checkAuth(): Promise<void> {
    await this.httpClient.get('/auth/check_auth');
  }

  async refreshToken(): Promise<void> {
    await this.httpClient.post('/auth/refresh_token', {});
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.httpClient.post('/auth/password-reset-requests', { email });
  }

  async resetPassword(
    email: string,
    newPassword: string,
    safetycode: string
  ): Promise<{ message: string }> {
    const response = await this.httpClient.post('/auth/password', {
      email,
      newPassword,
      safetycode,
    });
    return response.data;
  }
}

export const authService = new AuthService(httpClient);
