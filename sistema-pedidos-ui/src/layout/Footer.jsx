import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => (
  <Box
    sx={{
      bgcolor: "#1976d2",
      color: "#fff",
      textAlign: "center",
      py: 1,
      mt: "auto", // clave: empuja footer al final
    }}
  >
    <Typography variant="body2">© 2025 Sistema de Pedidos</Typography>
  </Box>
);

export default Footer;
