import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/check_auth", { withCredentials: true })
      .then(() => setIsAuth(true))
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          try {
            await axios.post(
              "http://localhost:5000/api/refresh_token",
              {},
              { withCredentials: true }
            );
            await axios.get("http://localhost:5000/api/check_auth", {
              withCredentials: true,
            });
            setIsAuth(true);
          } catch {
            setIsAuth(false);
          }
        } else {
          setIsAuth(false);
        }
      });
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
