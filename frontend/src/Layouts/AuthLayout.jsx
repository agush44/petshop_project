import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/30 px-4">
      <Link to="/" className="font-heading text-xl font-semibold">
        🐾 Petshop
      </Link>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
