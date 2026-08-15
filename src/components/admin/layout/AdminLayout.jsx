// ====================================
// src/components/admin/layout/AdminLayout.jsx - Layout principal del panel admin
// ====================================
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="h-screen flex bg-pet-50 font-admin overflow-hidden">
      {/* Sidebar para móvil - Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-pet-900/70"
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-pet-900 shadow-2xl">
            <Sidebar 
              onClose={() => setSidebarOpen(false)} 
              onLogout={handleLogout} 
            />
          </div>
        </div>
      )}

      {/* Sidebar para desktop - Fijo a la izquierda */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar 
            onLogout={handleLogout} 
          />
        </div>
      </div>

      {/* Área principal - Header + Contenido */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Altura fija y compacta */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Contenido principal - Scrolleable */}
        <main className="flex-1 overflow-y-auto bg-pet-50">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
