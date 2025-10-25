import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useContext(AuthContext);

  console.log(isAuth, loading);
  if (loading)
    return (
      <div>
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
