import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // REQUIRED for cookies
});

// interceptor logic goes here
api.interceptors.response.use(
  (res) => res,

  async (err) => {
    const originalRequest = err.config;

    // 🔄 ONLY refresh expired token
    if (
      err.response?.status === 401 &&
      err.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // ❌ Invalid token only
    if (err.response?.data?.code === "INVALID_TOKEN") {
      window.location.href = "/login";
    }

    // 🚫 DO NOT redirect on NO_TOKEN
    // this just means user is logged out

    return Promise.reject(err);
  },
);
