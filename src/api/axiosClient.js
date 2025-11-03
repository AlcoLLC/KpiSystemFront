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

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = JSON.parse(localStorage.getItem("tokens"));
        
        if (!tokens?.refresh) {
          processQueue(new Error('No refresh token'), null);
          localStorage.removeItem("tokens");
          localStorage.removeItem("user");
          delete axiosClient.defaults.headers.common["Authorization"];
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${axiosClient.defaults.baseURL}/accounts/refresh/`,
          { refresh: tokens.refresh }
        );

        const newAccessToken = refreshResponse.data.access;
        const newRefreshToken = refreshResponse.data.refresh || tokens.refresh;
        
        const newTokens = { 
          access: newAccessToken, 
          refresh: newRefreshToken 
        };
        
        localStorage.setItem("tokens", JSON.stringify(newTokens));
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
        
      } catch (refreshError) {
        console.error("Token yeniləmə uğursuz oldu:", refreshError);
        
        processQueue(refreshError, null);
        
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
        delete axiosClient.defaults.headers.common["Authorization"];
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