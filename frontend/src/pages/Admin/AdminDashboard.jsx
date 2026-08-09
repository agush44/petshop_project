import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProducts } from "@/lib/productApi";
import { fetchOrders } from "@/lib/orderApi";
import { formatPrice } from "@/lib/formatPrice";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    Promise.all([fetchProducts().catch(() => []), fetchOrders().catch(() => [])]).then(
      ([products, orders]) => {
        setStats({
          products: products.length,
          orders: orders.length,
          revenue: orders.reduce((sum, o) => sum + o.total, 0),
          pending: orders.filter((o) => o.status === "pendiente").length,
        });
      }
    );
  }, []);

  const cards = [
    { label: "Productos", value: stats.products },
    { label: "Pedidos totales", value: stats.orders },
    { label: "Pedidos pendientes", value: stats.pending },
    { label: "Facturación total", value: formatPrice(stats.revenue) },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
