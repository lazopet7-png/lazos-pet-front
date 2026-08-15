# Lazos de Vida Pets — Frontend

Aplicación web de memoriales digitales para mascotas. Incluye el memorial público accesible mediante código QR y el panel administrativo usado para gestionar clientes, memoriales, contenido multimedia, comentarios y códigos QR.

## Producción

- Panel y memoriales: `https://sistema.pets.lazosdevida.com`
- API: `https://api.pets.lazosdevida.com/api`
- Hosting: Vercel

## Tecnologías

- React 19 y Vite 6
- React Router 7
- Tailwind CSS 3
- Axios
- TanStack Query
- Framer Motion
- React Icons

## Requisitos

- Node.js 18 o superior
- npm
- Backend de Pets disponible localmente o en producción

## Desarrollo local

```bash
npm install
npm run dev
```

Vite inicia normalmente en `http://localhost:5173`.

La única variable usada por el código del frontend es:

| Variable | Propósito |
| --- | --- |
| `VITE_API_URL` | URL base del backend, incluyendo el sufijo `/api` |

Para desarrollo puede copiarse `.env.example` a `.env.local` y ajustar la URL. `.env.local` contiene configuración local, está ignorado por Git y no debe publicarse ni copiarse en reportes.

Si `VITE_API_URL` no existe, la aplicación usa `http://localhost:3000/api` como valor de desarrollo.

## Rutas principales

### Públicas

| Ruta | Uso |
| --- | --- |
| `/` | Inicio básico del sistema Pets |
| `/memorial/:qrCode` | Memorial público abierto desde el QR |

### Administrativas

| Ruta | Uso |
| --- | --- |
| `/admin/login` | Inicio de sesión |
| `/admin` | Dashboard |
| `/admin/clients` | Clientes |
| `/admin/clients/new` | Registro de cliente |
| `/admin/clients/:id` | Detalle de cliente |
| `/admin/memorials` | Memoriales de mascotas |
| `/admin/memorials/new/:clientId` | Creación de memorial |
| `/admin/memorials/edit/:memorialId` | Edición de memorial |
| `/admin/memorials/:memorialId/print-qr` | Impresión del QR |
| `/admin/memorials/:memorialId/comentarios` | Moderación de comentarios |
| `/admin/media` | Fotos, videos, música y fondos |
| `/admin/qr-codes` | Gestión de códigos QR |

Todas las rutas administrativas, salvo el login, están protegidas con JWT.

## Flujo operativo

1. El administrador inicia sesión.
2. Registra a la persona que contrata el servicio.
3. Crea el memorial de la mascota.
4. Completa la historia, fechas, vínculos y lugar de descanso opcional.
5. Carga fotografías, videos, música y fondos.
6. El sistema genera un QR con la URL pública del memorial.
7. La familia escanea el QR y abre el memorial sin iniciar sesión.

## Arquitectura

```text
src/
├── components/
│   ├── admin/       # Layout, dashboard, formularios, búsquedas y media
│   └── *.jsx        # Componentes del memorial público
├── context/         # Estado de autenticación
├── hooks/           # Hooks de autenticación, clientes y memoriales
├── pages/
│   ├── admin/       # Páginas del panel
│   └── Memorial.jsx # Memorial público
├── services/        # Cliente Axios y contratos con la API
├── App.jsx          # Rutas y layouts
└── main.jsx         # Punto de entrada
```

Los servicios centralizan el acceso al backend. El token administrativo se adjunta desde el interceptor configurado en `src/services/api.js`.

## Comandos de verificación

```bash
npm run lint
npm run build
npm audit
```

El build debe ejecutarse con `VITE_API_URL` configurada para el entorno que se va a desplegar. El proyecto conserva deuda de lint anterior; cualquier cambio nuevo debe evitar aumentar el número de incidencias.

## Despliegue

El proyecto de Vercel es `lazos-pet-front`. La variable `VITE_API_URL` debe existir en Production y Preview. El dominio de producción es `sistema.pets.lazosdevida.com`.

Antes de desplegar:

1. Ejecutar lint, build y audit.
2. Comprobar login y validación de token.
3. Probar clientes, memoriales, QR y gestión de media.
4. Verificar el memorial público en móvil.
5. Confirmar que CORS del backend admite el dominio del frontend.

## Seguridad

- No guardar credenciales, tokens ni archivos `.env.local` en Git.
- No registrar el JWT ni datos personales en consola.
- No incluir secretos en URLs.
- Crear y cambiar administradores únicamente mediante el flujo seguro del backend.
