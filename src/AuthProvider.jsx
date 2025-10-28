import React, { createContext, useState, useEffect, useRef } from "react";
import api from "./api";

export const AuthContext = createContext({
  isAuth: false,
  loading: true,
  refresh: async () => {},
});

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const isCheckingRef = useRef(false);

  const checkAuth = async () => {
    if (isCheckingRef.current) return; // Verhindert parallele Aufrufe
    isCheckingRef.current = true;
    try {
      console.log("Checking authentication...");
      await api.get("/check_auth");
      setIsAuth(true);
    } catch (err) {
      console.log("Auth check failed, trying to refresh token...", err);
      try {
        await api.post("/refresh_token", {});
        await api.get("/check_auth");
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
