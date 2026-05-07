import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // ⏳ mientras se verifica sesión
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
            <p>Cargando...</p>
        </div>;
  }

  // 🔐 si no hay usuario autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ acceso permitido
  return <Outlet />;
};

export default ProtectedRoute;