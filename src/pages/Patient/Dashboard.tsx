// src/pages/Patient/Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../api/firebase";
import { useAuth } from "../../contexts/AuthContext";
import SleepChart from "../../components/SleepChart"; // Componente del gráfico
import ReportExporter from "../../components/ReportExporter";
import { Container, Typography, Box, Button, Slider } from "@mui/material";

import { Timestamp } from "firebase/firestore";

// Definimos un tipo para nuestros registros de sueño
interface SleepLog {
  id: string;
  patientId: string;
  logDate: Timestamp;
  sleepQuality: number;
  mood: number;
  stressLevel: number;
}

const PatientDashboard: React.FC = () => {
  // Estados para el formulario
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [mood, setMood] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<number>(3);

  // Estado para los datos del gráfico
  const [chartData, setChartData] = useState<SleepLog[]>([]);

  // Obtenemos el usuario actual de nuestro contexto
  const { currentUser } = useAuth();

  // Usamos React.useCallback para estabilizar la función
  const fetchSleepLogs = React.useCallback(async () => {
    if (!currentUser) return;

    const q = query(
      collection(db, "sleepLogs"),
      where("patientId", "==", currentUser.uid),
      orderBy("logDate", "desc"),
    );

    try {
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as SleepLog[];

      setChartData(logs);
    } catch (error) {
      console.error("Error al cargar los registros: ", error);
    }
  }, [currentUser]);

  // Ahora el useEffect depende de 'fetchSleepLogs'
  useEffect(() => {
    fetchSleepLogs();
  }, [fetchSleepLogs]);

  // Función para manejar el envío del formulario
  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "sleepLogs"), {
        patientId: currentUser.uid,
        logDate: serverTimestamp(),
        sleepQuality: sleepQuality,
        mood: mood,
        stressLevel: stressLevel,
      });
      alert("¡Registro guardado!");

      setSleepQuality(3);
      setMood(3);
      setStressLevel(3);

      fetchSleepLogs(); // Vuelve a cargar los datos
    } catch (error) {
      console.error("Error al guardar el registro:", error);
      alert("Hubo un error al guardar tu registro.");
    }
  };

  // Marcas para los sliders
  const marks = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Dashboard del Paciente
      </Typography>

      {/* Formulario de Registro */}
      <Box
        component="form"
        onSubmit={handleLogSubmit}
        sx={{ mb: 6, p: 3, border: "1px solid #ddd", borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          Nuevo Registro de Sueño
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography gutterBottom>
              Calidad de Sueño (1 = Mala, 5 = Excelente)
            </Typography>
            <Slider
              value={sleepQuality}
              onChange={(_, newValue) => setSleepQuality(newValue as number)}
              aria-labelledby="sleep-quality-slider"
              valueLabelDisplay="auto"
              step={1}
              marks={marks}
              min={1}
              max={5}
            />
          </Box>
          <Box>
            <Typography gutterBottom>
              Ánimo al Despertar (1 = Malo, 5 = Excelente)
            </Typography>
            <Slider
              value={mood}
              onChange={(_, newValue) => setMood(newValue as number)}
              aria-labelledby="mood-slider"
              valueLabelDisplay="auto"
              step={1}
              marks={marks}
              min={1}
              max={5}
            />
          </Box>
          <Box>
            <Typography gutterBottom>
              Nivel de Estrés Percibido (1 = Bajo, 5 = Alto)
            </Typography>
            <Slider
              value={stressLevel}
              onChange={(_, newValue) => setStressLevel(newValue as number)}
              aria-labelledby="stress-slider"
              valueLabelDisplay="auto"
              step={1}
              marks={marks}
              min={1}
              max={5}
            />
          </Box>
          <Box>
            <Button type="submit" variant="contained" size="large" fullWidth>
              Guardar Registro
            </Button>
          </Box>
        </Box>
      </Box>

      {/* El exportador */}
      <div id="mi-reporte-paciente">
        <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
          Historial de Sueño
        </Typography>
        <Box sx={{ height: 400, backgroundColor: "white" }}>
          {chartData.length > 0 ? (
            <SleepChart data={chartData} />
          ) : (
            <Typography>
              Aún no tienes registros para mostrar en el gráfico.
            </Typography>
          )}
        </Box>
      </div>
      <Box sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <ReportExporter reportId="mi-reporte-paciente" />
      </Box>
    </Container>
  );
};

export default PatientDashboard;
