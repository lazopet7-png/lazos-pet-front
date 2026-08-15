import { NavLink } from 'react-router-dom';
import {
  LuImage,
  LuLayoutDashboard,
  LuLogOut,
  LuPawPrint,
  LuQrCode,
  LuUsers,
} from 'react-icons/lu';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LuLayoutDashboard, exact: true },
  { name: 'Clientes', href: '/admin/clients', icon: LuUsers },
  { name: 'Memoriales', href: '/admin/memorials', icon: LuPawPrint },
  { name: 'Gestión de Media', href: '/admin/media', icon: LuImage },
  { name: 'Códigos QR', href: '/admin/qr-codes', icon: LuQrCode },
];

const Sidebar = ({ onClose, onLogout }) => (
  <div className="flex flex-grow flex-col overflow-y-auto bg-pet-900 px-4 pb-4 pt-5 text-white">
    <div className="flex flex-shrink-0 items-center px-1">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-clay-400 text-white shadow-sm">
        <LuPawPrint className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="ml-3 min-w-0">
        <h1 className="truncate text-base font-semibold tracking-tight">Lazos de Vida Pets</h1>
        <p className="mt-0.5 text-xs text-pet-200">Memoriales para mascotas</p>
      </div>
    </div>

    <nav className="mt-8 flex-1 space-y-1" aria-label="Navegación administrativa">
      {navigation.map((item) => {
        const NavigationIcon = item.icon;

        return (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-white text-pet-900 shadow-sm'
                  : 'text-pet-100 hover:bg-pet-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <NavigationIcon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-clay-500' : 'text-pet-300 group-hover:text-clay-300'}`}
                  aria-hidden="true"
                />
                {item.name}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>

    <div className="flex-shrink-0 border-t border-white/10 pt-4">
      <div className="mb-3 px-3 text-xs leading-5 text-pet-300">
        <p>Panel administrativo</p>
        <p>Versión 1.0</p>
      </div>
      <button
        type="button"
        onClick={() => {
          onClose?.();
          onLogout();
        }}
        className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-pet-100 transition-colors hover:bg-pet-800 hover:text-white"
      >
        <LuLogOut className="mr-3 h-5 w-5 text-pet-300 group-hover:text-clay-300" aria-hidden="true" />
        Cerrar sesión
      </button>
    </div>
  </div>
);

export default Sidebar;
