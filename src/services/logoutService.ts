import api from '../Utils/api';
import { useNavigate } from 'react-router-dom';

export const logoutService = (navigate: ReturnType<typeof useNavigate>) => {
  api.post('/auth/logout', {}, { withCredentials: true }).then(() => navigate('/login'));
};
