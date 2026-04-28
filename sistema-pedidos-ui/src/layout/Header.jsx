import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/img/zoom.png";
import { useNavigate } from "react-router-dom";

const Header = ({ onToggleSidebar, onCollapseSidebar, collapsed }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    window.location.href = "/login";
  };

  // Iniciales para avatar: preferir First + Last, si no username
  const getInitials = () => {
    const first = user?.first_name?.trim();
    const last = user?.last_name?.trim();
    if (first || last) {
      return ((first?.charAt(0) || "") + (last?.charAt(0) || "")).toUpperCase();
    }
    return (user?.username?.charAt(0) || "U").toUpperCase();
  };

  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: theme.palette.primary.main,
        color: "#fff",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
        {/* LEFT: logo + hamburguesa */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Logo (clicable) */}
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: { xs: 28, sm: 40 }, // más pequeño en ambos tamaños
              width: { xs: 90, sm: 140 }, // ancho proporcional
              cursor: "pointer",
              display: { xs: "none", sm: "block" }, // oculto en móviles si querés
              objectFit: "contain",
            }}
            onClick={() => (window.location.href = "/dashboard")}
          />

          {/* Botón hamburguesa: en móvil abre drawer; en desktop colapsa */}
          {isMobile ? (
            <IconButton
              color="inherit"
              onClick={onToggleSidebar}
              aria-label="Abrir menú"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              onClick={onCollapseSidebar}
              aria-label="Colapsar menú"
            >
              {collapsed ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
          )}

          {/* Título (oculto en móviles para ahorrar espacio) */}
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              display: { xs: "none", sm: "block" },
              fontWeight: 600,
            }}
          >
            Sistema de Pedidos
          </Typography>
        </Box>

        {/* RIGHT: usuario (avatar) + rol + menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Mostrar rol, username y nombre completo (oculto en xs) */}
          {user && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                textAlign: "right",
                mr: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}
              >
                Rol: {user.role || "Sin rol"}
              </Typography>
              {user && (
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.85)" }}
                >
                  Usuario: {user.first_name || ""} {user.last_name || ""}
                </Typography>
              )}
            </Box>
          )}

          {/* Avatar que abre el menú */}
          <Tooltip title="Abrir menú de usuario">
            <IconButton onClick={handleMenuOpen} color="inherit" sx={{ p: 0 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#fff",
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                }}
              >
                {getInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Menú desplegable (card) */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 240,
                borderRadius: 2,
                bgcolor: "#fff",
                color: " #1e1e1e",
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, textAlign: "center" }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.light,
                  color: "#000",
                  width: 56,
                  height: 56,
                  mx: "auto",
                  mb: 1,
                  fontWeight: 700,
                }}
              >
                {getInitials()}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {user?.first_name || ""} {user?.last_name || ""}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}></Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "#000)",
                  mt: 0.5,
                }}
              >
                {user?.role || "Sin rol"}
              </Typography>
            </Box>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.08)" }} />

            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/perfil");
              }}
              sx={{ color: "#000", gap: 1 }}
            >
              <AccountCircleIcon fontSize="small" />
              <Typography variant="body2">Ver perfil</Typography>
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              sx={{ color: "#fc0707ff", gap: 1 }}
            >
              <LogoutIcon fontSize="small" />
              <Typography variant="body2">Cerrar sesión</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
