// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import PatientDashboard from './pages/Patient/Dashboard';
import ClinicianDashboard from './pages/Clinician/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Redirige a login por defecto */}
        <Route path="/unauthorized" element={<h1>No tienes permiso para ver esta página.</h1>} />

        {/* Rutas Protegidas para Pacientes */}
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          {/* Añadir más rutas de paciente aquí, como /patient/history */}
        </Route>

        {/* Rutas Protegidas para Clínicos */}
        <Route element={<ProtectedRoute allowedRoles={['clinician']} />}>
          <Route path="/clinician/dashboard" element={<ClinicianDashboard />} />
          {/* Añadir más rutas de clínico aquí, como /clinician/patient/:id */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;