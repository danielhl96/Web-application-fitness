import EditProfile from '../Components/editprofile';
import api from '../Utils/api';
import { User, UserHistory } from '../types';

export const profileService = {
  get: (): Promise<User> => api.get<User>('users/profile').then((res) => res.data),
  EditProfile: (data: {
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
  }): Promise<{ message: string }> => api.put('users/edit_profile', data).then((res) => res.data),
  getHistory: (): Promise<UserHistory[]> =>
    api.get<UserHistory[]>('users/history').then((res) => res.data),
};
