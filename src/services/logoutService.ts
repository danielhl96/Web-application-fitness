import { httpClient } from '../Utils/api';
import { useNavigate } from 'react-router-dom';

export const logoutService = async (navigate: ReturnType<typeof useNavigate>) => {
  await httpClient.post('/auth/logout', {}, { withCredentials: true });
  navigate('/login');
};
