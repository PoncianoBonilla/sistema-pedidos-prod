// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./layout/Layout";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClienteList from "./pages/clientes/ClienteList";
import ProductoList from "./pages/productos/ProductoList";
import PedidoList from "./pages/pedidos/PedidoList";
import UsuariosPage from "./pages/usuarios/UsuariosPage";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Página de Login */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Rutas protegidas dentro del layout */}
      <Route
        path="/"
        element={user ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="clientes" element={<ClienteList />} />
        <Route path="productos" element={<ProductoList />} />
        <Route path="pedidos" element={<PedidoList />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
