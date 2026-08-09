import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Wrench,
  ClipboardList,
  Newspaper,
  Mail,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/servicios", label: "Servicios", icon: Wrench },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/mensajes", label: "Mensajes", icon: Mail },
];

function AdminNav({ onNavigate }) {
  const { logout } = useAuth();

  return (
    <div className="flex h-full flex-col gap-1 px-4 py-6">
      <Link to="/" className="font-heading font-semibold mb-6 px-2">
        🐾 Petshop Admin
      </Link>
      {adminLinks.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
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
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
        <Link to="/" className="font-heading font-semibold">
          🐾 Petshop Admin
        </Link>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Abrir menú admin" />}>
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú admin</SheetTitle>
            </SheetHeader>
            <AdminNav />
          </SheetContent>
        </Sheet>
      </header>

      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r">
        <AdminNav />
      </aside>

      <main className="flex-1 p-6 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
