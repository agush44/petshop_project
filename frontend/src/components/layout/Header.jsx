import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ShieldCheck, PawPrint } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-card/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3 rounded-xl py-2 text-foreground" aria-label="Petshop, ir al inicio">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <PawPrint className="size-7" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-2xl font-extrabold tracking-tight">Petshop</span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">Todo para su bienestar</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 rounded-full bg-muted/70 p-1.5">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({isActive}) => `rounded-full px-4 py-2.5 text-sm font-semibold transition-colors hover:text-primary ${isActive ? "bg-card text-primary shadow-sm" : "text-foreground/75"}`} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5 font-semibold" />
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
            <Button variant="outline" size="sm" className="hidden sm:inline-flex font-semibold" render={<Link to="/login" />}>
              Ingresar
            </Button>
          )}
          <CartSheet />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t bg-card px-4 py-4 flex flex-col gap-1.5 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({isActive}) => `rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-muted ${isActive ? "bg-muted text-primary" : "text-foreground"}`}
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
