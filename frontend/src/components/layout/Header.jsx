import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartSheet from "@/components/cart/CartSheet";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/tienda", label: "Tienda" },
  { to: "/blog", label: "Blog" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-heading text-lg font-semibold">
          🐾 Petshop
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5" />
                }
              >
                <User className="size-4" />
                Mi cuenta
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link to="/cuenta" />}>Mis pedidos</DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem render={<Link to="/admin" />}>
                    <ShieldCheck className="size-4" />
                    Panel admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" render={<Link to="/login" />}>
              Ingresar
            </Button>
          )}
          <CartSheet />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t bg-background px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              end={link.to === "/"}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/cuenta" className={linkClass} onClick={() => setMenuOpen(false)}>
                Mi cuenta
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>
                  Panel admin
                </NavLink>
              )}
              <button
                type="button"
                className="text-left text-sm font-medium text-destructive"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
              Ingresar
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
