import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wrench,
  ClipboardList,
  Newspaper,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/servicios", label: "Servicios", icon: Wrench },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
];

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-svh">
      <aside className="hidden md:flex w-56 flex-col border-r px-4 py-6 gap-1">
        <Link to="/" className="font-heading font-semibold mb-6 px-2">
          🐾 Petshop Admin
        </Link>
        {adminLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
        <Button variant="ghost" className="mt-auto justify-start gap-2" onClick={logout}>
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </aside>
      <main className="flex-1 p-6 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
