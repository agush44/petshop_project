# Petshop

E-commerce de mascotas: tienda online (alimento, accesorios e higiene para perros y gatos) combinada con contenido informativo (blog de cuidado animal). Proyecto de cátedra — rediseño y ampliación de un proyecto propio existente, reconstruido como monorepo con React 19 + shadcn/ui en el frontend y Express + MongoDB en el backend.

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack técnico](#stack-técnico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha](#puesta-en-marcha)
- [Cómo crear un usuario administrador](#cómo-crear-un-usuario-administrador)
- [Scripts disponibles](#scripts-disponibles)
- [Mapa del sitio](#mapa-del-sitio)
- [API — endpoints principales](#api--endpoints-principales)
- [Despliegue](#despliegue)
- [Notas y limitaciones conocidas](#notas-y-limitaciones-conocidas)

## Funcionalidades

**Tienda pública**

- Catálogo con filtros (categoría, mascota), búsqueda y orden por precio/nombre.
- Vista rápida de producto en modal (quick view) sin salir del catálogo.
- Detalle de producto con zoom de imagen y botón "compartir" (Web Share API, con fallback a copiar link).
- Carrito persistente (localStorage) con drawer lateral y vista de página completa.
- Checkout con Mercado Pago Checkout Pro, transferencia bancaria manual o coordinación por WhatsApp.
- Blog de cuidado animal con índice de secciones por ancla en cada artículo.
- Formulario de contacto y suscripción a newsletter.
- Página "Nosotros" con mapa embebido.

**Cuenta de usuario**

- Registro / login con JWT.
- Historial de pedidos en "Mi cuenta".

**Panel de administración** (`/admin`, requiere rol `admin`)

- CRUD de productos y servicios, con carga de imágenes directo a Cloudinary.
- Gestión de pedidos (cambio de estado).
- CRUD de artículos de blog (con editor de secciones/anclas).
- Búsqueda y orden por nombre, precio y stock en productos; por fecha y total en pedidos; y por título/actualización en artículos.
- Listado de mensajes de contacto y suscriptores del newsletter.
- Responsive: en mobile, las tablas colapsan las columnas secundarias y el menú se abre en un panel lateral.

**Transversal**

- Diseño responsive mobile-first en todo el sitio.
- Navegación con header fijo, breadcrumbs, y reseteo de scroll al cambiar de ruta.
- Accesibilidad: skip link al contenido principal, foco visible, textos alternativos en imágenes, formularios con `<label>` asociado.

## Stack técnico

**Frontend** (`frontend/`)

- React 19 + Vite
- React Router 7
- Tailwind CSS v4 + shadcn/ui (sobre Base UI, no Radix)
- React Hook Form
- Sonner (toasts)
- lucide-react / react-icons

**Backend** (`backend/`)

- Node.js + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs para autenticación
- Joi para validación de requests (mensajes de error en español)
- Cloudinary (subida de imágenes, unsigned upload preset desde el frontend)
- Helmet, compression, cors

**Infraestructura sugerida**

- Frontend → Vercel
- Backend → Render
- Base de datos → MongoDB Atlas
- Imágenes → Cloudinary

## Estructura del proyecto

```
petshop/
├── frontend/
│   └── src/
│       ├── pages/            # una carpeta/archivo por ruta pública
│       ├── pages/Admin/      # páginas del panel admin
│       ├── components/       # componentes reutilizables (shop, cart, layout, admin, ui)
│       ├── components/ui/    # componentes base de shadcn/ui (generados, no editar a mano el estilo base)
│       ├── context/          # AuthProvider y CartProvider (React Context)
│       ├── Layouts/          # PublicLayout, AuthLayout, AdminLayout
│       └── lib/               # capa de acceso a la API (fetch) + helpers (precios, whatsapp, cloudinary)
└── backend/
    └── src/
        ├── models/            # esquemas de Mongoose
        ├── controllers/       # lógica de cada endpoint
        ├── routes/            # definición de rutas Express
        ├── middleware/        # auth, validación, compresión, logging
        ├── validations/       # schemas de Joi (mensajes en español centralizados en joiMessages.js)
        └── scripts/           # scripts de mantenimiento (ver más abajo)
```

## Requisitos previos

- Node.js 20 o superior (probado con Node 22) y npm.
- Una base de datos MongoDB accesible (Atlas o local).
- Una cuenta de Cloudinary con un **upload preset "unsigned"** creado (Settings → Upload → Upload presets → Add upload preset → Signing Mode: _Unsigned_). El nombre del preset y el `cloud_name` van hardcodeados en `frontend/src/lib/cloudinary.js` — si usás otra cuenta de Cloudinary, hay que actualizar esas dos constantes.

## Puesta en marcha

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Completar `backend/.env`:

```
URI_DB=mongodb+srv://usuario:password@cluster.mongodb.net/petshop
PORT=5001
JWT_SECRET=cualquier-string-secreto
FRONTEND_URL=http://localhost:5173
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
MP_ENVIRONMENT=test
BACKEND_URL=https://tu-backend.onrender.com
TRANSFER_BANK_NAME=
TRANSFER_ACCOUNT_TYPE=
TRANSFER_ACCOUNT_HOLDER=
TRANSFER_TAX_ID=
TRANSFER_CBU=
TRANSFER_ALIAS=
```

Mercado Pago se activa al configurar `MP_ACCESS_TOKEN` y `MP_WEBHOOK_SECRET`. Para probar, usá las credenciales de prueba y `MP_ENVIRONMENT=test`; para cobros reales usá el token de producción y cambiá a `MP_ENVIRONMENT=production`. Las variables `TRANSFER_*` permiten mostrar los datos bancarios del comercio en el checkout.

(`CLOUDINARY_*` y `WHATSAPP_BUSINESS_NUMBER` en el `.env.example` quedan como referencia para una futura integración server-side; hoy la subida de imágenes y el mensaje de WhatsApp se resuelven desde el frontend, no requieren esas variables en el backend para funcionar).

```bash
npm run dev
```

El servidor queda escuchando en `http://localhost:5001`.

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Completar `frontend/.env`:

```
VITE_BACKEND_URL=http://localhost:5001
VITE_WHATSAPP_NUMBER=54911xxxxxxxx
```

```bash
npm run dev
```

El sitio queda disponible en `http://localhost:5173`.

## Cómo crear un usuario administrador

El registro público (`/registro`) siempre crea usuarios con rol `user`. Para acceder al panel `/admin`:

1. Registrate normalmente desde `/registro`.
2. Desde `backend/`, corré:
   ```bash
   npm run make-admin -- tu-email@ejemplo.com
   ```
3. Cerrá sesión y volvé a iniciar sesión en el sitio (el rol se graba en el token JWT recién al loguearte).
4. Vas a ver la opción "Panel admin" en el menú "Mi cuenta" del header.

## Scripts disponibles

**Backend** (`cd backend`)

| Script                                    | Qué hace                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run dev`                             | Levanta el servidor con recarga automática (`node --watch`)                                      |
| `npm start`                               | Levanta el servidor sin watch (para producción)                                                  |
| `npm run make-admin -- email@ejemplo.com` | Promueve un usuario existente a rol `admin`                                                      |
| `npm run seed-blog`                       | Carga 3 artículos de ejemplo en el blog (upsert por slug, se puede correr de nuevo sin duplicar) |

**Frontend** (`cd frontend`)

| Script            | Qué hace                                |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Servidor de desarrollo (Vite)           |
| `npm run build`   | Build de producción a `dist/`           |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint`    | Corre oxlint                            |

## Mapa del sitio

| Ruta                    | Página                        | Acceso               |
| ----------------------- | ----------------------------- | -------------------- |
| `/`                     | Inicio                        | Público              |
| `/tienda`               | Catálogo                      | Público              |
| `/tienda/:productId`    | Detalle de producto           | Público              |
| `/blog`, `/blog/:slug`  | Blog                          | Público              |
| `/nosotros`             | Sobre nosotros                | Público              |
| `/contacto`             | Contacto + newsletter         | Público              |
| `/carrito`, `/checkout` | Carrito y checkout            | Público              |
| `/login`, `/registro`   | Autenticación                 | Público              |
| `/cuenta`               | Perfil e historial de pedidos | Requiere login       |
| `/admin/*`              | Panel administrativo          | Requiere rol `admin` |

## API — endpoints principales

Base URL local: `http://localhost:5001/api`

| Recurso    | Endpoints                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| Productos  | `GET /products`, `GET /products/promotions`, `GET /products/:id`, `POST/PUT/DELETE /products` (admin) |
| Servicios  | `GET /services`, `GET /services/admin` (admin), `POST/PUT/DELETE /services` (admin)                   |
| Usuarios   | `POST /users/register`, `POST /users/login`, `GET /users/me`                                          |
| Pedidos    | `POST /orders`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id/status` (admin)                  |
| Pagos      | `GET /payments/config`, `GET /payments/orders/:id/status`, `POST /payments/webhook`, `PATCH /payments/orders/:id/transfer/confirm` (admin) |
| Blog       | `GET /posts`, `GET /posts/admin` (admin), `GET /posts/:slug`, `POST/PUT/DELETE /posts` (admin)        |
| Newsletter | `POST /newsletter`, `GET /newsletter` (admin)                                                         |
| Contacto   | `POST /contact`, `GET /contact` (admin)                                                               |

Las rutas marcadas "(admin)" requieren header `Authorization: Bearer <token>` de un usuario con rol `admin`.

## Despliegue

1. **MongoDB Atlas**: crear un cluster, un usuario de base de datos y agregar la IP de Render a la whitelist (o `0.0.0.0/0` para simplificar).
2. **Backend en Render**: nuevo Web Service apuntando a `backend/`, build command `npm install`, start command `npm start`, variables de entorno iguales a `backend/.env`.
3. **Frontend en Vercel**: importar el repo, root directory `frontend/`, variable de entorno `VITE_BACKEND_URL` apuntando a la URL pública del backend en Render.
4. Actualizar `FRONTEND_URL` en el backend con la URL final de Vercel (se usa para la validación de CORS).

## Notas y limitaciones conocidas

El modelo de colecciones, relaciones, control de roles y medios de pago se documentan en [`docs/modelo-datos.md`](docs/modelo-datos.md).

En Render, configurar `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `BACKEND_URL` y `FRONTEND_URL`. En la aplicación de Mercado Pago, configurar el evento de pagos para notificar a `BACKEND_URL/api/payments/webhook`. La transferencia queda pendiente hasta que administración verifique y acredite el ingreso desde el panel de pedidos. Petshop no recibe ni almacena números de tarjeta.

- El blog no tiene sistema de comentarios (decisión de alcance para priorizar el resto de las features).
- Los mensajes de contacto y las suscripciones al newsletter no envían un email de notificación; quedan guardados en MongoDB y se consultan desde `/admin/mensajes`.
- La confirmación de pedido por WhatsApp abre `wa.me` con el mensaje prearmado — no hay integración con la API oficial de WhatsApp Business (requeriría cuenta de Meta Business aprobada).
- **Servicios** (peluquería, veterinaria, etc.) tiene CRUD completo en el backend (`Service` model, `/api/services`) y su página de admin sigue accesible en `/admin/servicios`, pero se sacó del menú de navegación a propósito: hoy no hay servicios reales cargados ni una página pública que los muestre. Queda documentado como algo fácil de expandir a futuro, no como una feature rota.
