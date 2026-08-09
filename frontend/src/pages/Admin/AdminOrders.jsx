import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/formatPrice";
import { fetchOrders, updateOrderStatus } from "@/lib/orderApi";

const STATUSES = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"];
// Value -> label para que Base UI Select resuelva el texto mostrado en el trigger.
const STATUS_ITEMS = Object.fromEntries(STATUSES.map((s) => [s, s]));

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(() => toast.error("No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Estado actualizado");
      loadOrders();
    } catch (error) {
      toast.error(error.message || "Error al actualizar el estado");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Pedidos</h1>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay pedidos todavía.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead className="hidden sm:table-cell">Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Total</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  #{order._id.slice(-6).toUpperCase()}
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {order.shipping?.fullName} · {formatPrice(order.total)}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{order.shipping?.fullName}</TableCell>
                <TableCell className="hidden sm:table-cell">{formatPrice(order.total)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </TableCell>
                <TableCell>
                  <Select
                    items={STATUS_ITEMS}
                    value={order.status}
                    onValueChange={(status) => handleStatusChange(order._id, status)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
