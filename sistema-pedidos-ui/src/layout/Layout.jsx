import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleDrawer = () => setMobileOpen(!mobileOpen);
  const handleCollapseSidebar = () => setCollapsed(!collapsed);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "row" }}>
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleToggleDrawer}
        collapsed={collapsed}
      />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column", // importante para que footer se quede al final
          width: { sm: `calc(100% - ${collapsed ? 70 : 240}px)` },
        }}
      >
        <Header
          onToggleSidebar={handleToggleDrawer}
          onCollapseSidebar={handleCollapseSidebar}
          collapsed={collapsed}
        />

        {/* Toolbar para evitar solapamiento */}
        <Toolbar />

        {/* Contenido de página */}
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Outlet />
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
