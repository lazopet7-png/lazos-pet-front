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

Conviene respetar ese puerto. Si se apunta el desarrollo local contra la API de producción, el CORS del backend solo admite `localhost:5173` y `localhost:5174`: desde cualquier otro puerto las peticiones se bloquean y el memorial aparece como no encontrado.

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
4. Completa la historia, fechas, especie, raza, personalidad, favoritos y lugar de descanso opcional.
5. Carga fotografías, videos, música y fondos.
6. El sistema genera un QR con la URL pública del memorial.
7. La familia escanea el QR y abre el memorial sin iniciar sesión.

El memorial público usa una composición móvil con identidad visual Pets. La música sigue disponible, pero su acceso y reproductor solo aparecen cuando el memorial tiene al menos una pista cargada.

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

El build debe ejecutarse con `VITE_API_URL` configurada para el entorno que se va a desplegar.

El proyecto conserva deuda de lint anterior: **40 incidencias (15 errores y 25 avisos)**, concentradas en el panel administrativo y sin efecto visible en tiempo de ejecución. Son en su mayoría `no-unused-vars`, `no-useless-catch` y `react-hooks/exhaustive-deps`. Cualquier cambio nuevo debe dejar ese número igual o menor.

## Despliegue

El proyecto de Vercel es `lazos-pet-front`, en el team `petslazosdevidacom`. La variable `VITE_API_URL` debe existir en Production y Preview.

**Se despliega con `git push`.** El proyecto está conectado a GitHub: cada push a `main` dispara un build de producción automáticamente (unos 20 segundos).

```bash
git push origin main    # esto es todo
```

No usar `vercel --prod`. El team está en plan Hobby y los deploys lanzados desde el CLI quedan en estado `Blocked` cuando llegan mientras el build de Git ya está corriendo; además son redundantes. En el panel se distinguen por la columna de origen: los buenos muestran la rama y el commit, los del CLI muestran `vercel deploy`.

Vercel avisa que el autor del commit «is not a member of this team». Es solo atribución: el deploy se ejecuta con la cuenta dueña de la conexión de Git (`lazopet7-png`) y no se bloquea.

Antes de desplegar:

1. Ejecutar lint, build y audit.
2. Comprobar login y validación de token.
3. Probar clientes, memoriales, QR y gestión de media.
4. Verificar el memorial público en móvil.
5. Confirmar que CORS del backend admite el dominio del frontend.

### Dominio para probar

Probar siempre en `https://sistema.pets.lazosdevida.com`.

El alias `lazos-pet-front.vercel.app` apunta al mismo despliegue pero **no está en la lista de orígenes permitidos del backend**, así que ahí el memorial falla por CORS y aparece el estado de error. No es un fallo del despliegue.

## Seguridad

- No guardar credenciales, tokens ni archivos `.env.local` en Git.
- No registrar el JWT ni datos personales en consola.
- No incluir secretos en URLs.
- Crear y cambiar administradores únicamente mediante el flujo seguro del backend.
