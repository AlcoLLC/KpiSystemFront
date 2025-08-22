import axiosClient from "./axiosClient";

const kpiApi = {
  getAll: () => axiosClient.get("/kpis"),
  getById: (id) => axiosClient.get(`/kpis/${id}`),
};

export default kpiApi;
