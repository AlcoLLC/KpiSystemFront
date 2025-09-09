import axiosClient from "./axiosClient";

const accountsApi = {
  login: (credentials) => axiosClient.post("/accounts/login/", credentials),
  refreshToken: (refresh) =>
    axiosClient.post("/accounts/refresh/", { refresh }),
  logout: (refreshToken) =>
    axiosClient.post("/accounts/logout/", { refresh: refreshToken }),
  getProfiles: () => axiosClient.get("/profiles/"),
  updateProfile: (id, profileData) =>
    axiosClient.patch(`/profiles/${id}/`, profileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default accountsApi;
