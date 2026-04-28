import React from "react";
import { Container, Typography } from "@mui/material";

const PedidoList = () => {
  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Pedidos
      </Typography>
      <Typography>Acá irán los pedidos del sistema.</Typography>
    </Container>
  );
};

export default PedidoList;
