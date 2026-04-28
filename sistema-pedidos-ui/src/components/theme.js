// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // azul
    },
    secondary: {
      main: "#f50057", // rosa
    },
    background: {
      default: "#f4f6f8", // color de fondo global
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
