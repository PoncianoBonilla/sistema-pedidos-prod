import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { logoutUser } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Recuperar usuario al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api
        .get("me/")  // el interceptor agrega el token automáticamente
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    logoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
