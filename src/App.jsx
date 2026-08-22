// ====================================
// src/App.jsx - Aplicación principal con routing integrado
// ====================================
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LuPawPrint } from 'react-icons/lu';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/auth/ProtectedRoute';
import AdminLayout from './components/admin/layout/AdminLayout';

// Páginas públicas
import Memorial from './pages/Memorial';

// Páginas administrativas
import LoginPage from './pages/admin/Login';
import DashboardPage from './pages/admin/Dashboard';
import ClientsPage from './pages/admin/Clients';
import NewClientPage from './pages/admin/NewClient';
import ClientDetailsPage from './pages/admin/ClientDetails';
import MemorialsPage from './pages/admin/Memorials';
import NewMemorialPage from './pages/admin/NewMemorial';
import PrintQRPage from './pages/admin/PrintQR';
import MemorialComentarios from './pages/admin/MemorialComentarios';
import QRManagement from './pages/admin/QRManagement';
import MediaManagement from './pages/admin/MediaManagement';

import './App.css';

// 🔧 NUEVO: Componente para manejar clases CSS del body
const BodyClassManager = () => {
  const location = useLocation();
  
  useEffect(() => {
    const body = document.body;
    
    // Limpiar clases anteriores
    body.classList.remove('admin-layout', 'default-layout', 'memorial-layout');
    
    // Aplicar clase según la ruta
    if (location.pathname.startsWith('/admin')) {
      body.classList.add('admin-layout');
    } else if (location.pathname.startsWith('/memorial/')) {
      body.classList.add('memorial-layout');
    } else {
      body.classList.add('default-layout');
    }
    
    // Cleanup al desmontar
    return () => {
      body.classList.remove('admin-layout', 'default-layout', 'memorial-layout');
    };
  }, [location.pathname]);
  
  return null;
};

// Página de inicio temporal (puedes personalizarla)
const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pet-50 font-admin">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-pet-900 text-white shadow-sm">
          <LuPawPrint className="h-12 w-12" aria-hidden="true" />
        </div>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-pet-900">
          Lazos de Vida Pets
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Memoriales Digitales para Mascotas
        </p>
        <div className="space-x-4">
          <a
            href="/admin"
            className="inline-flex items-center rounded-lg border border-transparent bg-pet-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pet-800"
          >
            Panel Administrativo
          </a>
        </div>
      </div>
    </div>
  );
};

// Componente para páginas no encontradas
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
        <a
          href="/"
          className="inline-flex items-center rounded-lg border border-transparent bg-pet-700 px-4 py-2 text-sm font-medium text-white hover:bg-pet-800"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <BodyClassManager />
          <Routes>
            {/* Ruta de inicio */}
            <Route path="/" element={<HomePage />} />
            
            {/* Rutas públicas de memoriales */}
            <Route path="/memorial/:qrCode" element={<Memorial />} />
            
            {/* Ruta de login administrativo */}
            <Route path="/admin/login" element={<LoginPage />} />
            
            {/* Rutas administrativas protegidas */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard principal */}
              <Route index element={<DashboardPage />} />
              
              {/* Gestión de clientes */}
              <Route path="clients" element={<ClientsPage />} />
              <Route path="clients/new" element={<NewClientPage />} />
              <Route path="clients/:id" element={<ClientDetailsPage />} />
              <Route path="clients/:id/edit" element={<NewClientPage />} />
              
              {/* Gestión de memoriales */}
              <Route path="memorials" element={<MemorialsPage />} />
              <Route path="memorials/new/:clientId" element={<NewMemorialPage />} />
              <Route path="memorials/edit/:memorialId" element={<NewMemorialPage />} />
              <Route path="memorials/:memorialId/print-qr" element={<PrintQRPage />} />
              <Route path="memorials/:memorialId/comentarios" element={<MemorialComentarios />} />
              
              {/* Gestión de Media */}
              <Route path="media" element={<MediaManagement />} />
              
              {/* Gestión de QR */}
              <Route path="qr-codes" element={<QRManagement />} />
              
              {/* Reportes */}
              <Route path="reports" element={<div>Reportes (por implementar)</div>} />
              
              {/* Configuración */}
              <Route path="settings" element={<div>Configuración (por implementar)</div>} />
            </Route>
            
            {/* Redirección de /admin a /admin/login si no está autenticado */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            
            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
