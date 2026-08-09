import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { formatPrice } from "@/lib/formatPrice";
import { fetchOrders } from "@/lib/orderApi";
import { getCurrentUser } from "@/lib/authApi";

const STATUS_LABEL = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default function Cuenta() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCurrentUser().catch(() => null), fetchOrders().catch(() => [])]).then(
      ([userData, ordersData]) => {
        setUser(userData);
        setOrders(ordersData);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Mi cuenta" }]} />
      <h1 className="font-heading text-3xl font-bold mb-2">Mi cuenta</h1>
      {user && <p className="text-muted-foreground mb-8">{user.email}</p>}

      <h2 className="font-heading text-xl font-semibold mb-4">Historial de pedidos</h2>
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hiciste ningún pedido.{" "}
          <Link to="/tienda" className="text-primary hover:underline">
            Ir a la tienda
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order._id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">
                  Pedido #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")} · {formatPrice(order.total)}
                </p>
              </div>
              <Badge variant="secondary">{STATUS_LABEL[order.status] ?? order.status}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
