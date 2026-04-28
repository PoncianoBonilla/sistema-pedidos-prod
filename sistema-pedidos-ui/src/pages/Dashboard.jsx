import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Container sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Dashboard, {user?.name}
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Container>
  );
};

export default Dashboard;
