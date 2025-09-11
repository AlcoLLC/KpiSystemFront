import axiosClient from "./axiosClient";

const apiService = {
  get: (url, params) => axiosClient.get(url, { params }),
  post: (url, data, config = {}) => axiosClient.post(url, data, config),
  patch: (url, data, config = {}) => axiosClient.patch(url, data, config),
  put: (url, data, config = {}) => axiosClient.put(url, data, config),
  delete: (url, config = {}) => axiosClient.delete(url, config),
};

export default apiService;
