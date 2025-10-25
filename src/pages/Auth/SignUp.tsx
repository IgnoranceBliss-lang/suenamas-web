// src/pages/Auth/SignUp.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../api/firebase';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 👇 ¡FIX CRÍTICO! Esta era la línea que estaba rota.
  const [role, setRole] = useState<'patient' | 'clinician'>('patient');
  
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Guardar el rol en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date(),
      });
      navigate(role === 'patient'? '/patient/dashboard' : '/clinician/dashboard');
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Error al registrarse. Revisa la consola para más detalles.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Registrarse</Typography>
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Correo Electrónico" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Soy un...</FormLabel>
            <RadioGroup row value={role} onChange={(e) => setRole(e.target.value as 'patient' | 'clinician')}>
              <FormControlLabel value="patient" control={<Radio />} label="Paciente" />
              <FormControlLabel value="clinician" control={<Radio />} label="Clínico" />
            </RadioGroup>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Registrarse</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;