import { JSX, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

type ProtectedRouteProps = {
  children: React.ReactNode;
};
function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { isAuth, loading } = useContext<{ isAuth: boolean; loading: boolean }>(AuthContext);

  if (loading)
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default ProtectedRoute;
