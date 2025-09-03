import axiosClient from "./axiosClient";

const accountsApi = {
  login: (credentials) => axiosClient.post("/accounts/login/", credentials),
};

export default accountsApi;
