
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:2000/api/", // Thay thế bằng baseURL của bạn
});

// Interceptor để tự động thêm token vào yêu cầu API đã xác thực
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
