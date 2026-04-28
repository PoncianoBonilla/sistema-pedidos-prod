// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 10000,
});

// Log de cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`);
  console.log("   Headers:", config.headers);
  console.log("   Data:", config.data);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("   Token añadido:", token.substring(0, 50) + "...");
  } else {
    console.log("   Sin token");
  }
  return config;
});

// Log de cada respuesta
api.interceptors.response.use(
  (response) => {
    console.log(`📥 [${response.config.method?.toUpperCase()}] ${response.config.url} - Status: ${response.status}`);
    console.log("   Data:", response.data);
    return response;
  },
  (error) => {
    console.error(`❌ Error en ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error("   Status:", error.response?.status);
    console.error("   Data:", error.response?.data);
    console.error("   Message:", error.message);
    return Promise.reject(error);
  }
);

export default api;