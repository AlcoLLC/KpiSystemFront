import { createContext, useState, useEffect, useCallback, useRef } from "react";
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
  
  const tokenRefreshTimer = useRef(null);

  const logout = useCallback(() => {
    if (tokenRefreshTimer.current) {
      clearTimeout(tokenRefreshTimer.current);
    }
    
    setUser(null);
    setTokens(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    delete axiosClient.defaults.headers.common["Authorization"];
    navigate("/login");
  }, [navigate]);

  const scheduleTokenRefresh = useCallback((accessToken) => {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const exp = payload.exp * 1000; 
      const now = Date.now();
      
      const refreshTime = exp - now - (5 * 60 * 1000);
      
      if (refreshTime > 0) {
        tokenRefreshTimer.current = setTimeout(async () => {
          try {
            const currentTokens = JSON.parse(localStorage.getItem("tokens"));
            if (currentTokens?.refresh) {
              const response = await accountsApi.refreshToken(currentTokens.refresh);
              const newTokens = {
                access: response.data.access,
                refresh: response.data.refresh || currentTokens.refresh
              };
              
              setTokens(newTokens);
              localStorage.setItem("tokens", JSON.stringify(newTokens));
              axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newTokens.access}`;
              
              scheduleTokenRefresh(newTokens.access);
            }
          } catch (err) {
            console.error("Avtomatik token yeniləmə uğursuz oldu:", err);
            logout();
          }
        }, refreshTime);
      }
    } catch (err) {
      console.error("Token decode edilərkən xəta:", err);
    }
  }, [logout]);

  useEffect(() => {
    const syncUserData = async () => {
      const storedTokens = JSON.parse(localStorage.getItem("tokens"));
      if (storedTokens?.access) {
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedTokens.access}`;
        
        scheduleTokenRefresh(storedTokens.access);
        
        try {
          const response = await accountsApi.getProfile();
          const latestUserData = response.data;
          setUser(latestUserData);
          localStorage.setItem("user", JSON.stringify(latestUserData));
        } catch (err) {
          console.error("İstifadəçi məlumatları sinxronizasiya edilərkən xəta baş verdi:", err);
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
          }
        }
      }
    };

    syncUserData();
    
    return () => {
      if (tokenRefreshTimer.current) {
        clearTimeout(tokenRefreshTimer.current);
      }
    };
  }, [scheduleTokenRefresh, logout]);

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
      
      scheduleTokenRefresh(access);
      console.log("Login uğurlu oldu, istifadəçi məlumatları:", userData);
      
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || 
        err.response?.data?.message ||
        "E-poçt və ya şifrə yanlışdır.";
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

  const refreshUserProfile = async () => {
    try {
      const response = await accountsApi.getProfile();
      const latestUserData = response.data;
      setUser(latestUserData);
      localStorage.setItem("user", JSON.stringify(latestUserData));
      return latestUserData;
    } catch (err) {
      console.error("İstifadəçi profili yenilənərkən xəta:", err);
      throw err;
    }
  };

  const value = {
    user,
    setUser,
    tokens,
    isLoading,
    error,
    login,
    logout: handleLogout,
    refreshUserProfile,
    isAuthenticated: !!tokens?.access,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;