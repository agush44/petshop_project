import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";

export default function CartSheet() {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, totalItems, totalPrice } =
    useCart();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="relative" aria-label="Ver carrito" />}
      >
        <ShoppingCart className="size-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0">
        <SheetHeader>
          <SheetTitle>Tu carrito</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {cart.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Tu carrito está vacío.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {cart.map((item) => (
                <li key={item._id} className="flex gap-3 border-b pb-4">
                  <img
                    src={item.image}
                    alt={item.imageAlt || item.name}
                    className="size-16 rounded-md object-cover bg-muted"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.finalPrice)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-6"
                        aria-label="Restar cantidad"
                        onClick={() => decreaseQuantity(item._id)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-6"
                        aria-label="Sumar cantidad"
                        onClick={() => increaseQuantity(item._id)}
                      >
                        <Plus className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 ml-auto text-destructive"
                        aria-label="Eliminar producto"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="border-t flex-col gap-3">
            <div className="flex justify-between w-full font-medium">
              <span>Total</span>
              <span>{totalPrice}</span>
            </div>
            <Button
              render={<Link to="/checkout" />}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Finalizar compra
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
