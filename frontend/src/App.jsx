import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/sonner";
import CartProvider from "@/context/CartProvider";
import AuthProvider from "@/context/AuthProvider";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import PublicLayout from "@/Layouts/PublicLayout";
import AuthLayout from "@/Layouts/AuthLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import Loader from "@/components/layout/Loader";
import ErrorFallback from "@/components/ErrorFallback";

// Todas las páginas se cargan con lazy() para hacer code-splitting por ruta:
// cada página se descarga recién cuando el usuario navega a ella.
const Home = lazy(() => import("@/pages/Home"));
const Tienda = lazy(() => import("@/pages/Tienda"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const Blog = lazy(() => import("@/pages/Blog/Blog"));
const BlogPost = lazy(() => import("@/pages/Blog/BlogPost"));
const Nosotros = lazy(() => import("@/pages/Nosotros"));
const Contacto = lazy(() => import("@/pages/Contacto"));
const Cuenta = lazy(() => import("@/pages/Cuenta"));
const Carrito = lazy(() => import("@/pages/Carrito"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Login = lazy(() => import("@/pages/Login"));
const Registro = lazy(() => import("@/pages/Registro"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminDashboard = lazy(() => import("@/pages/Admin/AdminDashboard"));
const AdminProducts = lazy(() => import("@/pages/Admin/AdminProducts"));
const AdminServices = lazy(() => import("@/pages/Admin/AdminServices"));
const AdminOrders = lazy(() => import("@/pages/Admin/AdminOrders"));
const AdminBlog = lazy(() => import("@/pages/Admin/AdminBlog"));

/** Envuelve una página lazy en su propio Suspense boundary con el loader compartido. */
function withSuspense(Component) {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
}

/**
 * Raíz de la SPA. Define tres grupos de rutas:
 * - PublicLayout: header + footer, accesible sin login (incluye /cuenta, protegida con ProtectedRoute).
 * - AuthLayout: pantalla centrada para /login y /registro.
 * - AdminRoute + AdminLayout: sidebar de administración, requiere rol "admin" (ver context/AuthContext).
 */
export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={withSuspense(Home)} />
              <Route path="/tienda" element={withSuspense(Tienda)} />
              <Route path="/tienda/:productId" element={withSuspense(ProductDetail)} />
              <Route path="/blog" element={withSuspense(Blog)} />
              <Route path="/blog/:slug" element={withSuspense(BlogPost)} />
              <Route path="/nosotros" element={withSuspense(Nosotros)} />
              <Route path="/contacto" element={withSuspense(Contacto)} />
              <Route path="/carrito" element={withSuspense(Carrito)} />
              <Route path="/checkout" element={withSuspense(Checkout)} />
              <Route element={<ProtectedRoute />}>
                <Route path="/cuenta" element={withSuspense(Cuenta)} />
              </Route>
              <Route path="*" element={withSuspense(NotFound)} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={withSuspense(Login)} />
              <Route path="/registro" element={withSuspense(Registro)} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={withSuspense(AdminDashboard)} />
                <Route path="/admin/productos" element={withSuspense(AdminProducts)} />
                <Route path="/admin/servicios" element={withSuspense(AdminServices)} />
                <Route path="/admin/pedidos" element={withSuspense(AdminOrders)} />
                <Route path="/admin/blog" element={withSuspense(AdminBlog)} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
