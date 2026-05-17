import axios from "axios";

// =================== Axios Instance ===================
const AxiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // مهم لو فيه cookies/session
  timeout: 10000,
});

// =================== Request Interceptor ===================
AxiosWrapper.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// =================== Response Interceptor ===================
AxiosWrapper.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 503) {
        alert(
          error.response.data?.message ||
            "Database is unavailable. Please check the backend database connection."
        );
      }
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      if (error.response.status === 403) {
        alert("You don't have permission to perform this action.");
      }
      console.error("Response error:", error.response.data);
    } else if (error.request) {
      if (error.code === "ECONNABORTED") {
        alert("The server took too long to respond. Check the backend and database connection.");
      } else {
        alert("Network error, please check your connection.");
      }
      console.error("Network error, please try again.", error);
    } else {
      console.error("Error", error.message);
    }
    return Promise.reject(error);
  }
);

export default AxiosWrapper;
