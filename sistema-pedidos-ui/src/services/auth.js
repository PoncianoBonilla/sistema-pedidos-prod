// services/auth.js
import api from "./api";

export const loginUser = async (username, password) => {
  try {
    console.log("🔐 [auth.js] Iniciando login para:", username);
    
    const { data } = await api.post("token/", { username, password });
    console.log("✅ [auth.js] Tokens recibidos");
    
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    console.log("💾 [auth.js] Tokens guardados");
    
    console.log("👤 [auth.js] Solicitando información del usuario...");
    const userRes = await api.get("me/");
    console.log("✅ [auth.js] Usuario obtenido:", userRes.data);
    
    return { success: true, user: userRes.data };
  } catch (error) {
    console.error("❌ [auth.js] Error en login:", error);
    console.error("   Response:", error.response?.data);
    console.error("   Status:", error.response?.status);
    
    let errorMessage = "Error desconocido";
    if (error.response?.status === 401) {
      errorMessage = "Credenciales incorrectas. Usuario: administrador / admin12345";
    } else if (error.response?.status === 404) {
      errorMessage = "Endpoint no encontrado. Verifica que Django esté corriendo";
    } else if (error.code === "ERR_NETWORK") {
      errorMessage = "Error de conexión con el servidor. Por favor, intente más tarde.";
    } else {
      errorMessage = error.response?.data?.detail || error.message || "Error desconocido";
    }
    
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  console.log("👋 Sesión cerrada");
};