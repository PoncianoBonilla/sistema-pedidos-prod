import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  { id: 1, nombre: "Admin" },
  { id: 2, nombre: "Vendedor" },
  { id: 3, nombre: "Almacen" },
  { id: 4, nombre: "Comprador" },
];

const STATUS = [
  { id: 1, nombre: "Activo" },
  { id: 2, nombre: "Inactivo" },
];

const UsuariosPage = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: 4, // Comprador
    status: 1, // Activo
    phone: "",
    city: "",
    address: "",
  });

  // 🚀 Cargar usuarios
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get("users/");
      // Mapear roles y status a id para DataGrid
      const data = res.data.map(u => ({
        ...u,
        rol_id: ROLES.find(r => r.nombre === u.role)?.id ?? 4,
        status_id: STATUS.find(s => s.nombre === u.status)?.id ?? 1,
      }));
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      showAlert("Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        password: "",
        role: user.rol_id,
        status: user.status_id,
        phone: user.phone,
        city: user.city,
        address: user.address,
      });
    } else {
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        role: 4,
        status: 1,
        phone: "",
        city: "",
        address: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        role: ROLES.find(r => r.id === formData.role)?.nombre,
        status: STATUS.find(s => s.id === formData.status)?.nombre,
      };

      if (selectedUser) {
        await api.put(`users/${selectedUser.id}/`, payload);
        showAlert("Usuario actualizado correctamente");
      } else {
        await api.post("users/", payload);
        showAlert("Usuario creado exitosamente");
      }
      fetchUsuarios();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showAlert(error.response?.data?.detail || "Error al guardar el usuario", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await api.delete(`users/${id}/`);
        showAlert("Usuario eliminado correctamente");
        fetchUsuarios();
      } catch (error) {
        console.error(error);
        showAlert(error.response?.data?.detail || "No se puede eliminar este usuario", "error");
      }
    }
  };

  // 🚫 Solo Admin
  const userRole = user?.role || user?.profile?.role;
  if (userRole !== "Admin") {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          Acceso denegado. Solo los administradores pueden gestionar usuarios.
        </Typography>
      </Box>
    );
  }

  // 🔹 Columnas DataGrid
  const columns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "username",
    headerName: "Usuario",
    flex: 1,
    renderCell: (params) => params?.row?.username ?? "",
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    renderCell: (params) => params?.row?.email ?? "",
  },
  {
    field: "full_name",
    headerName: "Nombre Completo",
    flex: 1.5,
    renderCell: (params) => {
      const first = params?.row?.first_name ?? "";
      const last = params?.row?.last_name ?? "";
      return `${first} ${last}`.trim();
    },
  },
  {
    field: "rol_id",
    headerName: "Rol",
    flex: 1,
    renderCell: (params) => {
      const rolId = params?.row?.rol_id;
      const rol = ROLES.find((r) => r.id === rolId);
      return rol ? rol.nombre : "Sin rol";
    },
  },
  {
    field: "status_id",
    headerName: "Estado",
    flex: 1,
    renderCell: (params) => {
      const statusId = params?.row?.status_id;
      const st = STATUS.find((s) => s.id === statusId);
      return st ? st.nombre : "Sin estado";
    },
  },
  {
    field: "actions",
    headerName: "Acciones",
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <>
        <IconButton color="primary" onClick={() => handleOpenModal(params?.row)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => handleDelete(params?.row?.id)}>
          <Delete />
        </IconButton>
      </>
    ),
  },
];


  return (
    <Box p={2}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        Gestión de Usuarios
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 2 }}
        onClick={() => handleOpenModal()}
      >
        Nuevo Usuario
      </Button>

      <Box sx={{ height: 500, width: "100%" }}>
        {loading ? (
          <Box textAlign="center" py={10}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={usuarios}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            autoHeight
            disableSelectionOnClick
          />
        )}
      </Box>

      {/* Modal Crear/Editar */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
            <TextField label="Usuario" name="username" value={formData.username} onChange={handleChange} fullWidth />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
            <TextField label="Nombre" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth />
            <TextField label="Apellido" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth />
            {!selectedUser && (
              <TextField label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />
            )}
            <TextField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
            <TextField label="Ciudad" name="city" value={formData.city} onChange={handleChange} fullWidth />
            <TextField label="Dirección" name="address" value={formData.address} onChange={handleChange} fullWidth />
            <TextField select label="Rol" name="role" value={formData.role} onChange={handleChange} fullWidth>
              {ROLES.map((r) => (<MenuItem key={r.id} value={r.id}>{r.nombre}</MenuItem>))}
            </TextField>
            <TextField select label="Estado" name="status" value={formData.status} onChange={handleChange} fullWidth>
              {STATUS.map((s) => (<MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>{selectedUser ? "Actualizar" : "Crear"}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar alertas */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsuariosPage;
