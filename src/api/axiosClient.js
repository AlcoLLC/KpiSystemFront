import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://91.99.112.51:100/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
