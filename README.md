# Petshop

E-commerce de mascotas: tienda online + contenido informativo (blog de cuidado animal). Monorepo con `frontend/` (React 19 + Vite + Tailwind CSS v4 + shadcn/ui) y `backend/` (Node.js + Express + MongoDB).

## Estructura

```
petshop/
├── frontend/   # React 19 + Vite + Tailwind v4 + shadcn/ui
└── backend/    # Express + MongoDB/Mongoose + JWT
```

## Desarrollo local

Backend:

```bash
cd backend
npm install
cp .env.example .env   # completar URI_DB, JWT_SECRET, etc.
npm run dev             # http://localhost:5001
```

Frontend:

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

## Stack

- **Frontend:** React 19, React Router 7, Tailwind CSS v4, shadcn/ui, React Hook Form, Axios, react-hot-toast, framer-motion.
- **Backend:** Express 5, MongoDB + Mongoose, JWT + bcryptjs, Joi, Cloudinary, Helmet, compression.
- **Infra:** Vercel (frontend), Render (backend), MongoDB Atlas.
