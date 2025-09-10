import axiosClient from "./axiosClient";

const accountsApi = {
  login: (credentials) => axiosClient.post("/accounts/login/", credentials),
  refreshToken: (refresh) =>
    axiosClient.post("/accounts/refresh/", { refresh }),
  logout: (refreshToken) =>
    axiosClient.post("/accounts/logout/", { refresh: refreshToken }),
  getProfile: () => axiosClient.get("/accounts/profiles/"),
  updateProfile: (profileData) =>
    axiosClient.post(`/accounts/profiles/`, profileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default accountsApi;
