import apiService from "./apiService";

const accountsApi = {
  login: (credentials) => apiService.post("/accounts/login/", credentials),

  refreshToken: (refresh) => apiService.post("/accounts/refresh/", { refresh }),

  logout: (refreshToken) =>
    apiService.post("/accounts/logout/", { refresh: refreshToken }),

  getProfile: () => apiService.get("/accounts/users/me/"),

  updateProfile: (profileData) =>
    apiService.patch(`/accounts/users/me/`, profileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getUsers: () => apiService.get("/accounts/users/"),
};

export default accountsApi;