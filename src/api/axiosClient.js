import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://metrics.azlub.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

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

    const isTokenExpired = error.response?.data?.messages?.some(
      (msg) => msg.message === "Token is expired"
    );

    if ((error.response?.status === 401 || isTokenExpired) && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));

        if (!tokens?.refresh) {
          throw new Error("No refresh token");
        }

        const refreshResponse = await axios.post(
          `${axiosClient.defaults.baseURL}/accounts/refresh/`,
          { refresh: tokens.refresh }
        );

        const { access, refresh } = refreshResponse.data;
        const newTokens = { access, refresh: refresh || tokens.refresh };

        localStorage.setItem("tokens", JSON.stringify(newTokens));
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        
        processQueue(null, access);
        
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return axiosClient(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;