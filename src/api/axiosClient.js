import axios from "axios";
import accountsApi from "./accountsApi";

const axiosClient = axios.create({
  baseURL: "http://91.99.112.51:100/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        if (!tokens?.refresh) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await accountsApi.refreshToken(tokens.refresh);
        const newAccessToken = response.data.access;

        const newTokens = { ...tokens, access: newAccessToken };
        localStorage.setItem("tokens", JSON.stringify(newTokens));

        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
        delete axiosClient.defaults.headers.common["Authorization"];
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
