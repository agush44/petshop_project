import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-12">
        <Link to="/" className="font-heading text-xl font-semibold">
          🐾 Petshop
        </Link>
        <main className="w-full max-w-md">
          <Outlet />
        </main>
      </div>

      <div className="relative hidden min-w-0 overflow-hidden bg-muted lg:block">
        <img
          src="https://res.cloudinary.com/dxognqhnp/image/upload/f_auto,q_auto/hero"
          alt="Perro y gato juntos, mascotas felices de Petshop"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <p className="absolute bottom-10 left-10 max-w-sm text-2xl font-heading font-semibold text-white text-balance">
          Todo para tu mascota, en un solo lugar.
        </p>
      </div>
    </div>
  );
}
