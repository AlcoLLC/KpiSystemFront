import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // backend url buraya
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
