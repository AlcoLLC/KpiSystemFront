import { createContext, useState, useEffect } from "react";
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

  // 2. Proqram hər açıldıqda və ya səhifə yeniləndikdə token varsa, onu axios-a əlavə edirik
  useEffect(() => {
    if (tokens?.access) {
      axiosClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tokens.access}`;
    }
  }, [tokens]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await accountsApi.login({ email, password });

      // 3. Cavabdan access, refresh token və user məlumatlarını alırıq
      const { access, refresh, user: userData } = response.data;
      const tokensData = { access, refresh };

      // State-ləri yeniləyirik
      setTokens(tokensData);
      setUser(userData);

      // 4. Həm tokenləri, həm də istifadəçi məlumatını localStorage-a yazırıq
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

  const logout = () => {
    // 5. Logout zamanı hər şeyi təmizləyirik
    setUser(null);
    setTokens(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    delete axiosClient.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const value = {
    user,
    tokens,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!tokens?.access,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
