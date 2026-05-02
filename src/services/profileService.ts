import EditProfile from '../Components/editprofile';
import { IHttpClient } from '../interfaces/IHttpClient';
import { httpClient } from '../Utils/api';
import { User, UserHistory } from '../types';

class ProfileService {
  constructor(private httpClient: IHttpClient) {}

  async get(): Promise<User> {
    const response = await this.httpClient.get<User>('users/profile');
    return response.data;
  }

  async EditProfile(data: {
    bmi: number;
    height: number;
    weight: number;
    hip: number;
    waist: number;
    goal: string;
    bfp: number;
    gender: string;
    age: number;
    calories: number;
    activity_level: string;
  }): Promise<{ message: string }> {
    const response = await this.httpClient.patch('users/profile', data);
    return response.data;
  }

  async getHistory(): Promise<UserHistory[]> {
    const response = await this.httpClient.get<UserHistory[]>('users/history');
    return response.data;
  }
}

export const profileService = new ProfileService(httpClient);
