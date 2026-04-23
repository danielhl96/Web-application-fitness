import api from '../Utils/api';
import { User } from '../types';

export const profileService = {
  get: (): Promise<User> => api.get<User>('users/profile').then((res) => res.data),
};
