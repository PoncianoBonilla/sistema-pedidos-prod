// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    city: "",
    address: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (user) {
      api.get("me/")
        .then((res) => {
          setFormData({ ...res.data, new_password: "" });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar perfil:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.new_password) delete payload.new_password;

      const res = await api.put(`users/${user.id}/`, payload);
      setFormData((prev) => ({ ...prev, new_password: "" }));
      setUser(res.data);

      // Mostrar snackbar y redirigir después de 1 segundo
      setSnackbar({ open: true, message: "Perfil actualizado correctamente", severity: "success" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data || "Error al actualizar perfil";
      setSnackbar({ open: true, message: JSON.stringify(errorMsg), severity: "error" });
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Mi Perfil
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Campos de usuario */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              name="username"
              label="Usuario"
              value={formData.username}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="first_name"
              label="Nombres"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="last_name"
              label="Apellidos"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="phone"
              label="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="role"
              label="Rol"
              value={formData.role}
              disabled
              fullWidth
            />
            <TextField
              name="status"
              label="Estado"
              value={formData.status}
              disabled
              fullWidth
            />
            <TextField
              name="city"
              label="Ciudad"
              value={formData.city}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="address"
              label="Dirección"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="new_password"
              type="password"
              label="Nueva contraseña"
              value={formData.new_password}
              onChange={handleChange}
              fullWidth
              helperText="Dejar vacío si no deseas cambiarla"
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "#00e0ff", color: "#000", flex: 1 }}
            >
              Guardar cambios
            </Button>
            <Button
              variant="outlined"
              sx={{ flex: 1 }}
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar para alertas */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Perfil;
