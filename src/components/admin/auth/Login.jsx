import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LuLockKeyhole, LuPawPrint } from 'react-icons/lu';
import { useAuth } from '../../../hooks';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && !authLoading) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = ({ target: { name, value } }) => {
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(formData);
      navigate('/admin', { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pet-50">
        <div className="text-center text-pet-700">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-pet-100 border-t-pet-600" />
          <p className="mt-4 text-sm font-medium">Preparando el panel...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pet-50 px-4 py-12 sm:px-6">
      <LuPawPrint className="absolute -left-10 top-12 h-40 w-40 rotate-12 text-pet-100" aria-hidden="true" />
      <LuPawPrint className="absolute -bottom-12 -right-8 h-48 w-48 -rotate-12 text-clay-100" aria-hidden="true" />

      <section className="relative w-full max-w-md rounded-2xl border border-pet-100 bg-white p-7 shadow-lg sm:p-9">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pet-900 text-white shadow-sm">
            <LuPawPrint className="h-9 w-9" aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-clay-600">
            Lazos de Vida Pets
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-pet-900 sm:text-3xl">
            Panel administrativo
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Gestiona clientes y memoriales de mascotas de forma segura.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-pet-500 focus:outline-none focus:ring-2 focus:ring-pet-200"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-pet-500 focus:outline-none focus:ring-2 focus:ring-pet-200"
              placeholder="Tu contraseña"
            />
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="pet-admin-focus flex w-full items-center justify-center rounded-lg bg-pet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuLockKeyhole className="mr-2 h-4 w-4" aria-hidden="true" />
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-xs leading-5 text-gray-500">
            Acceso exclusivo para personal autorizado.
          </p>
        </form>
      </section>
    </main>
  );
};

export default Login;
