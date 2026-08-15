// ====================================
// src/components/admin/auth/ProtectedRoute.jsx - Protección de rutas administrativas
// ====================================
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar loader mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pet-50 font-admin">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-pet-100 border-t-pet-600"></div>
          <p className="mt-4 text-sm font-medium text-pet-700">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
};

export default ProtectedRoute;
