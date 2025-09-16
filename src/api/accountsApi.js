import axiosClient from "./axiosClient"; // apiService əvəzinə axiosClient import et

const accountsApi = {
  login: (credentials) => axiosClient.post("/accounts/login/", credentials),

  refreshToken: (refresh) => axiosClient.post("/accounts/refresh/", { refresh }),

  logout: (refreshToken) =>
    axiosClient.post("/accounts/logout/", { refresh: refreshToken }),

  getProfile: () => axiosClient.get("/accounts/users/me/"),

  updateProfile: (profileData) =>
    axiosClient.patch(`/accounts/users/me/`, profileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getUsers: () => axiosClient.get("/accounts/users/"),

  // Token yoxlama funksiyası - opsional
  verifyToken: (token) => 
    axiosClient.post("/accounts/verify-token/", { token }),

  // Password dəyişmək üçün
  changePassword: (passwordData) =>
    axiosClient.post("/accounts/change-password/", passwordData),
};

export default accountsApi;