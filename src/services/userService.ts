import api from '../Utils/api';
import { User } from '../types';

export const userService = {
  changeEmail: (email: string, password: string): Promise<{ message: string }> =>
    api.put('users/change_email', { email, password }).then((res) => res.data),
  changePassword: (oldPassword: string, newPassword: string): Promise<{ message: string }> =>
    api.put('users/change_password', { oldPassword, newPassword }).then((res) => res.data),
  deleteProfile: (password: string): Promise<{ message: string }> =>
    api.delete('users/delete_account', { data: { password } }).then((res) => res.data),
};
