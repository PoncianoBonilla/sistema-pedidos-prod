// services/auth.js
import api from "./api";

export const loginUser = async (username, password) => {
  try {
    console.log("🔐 Login:", username);

    const { data } = await api.post("token/", { username, password });

    // ✔ Validar respuesta
    if (!data?.access || !data?.refresh) {
      throw new Error("Tokens no válidos");
    }

    // ✔ Guardar tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    console.log("💾 Tokens guardados");

    // ✔ Obtener usuario
    const userRes = await api.get("me/");
    const user = userRes.data;

    if (!user) throw new Error("No se pudo obtener el usuario");

    console.log("👤 Usuario:", user);

    return { success: true, user };

  } catch (error) {
    console.error("❌ Error login:", error);

    // 🔥 limpiar sesión por seguridad
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    let errorMessage = "Error desconocido";

    if (error.response?.status === 401) {
      errorMessage = "Usuario o contraseña incorrectos";
    } else if (error.response?.status === 404) {
      errorMessage = "API no disponible";
    } else if (error.code === "ERR_NETWORK") {
      errorMessage = "No se puede conectar al servidor";
    } else {
      errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.non_field_errors?.[0] ||
        error.message ||
        "Error desconocido";
    }

    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  console.log("👋 Sesión cerrada");
};

// 🔥 NUEVO: verificar si está logueado
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

// 🔥 NUEVO: obtener usuario desde API
export const getCurrentUser = async () => {
  try {
    const res = await api.get("me/");
    return res.data;
  } catch {
    return null;
  }
};