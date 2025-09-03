import axiosClient from "./axiosClient";

const accountsApi = {
  login: (credentials) => axiosClient.post("/accounts/login/", credentials),
  refreshToken: (refresh) =>
    axiosClient.post("/accounts/refresh/", { refresh }),
  logout: (refreshToken) =>
    axiosClient.post("/accounts/logout/", { refresh: refreshToken }),
};

export default accountsApi;
