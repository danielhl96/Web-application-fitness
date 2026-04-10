import React, { createContext, useState, useEffect, useRef, JSX } from 'react';
import api from '../Utils/api';
type AuthContextType = {
  isAuth: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};
export const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  loading: true,
  refresh: async () => {},
});
type AuthProviderProps = {
  children: React.ReactNode;
};
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const isCheckingRef = useRef<boolean>(false);

  const checkAuth = async (): Promise<void> => {
    if (isCheckingRef.current) return; // Prevent concurrent checks
    isCheckingRef.current = true;
    try {
      console.log('Checking authentication...');
      await api.get('/auth/check_auth');
      setIsAuth(true);
    } catch (err) {
      console.log('Auth check failed, trying to refresh token...', err);
      try {
        await api.post('/auth/refresh_token', {});
        await api.get('/auth/check_auth');
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    } finally {
      isCheckingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, loading, refresh: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
