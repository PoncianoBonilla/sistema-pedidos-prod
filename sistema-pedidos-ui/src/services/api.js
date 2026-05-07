import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
  timeout: 10000,
});

// ======================
// REQUEST
// ======================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  config.headers = config.headers || {};
  config.headers["Content-Type"] = "application/json";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ======================
// RESPONSE (CON REFRESH)
// ======================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el token expiró
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");

        if (!refresh) throw new Error("No refresh token");

        console.log("🔄 Intentando refrescar token...");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access_token", newAccess);

        // actualizar header y reintentar request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch (refreshError) {
        console.log("❌ Refresh falló, cerrando sesión");

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;