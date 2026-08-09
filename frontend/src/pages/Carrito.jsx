import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";

export default function Carrito() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Carrito" }]} />
      <h1 className="font-heading text-3xl font-bold mb-6">Tu carrito</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Todavía no agregaste productos.</p>
          <Button render={<Link to="/tienda" />}>Ir a la tienda</Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <ul className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item) => (
              <li key={item._id} className="flex gap-4 border rounded-lg p-4">
                <img
                  src={item.image}
                  alt={item.imageAlt || item.name}
                  className="size-20 rounded-md object-cover bg-muted"
                  loading="lazy"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(item.finalPrice)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      aria-label="Restar cantidad"
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      aria-label="Sumar cantidad"
                      onClick={() => increaseQuantity(item._id)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 ml-auto text-destructive"
                      aria-label="Eliminar producto"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border rounded-lg p-6 h-fit flex flex-col gap-4">
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>{totalPrice}</span>
            </div>
            <Button render={<Link to="/checkout" />} size="lg">
              Finalizar compra
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
