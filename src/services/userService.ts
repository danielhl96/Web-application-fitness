import { IHttpClient } from '../interfaces/IHttpClient';
import { httpClient } from '../Utils/api';
import { User } from '../types';

class UserService {
  constructor(private httpClient: IHttpClient) {}

  async changeEmail(email: string, password: string): Promise<{ message: string }> {
    const response = await this.httpClient.put('users/change_email', { email, password });
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await this.httpClient.put('users/change_password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  }

  async deleteProfile(password: string): Promise<{ message: string }> {
    const response = await this.httpClient.delete('users/delete_account', { params: { password } });
    return response.data;
  }

  async register(email: string, password: string): Promise<{ message: string }> {
    const response = await this.httpClient.post('auth/register', { email, password });
    return response.data;
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const response = await this.httpClient.post('auth/login', { email, password });
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.httpClient.get<User>('users/profile');
    return response.data;
  }
}

export const userService = new UserService(httpClient);
