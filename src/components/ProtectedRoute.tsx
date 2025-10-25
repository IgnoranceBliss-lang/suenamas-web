// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// 👇 ¡FIX! La ruta de importación ahora apunta a 'contexts'
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: Array<'patient' | 'clinician'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return userRole && allowedRoles.includes(userRole)? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;