// ====================================
// src/components/admin/dashboard/Dashboard.jsx - Dashboard principal del admin
// ====================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPawPrint, LuPlus, LuQrCode, LuUserPlus } from 'react-icons/lu';
import { adminService } from '../../../services';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalClients: 0,
      totalMemorials: 0,
      totalQRs: 0
    },
    recentClients: [],
    recentMemorials: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar dashboard data del backend
      const data = await adminService.getDashboard();
      
      // Mapear los datos del backend a la estructura del frontend
      const mappedData = {
        stats: {
          totalClients: data.estadisticas?.clientes?.total || 0,
          totalMemorials: data.estadisticas?.memoriales?.total || 0,
          totalQRs: data.estadisticas?.qrs?.total ?? data.estadisticas?.memoriales?.total ?? 0,
          clientsChange: `+${data.estadisticas?.clientes?.nuevosEsteMes || 0}`,
          memorialsChange: `+${data.estadisticas?.memoriales?.nuevosEsteMes || 0}`,
          qrChange: `+${data.estadisticas?.qrs?.nuevosEsteMes ?? data.estadisticas?.memoriales?.nuevosEsteMes ?? 0}`,
          clientsChangeType: (data.estadisticas?.clientes?.nuevosEsteMes || 0) > 0 ? 'positive' : 'neutral',
          memorialsChangeType: (data.estadisticas?.memoriales?.nuevosEsteMes || 0) > 0 ? 'positive' : 'neutral',
          qrChangeType: (data.estadisticas?.qrs?.nuevosEsteMes ?? data.estadisticas?.memoriales?.nuevosEsteMes ?? 0) > 0 ? 'positive' : 'neutral'
        },
        recentClients: data.actividades?.clientesRecientes || [],
        recentMemorials: data.actividades?.memorialesRecientes || []
      };
      
      setDashboardData(mappedData);

    } catch (err) {
      setError(err.message);
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action, id = null) => {
    switch (action) {
      case 'new-client':
        navigate('/admin/clients/new');
        break;
      case 'new-memorial':
        if (id) {
          navigate(`/admin/memorials/new/${id}`);
        } else {
          navigate('/admin/clients');
        }
        break;
      case 'view-client':
        navigate(`/admin/clients/${id}`);
        break;
      case 'view-memorial':
        navigate('/admin/memorials');
        break;
      case 'print-qr':
        navigate(`/admin/memorials/${id}/print-qr`);
        break;
      case 'view-all-clients':
        navigate('/admin/clients');
        break;
      case 'view-all-memorials':
        navigate('/admin/memorials');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-pet-100 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="pet-admin-card p-6">
                  <div className="h-4 bg-pet-100 rounded mb-2"></div>
                  <div className="h-8 bg-pet-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto dashboard-container">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="mb-2 inline-flex items-center rounded-full bg-pet-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pet-700">
              <LuPawPrint className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Gestión de mascotas
            </div>
            <h2 className="text-2xl font-bold leading-7 tracking-tight text-pet-900 sm:text-3xl sm:truncate">
              Panel de Lazos de Vida Pets
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Clientes, memoriales y códigos QR en un solo lugar.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => handleQuickAction('new-client')}
              className="pet-admin-focus inline-flex items-center rounded-lg border border-transparent bg-pet-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-pet-800"
            >
              <LuPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nuevo Cliente
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tarjetas de estadísticas */}
        <StatsCards stats={dashboardData.stats} />

        {/* Actividad reciente */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentActivity
            title="Clientes Recientes"
            items={dashboardData.recentClients}
            type="clients"
            onAction={handleQuickAction}
          />
          <RecentActivity
            title="Memoriales Recientes"
            items={dashboardData.recentMemorials}
            type="memorials"
            onAction={handleQuickAction}
          />
        </div>

        {/* Acciones rápidas */}
        <div className="pet-admin-card mt-8 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="mb-1 text-lg font-semibold leading-6 text-pet-900">
              Acciones rápidas
            </h3>
            <p className="mb-4 text-sm text-gray-500">Atajos para las tareas más frecuentes del equipo.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleQuickAction('new-client')}
                className="pet-admin-focus group relative block w-full rounded-xl border border-pet-200 bg-pet-50/60 p-6 text-center transition-colors hover:border-pet-400 hover:bg-pet-50"
              >
                <LuUserPlus className="mx-auto h-8 w-8 text-pet-600 transition-colors group-hover:text-pet-800" aria-hidden="true" />
                <span className="mt-3 block text-sm font-medium text-pet-900">
                  Registrar Cliente
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/clients')}
                className="pet-admin-focus group relative block w-full rounded-xl border border-clay-200 bg-clay-50/60 p-6 text-center transition-colors hover:border-clay-400 hover:bg-clay-50"
              >
                <LuPawPrint className="mx-auto h-8 w-8 text-clay-600 transition-colors group-hover:text-clay-700" aria-hidden="true" />
                <span className="mt-3 block text-sm font-medium text-pet-900">
                  Crear Memorial
                </span>
              </button>

              <button
                onClick={() => navigate('/admin/qr-codes')}
                className="pet-admin-focus group relative block w-full rounded-xl border border-pet-200 bg-pet-50/60 p-6 text-center transition-colors hover:border-pet-400 hover:bg-pet-50"
              >
                <LuQrCode className="mx-auto h-8 w-8 text-pet-600 transition-colors group-hover:text-pet-800" aria-hidden="true" />
                <span className="mt-3 block text-sm font-medium text-pet-900">
                  Gestionar QR
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
