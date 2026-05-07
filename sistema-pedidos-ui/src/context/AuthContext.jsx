import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { logoutUser } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Inicializar autenticación
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("me/");
        setUser(res.data);
      } catch (error) {
        console.log("❌ Token inválido o expirado");
        logoutUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔐 login (solo guarda usuario)
  const login = (userData) => {
    setUser(userData);
  };

  // 🚪 logout limpio
  const logout = () => {
    setUser(null);
    logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook
export const useAuth = () => useContext(AuthContext);