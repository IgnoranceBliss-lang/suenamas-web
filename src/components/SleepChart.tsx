// src/components/SleepChart.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Definimos un tipo para los datos que esperamos
interface SleepLogData {
  logDate: {
    toDate: () => Date;
  } | null;
  sleepQuality: number;
  mood: number;
  stressLevel: number;
  [key: string]: any; // Permite otras propiedades
}

interface SleepChartProps {
  data: SleepLogData[]; // Usamos nuestro tipo específico
}

const SleepChart: React.FC<SleepChartProps> = ({ data }) => {
  // Formatear los datos para que el gráfico pueda leerlos
  const formattedData = data
    .map((log) => ({
      ...log,
      // Formatea la fecha a un string legible. Si no hay fecha, muestra N/A
      date: log.logDate?.toDate().toLocaleDateString() ?? "N/A",
    }))
    .reverse(); // Revertir para mostrar en orden cronológico (del más antiguo al más nuevo)

  return (
    // ResponsiveContainer hace que el gráfico se ajuste al tamaño de su contenedor
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />

        {/* ⭐ CORRECCIÓN 2: El dominio (escala) es de 1 a 5 */}
        <YAxis domain={[1, 5]} allowDecimals={false} />

        <Tooltip />
        <Legend />

        {/* Líneas para cada métrica */}
        <Line
          type="monotone"
          dataKey="sleepQuality"
          name="Calidad de Sueño"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="mood" name="Ánimo" stroke="#82ca9d" />
        <Line
          type="monotone"
          dataKey="stressLevel"
          name="Estrés"
          stroke="#ffc658"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SleepChart;
