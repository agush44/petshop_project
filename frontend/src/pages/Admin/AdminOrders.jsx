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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { confirmBankTransfer, fetchOrders, updateOrderStatus } from "@/lib/orderApi";
import AdminTableToolbar from "@/components/admin/AdminTableToolbar";

const STATUSES = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"];
// Value -> label para que Base UI Select resuelva el texto mostrado en el trigger.
const STATUS_ITEMS = Object.fromEntries(STATUSES.map((s) => [s, s]));

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");

  const loadOrders = () => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(() => toast.error("No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const visibleOrders = orders
    .filter((order) => `${order.shipping?.fullName || ""} ${order._id} ${order.status}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => sort === "date-asc" ? new Date(a.createdAt) - new Date(b.createdAt) : sort === "total-asc" ? a.total - b.total : sort === "total-desc" ? b.total - a.total : new Date(b.createdAt) - new Date(a.createdAt));

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Estado actualizado");
      loadOrders();
    } catch (error) {
      toast.error(error.message || "Error al actualizar el estado");
    }
  };

  const handleConfirmTransfer = async (id) => {
    try {
      await confirmBankTransfer(id);
      toast.success("Transferencia acreditada");
      loadOrders();
    } catch (error) {
      toast.error(error.message || "No se pudo acreditar la transferencia");
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Pedidos</h1>
      <AdminTableToolbar search={search} onSearchChange={setSearch} sort={sort} onSortChange={setSort} noun="pedidos" count={visibleOrders.length} sortOptions={[{value:"date-desc",label:"Más recientes"},{value:"date-asc",label:"Más antiguos"},{value:"total-desc",label:"Mayor total"},{value:"total-asc",label:"Menor total"}]} />

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : visibleOrders.length === 0 ? (
        <p className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">{orders.length === 0 ? "No hay pedidos todavía." : "No hay pedidos que coincidan con la búsqueda."}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead className="hidden sm:table-cell">Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Total</TableHead>
              <TableHead className="hidden sm:table-cell">Fecha</TableHead>
              <TableHead className="hidden md:table-cell">Pago</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  #{order._id.slice(-6).toUpperCase()}
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {order.shipping?.fullName} · {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {{mercadopago:"Mercado Pago",transfer:"Transferencia",whatsapp:"WhatsApp"}[order.payment?.method || "whatsapp"]} · {{approved:"Acreditado",pending:"Pendiente",rejected:"Rechazado",refunded:"Reintegrado",not_required:"A coordinar"}[order.payment?.status || "not_required"]}
                  </p>
                  {order.payment?.method === "transfer" && order.payment?.status === "pending" && (
                    <Button className="mt-2 md:hidden" size="sm" variant="outline" onClick={() => handleConfirmTransfer(order._id)}>Acreditar transferencia</Button>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{order.shipping?.fullName}</TableCell>
                <TableCell className="hidden sm:table-cell">{formatPrice(order.total)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(order.createdAt).toLocaleDateString("es-AR")}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col items-start gap-1.5">
                    <span className="text-xs font-medium">{{mercadopago:"Mercado Pago",transfer:"Transferencia",whatsapp:"WhatsApp"}[order.payment?.method || "whatsapp"]}</span>
                    <Badge variant={order.payment?.status === "approved" ? "default" : "secondary"}>
                      {{approved:"Acreditado",pending:"Pendiente",rejected:"Rechazado",refunded:"Reintegrado",not_required:"A coordinar"}[order.payment?.status || "not_required"]}
                    </Badge>
                    {order.payment?.method === "transfer" && order.payment?.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => handleConfirmTransfer(order._id)}>Acreditar transferencia</Button>
                    )}
                  </div>
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
