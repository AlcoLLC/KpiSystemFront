import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import accountsApi from "../api/accountsApi";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [tokens, setTokens] = useState(
    () => JSON.parse(localStorage.getItem("tokens")) || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    delete axiosClient.defaults.headers.common["Authorization"];
    navigate("/login");
  }, [navigate]);

  // src/context/AuthContext.js

  useEffect(() => {
    const syncUserData = async () => {
      const storedTokens = JSON.parse(localStorage.getItem("tokens"));
      if (storedTokens?.access) {
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedTokens.access}`;
        try {
          const response = await accountsApi.getProfile();
          const latestUserData = response.data;
          setUser(latestUserData);
          localStorage.setItem("user", JSON.stringify(latestUserData));
        } catch (err) {
          console.error("İstifadəçi məlumatları sinxronizasiya edilərkən xəta baş verdi:", err);
        }
      }
    };

    syncUserData();
  }, []); 
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await accountsApi.login({ email, password });
      const { access, refresh, user: userData } = response.data;
      const tokensData = { access, refresh };

      setTokens(tokensData);
      setUser(userData);

      localStorage.setItem("tokens", JSON.stringify(tokensData));
      localStorage.setItem("user", JSON.stringify(userData));

      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "E-poçt və ya şifrə yanlışdır.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const currentTokens = JSON.parse(localStorage.getItem("tokens"));
    if (currentTokens?.refresh) {
      try {
        await accountsApi.logout(currentTokens.refresh);
      } catch (err) {
        console.error("Logout API sorğusu uğursuz oldu:", err);
      }
    }
    logout();
  };

  const value = {
    user,
    setUser,
    tokens,
    isLoading,
    error,
    login,
    logout: handleLogout,
    isAuthenticated: !!tokens?.access,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
