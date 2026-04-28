import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard,
  People,
  ShoppingCart,
  Inventory,
  Person,
  ExpandLess,
  ExpandMore,
  GroupAdd,
  ListAlt,
  AddBox,
  Category,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ collapsed, mobileOpen, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleToggleSubmenu = (text) => {
    setOpenSubmenus((prev) => ({ ...prev, [text]: !prev[text] }));
  };

  // 🔹 Menú principal con submenús
  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
    { text: "Usuarios", path: "/usuarios", icon: <People /> },
    {
      text: "Clientes",
      icon: <People />,
      children: [
        { text: "Lista de clientes", path: "/clientes", icon: <ListAlt /> },
        { text: "Agregar cliente", path: "/clientes/nuevo", icon: <GroupAdd /> },
      ],
    },
    {
      text: "Productos",
      icon: <Inventory />,
      children: [
        { text: "Lista de productos", path: "/productos", icon: <Category /> },
        { text: "Agregar producto", path: "/productos/nuevo", icon: <AddBox /> },
      ],
    },
    { text: "Pedidos", path: "/pedidos", icon: <ShoppingCart /> },
  ];

  // 🔒 Solo los administradores ven el menú de Perfil
  if (user?.role === "Admin" || user?.profile?.role === "Admin") {
    menuItems.push({
      text: "Perfil",
      path: "/perfil",
      icon: <Person />,
    });
  }

  // 🎨 Renderizado del menú (con soporte para submenús)
  const renderMenuItem = (item) => {
    const selected = location.pathname === item.path;

    if (item.children) {
      const isOpen = openSubmenus[item.text] || false;

      const parentButton = (
        <ListItemButton
          key={item.text}
          onClick={() => handleToggleSubmenu(item.text)}
          sx={{
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 2 : 3,
            py: 1.2,
            my: 0.5,
            borderRadius: 2,
            mx: 1,
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 0 : 2,
              color: "#e0e0e0",
              justifyContent: "center",
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!collapsed && (
            <>
              <ListItemText primary={item.text} />
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItemButton>
      );

      return (
        <React.Fragment key={item.text}>
          {collapsed ? (
            <Tooltip title={item.text} placement="right" arrow enterDelay={300}>
              {parentButton}
            </Tooltip>
          ) : (
            parentButton
          )}

          <Collapse in={isOpen && !collapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: collapsed ? 0 : 4 }}>
              {item.children.map((sub) => {
                const selected = location.pathname === sub.path;
                const subButton = (
                  <ListItemButton
                    key={sub.text}
                    component={Link}
                    to={sub.path}
                    selected={selected}
                    onClick={() => {
                      if (isMobile) onClose();
                    }}
                    sx={{
                      justifyContent: collapsed ? "center" : "flex-start",
                      px: collapsed ? 2 : 3,
                      py: 1,
                      my: 0.3,
                      mx: 1,
                      borderRadius: 2,
                      color: "#fff",
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255,255,255,0.2)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: collapsed ? 0 : 2,
                        color: "#e0e0e0",
                        justifyContent: "center",
                      }}
                    >
                      {sub.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={sub.text}
                        primaryTypographyProps={{
                          fontSize: 13,
                        }}
                      />
                    )}
                  </ListItemButton>
                );

                return collapsed ? (
                  <Tooltip
                    key={sub.text}
                    title={sub.text}
                    placement="right"
                    arrow
                    enterDelay={300}
                  >
                    {subButton}
                  </Tooltip>
                ) : (
                  subButton
                );
              })}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    // Ítems sin submenús
    const button = (
      <ListItemButton
        key={item.text}
        component={Link}
        to={item.path}
        selected={selected}
        onClick={() => {
          if (isMobile) onClose();
        }}
        sx={{
          justifyContent: collapsed ? "center" : "flex-start",
          px: collapsed ? 2 : 3,
          py: 1.2,
          my: 0.5,
          borderRadius: 2,
          mx: 1,
          color: "#fff",
          "&.Mui-selected": {
            backgroundColor: "rgba(255,255,255,0.15)",
          },
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: collapsed ? 0 : 2,
            color: "#e0e0e0",
            justifyContent: "center",
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: selected ? "bold" : "normal",
            }}
          />
        )}
      </ListItemButton>
    );

    return collapsed ? (
      <Tooltip
        key={item.text}
        title={item.text}
        placement="right"
        arrow
        enterDelay={300}
      >
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  const drawerContent = <List sx={{ mt: 8 }}>{menuItems.map(renderMenuItem)}</List>;

  // 🎯 Drawer principal
  return isMobile ? (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 70 : 240,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: collapsed ? 70 : 240,
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
