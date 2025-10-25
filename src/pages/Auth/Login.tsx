// src/pages/Auth/Login.tsx
import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../api/firebase';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Link } from '@mui/material';

// 👇 ¡FIX! La ruta de importación ahora apunta a 'contexts'
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const { currentUser, userRole } = useAuth();

  // Efecto para redirigir si el usuario ya está logueado
  useEffect(() => {
    if (currentUser && userRole) {
      navigate(userRole === 'patient' ? '/patient/dashboard' : '/clinician/dashboard');
    }
  }, [currentUser, userRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No necesitamos navegar, el 'useEffect' de arriba lo hará
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Iniciar Sesión</Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            id="email" 
            label="Correo Electrónico" 
            name="email" 
            autoComplete="email" 
            autoFocus 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            margin="normal" 
            required 
            fullWidth 
            name="password" 
            label="Contraseña" 
            type="password" 
            id="password" 
            autoComplete="current-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>
          <Link href="/signup" variant="body2">
            {"¿No tienes una cuenta? Regístrate"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;