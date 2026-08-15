// ====================================
// src/components/admin/dashboard/RecentActivity.jsx - Actividad reciente
// ====================================
import { LuPawPrint, LuPlus, LuQrCode, LuUserRound } from 'react-icons/lu';

const RecentActivity = ({ title, items = [], type, onAction }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Error formateando fecha:', dateString, error);
      return 'Fecha no válida';
    }
  };

  const renderItem = (item, index) => {
    // Verificación de seguridad
    if (!item) {
      console.warn(`Item inválido en índice ${index}:`, item);
      return null;
    }
    if (type === 'clients') {
      return (
        <li key={item.id || item._id || index} className="py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-pet-100 flex items-center justify-center">
                <LuUserRound className="h-5 w-5 text-pet-700" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.nombre || 'Cliente sin nombre'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {item.telefono || 'Sin teléfono'} • {item.email || 'Sin email'}
              </p>
              <p className="text-xs text-gray-400">
                Registrado: {formatDate(item.fechaRegistro || item.createdAt)}
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => {
                  onAction('view-client', item.id || item._id);
                }}
                className="inline-flex items-center rounded-full bg-pet-100 px-2.5 py-1 text-xs font-medium text-pet-800 hover:bg-pet-200"
              >
                Ver
              </button>
            </div>
          </div>
        </li>
      );
    }

    if (type === 'memorials') {
      return (
        <li key={item.id || item._id || index} className="py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-clay-100 flex items-center justify-center">
                <LuPawPrint className="h-5 w-5 text-clay-700" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.nombre || 'Memorial sin nombre'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                Cliente: {item.cliente?.nombre || item.client?.nombre || 'Cliente no especificado'}
              </p>
              <p className="text-xs text-gray-400">
                Creado: {formatDate(item.fechaCreacion || item.createdAt)}
              </p>
            </div>
            <div className="flex-shrink-0 flex space-x-2">
              <button
                onClick={() => onAction('view-memorial', item.id || item._id)}
                className="inline-flex items-center rounded-full bg-clay-100 px-2.5 py-1 text-xs font-medium text-clay-700 hover:bg-clay-200"
              >
                Ver
              </button>
              {item.qr && (
                <button
                  onClick={() => onAction('print-qr', item.id || item._id)}
                  className="inline-flex items-center rounded-full bg-pet-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-pet-800"
                >
                  <LuQrCode className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                  QR
                </button>
              )}
            </div>
          </div>
        </li>
      );
    }

    return null;
  };

  return (
    <div className="pet-admin-card">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-semibold text-pet-900">
            {title}
          </h3>
          <button
            onClick={() => onAction(type === 'clients' ? 'view-all-clients' : 'view-all-memorials')}
            className="text-sm font-medium text-pet-700 hover:text-pet-900"
          >
            Ver todos
          </button>
        </div>

        {items && items.length > 0 ? (
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-gray-200">
              {items.slice(0, 5).map(renderItem)}
            </ul>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pet-50 text-pet-500">
              {type === 'clients' ? (
                <LuUserRound className="h-6 w-6" aria-hidden="true" />
              ) : (
                <LuPawPrint className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {type === 'clients' ? 'No hay clientes' : 'No hay memoriales'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {type === 'clients' 
                ? 'Comienza registrando tu primer cliente.' 
                : 'Crea tu primer memorial para un cliente.'
              }
            </p>
            <div className="mt-6">
              <button
                onClick={() => onAction(type === 'clients' ? 'new-client' : 'new-memorial')}
                className="pet-admin-focus inline-flex items-center rounded-lg border border-transparent bg-pet-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pet-800"
              >
                <LuPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                {type === 'clients' ? 'Agregar Cliente' : 'Crear Memorial'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
