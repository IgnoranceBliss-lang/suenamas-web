// src/pages/Clinician/Dashboard.tsx
import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../api/firebase"; // Nuestra conexión a Firebase
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

const ClinicianDashboard: React.FC = () => {
  // Estado para guardar el email que el clínico escribe
  const [patientEmailToInvite, setPatientEmailToInvite] = useState("");

  // Estado para saber si estamos "cargando" (esperando respuesta del servidor)
  const [loading, setLoading] = useState(false);

  // Estado para mostrar mensajes de éxito o error
  const [message, setMessage] = useState({ type: "", text: "" });

  /**
   * Se llama al enviar el formulario.
   */
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!patientEmailToInvite) return;

    setLoading(true);
    setMessage({ type: "", text: "" }); // Limpia mensajes anteriores

    // Prepara la llamada a 'invitePatient'
    const invitePatientFn = httpsCallable(functions, "invitePatient");

    try {
      // Llama a la función y le pasa el email
      const result = await invitePatientFn({ email: patientEmailToInvite });

      // Muestra el mensaje de éxito que viene desde la Cloud Function
      setMessage({ type: "success", text: (result.data as any).message });
      setPatientEmailToInvite(""); // Limpia el campo de texto
    } catch (error: any) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false); // Deja de cargar, sin importar si fue exito o error
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Dashboard del Clínico
      </Typography>

      {/* Formulario para invitar pacientes */}
      <Box
        component="form"
        onSubmit={handleInvite}
        sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          Invitar Paciente
        </Typography>
        <Typography variant="body2" gutterBottom>
          Ingresa el correo electrónico del paciente que ya se registró en la
          plataforma.
        </Typography>

        <TextField
          label="Email del Paciente"
          type="email"
          fullWidth
          required
          value={patientEmailToInvite}
          onChange={(e) => setPatientEmailToInvite(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading} // Deshabilita el boton mientras carga
        >
          {loading ? <CircularProgress size={24} /> : "Conectar con Paciente"}
        </Button>

        {/* Espacio para mostrar mensajes de éxito o error */}
        {message.text && (
          <Alert severity={message.type as "success" | "error"} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}
      </Box>

      {/* Aquí añadan luego la lista de pacientes ya conectados y la sección de alertas */}
    </Container>
  );
};

export default ClinicianDashboard;
