import React, { useState } from "react";
import { Box, Container, Paper, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/auth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("=== INICIO DE LOGIN ===");
    console.log("Usuario ingresado:", username);
    console.log("Password ingresada:", password ? "***" : "vacía");
    
    if (!username || !password) {
      console.log("Error: Campos vacíos");
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");
    
    console.log("Llamando a loginUser...");
    const res = await loginUser(username, password);
    
    console.log("Respuesta de loginUser:", res);
    console.log("Success:", res.success);
    console.log("Error:", res.error);
    
    if (res.success) {
      console.log("Login exitoso, usuario:", res.user);
      console.log("Redirigiendo a /dashboard");
      login(res.user);
      navigate("/dashboard");
    } else {
      console.error("Login fallido:", res.error);
      setError(res.error);
    }
    
    setLoading(false);
    console.log("=== FIN DE LOGIN ===");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#121212" }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 3, bgcolor: "#1e1e1e", color: "#fff" }} elevation={8}>
          <Typography variant="h5" align="center" sx={{ color: "#00e0ff", fontWeight: "bold", mb: 2 }}>
            Iniciar Sesión
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Usuario"
              variant="filled"
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "#fff" } }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="filled"
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "#fff" } }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {error && (
              <Typography color="error" align="center" mt={1}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                py: 1.5, 
                bgcolor: "#00e0ff", 
                color: "#000", 
                "&:hover": { bgcolor: "#00c4cc" },
                "&.Mui-disabled": { bgcolor: "#666" }
              }}
            >
              {loading ? "Verificando..." : "Entrar"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;