// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Automatically prepends /api to all requests
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Optional if you need to send cookies
});

export default axiosInstance;
