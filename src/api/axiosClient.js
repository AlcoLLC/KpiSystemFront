import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://91.99.112.51:100/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        if (!tokens?.refresh) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${axiosClient.defaults.baseURL}/accounts/refresh/`,
          { refresh: tokens.refresh }
        );

        const newAccessToken = refreshResponse.data.access;
        const newTokens = { ...tokens, access: newAccessToken };
        localStorage.setItem("tokens", JSON.stringify(newTokens));

        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Token yeniləmə uğursuz oldu:", refreshError);
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
