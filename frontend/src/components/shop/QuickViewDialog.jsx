import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/context/CartContext";

export default function QuickViewDialog({ product, open, onOpenChange }) {
  const { addToCart } = useCart();
  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.category}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="aspect-square w-full min-w-0 overflow-hidden rounded-md bg-muted">
            <img
              src={product.image}
              alt={product.imageAlt || product.name}
              className="size-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{formatPrice(finalPrice)}</span>
              {product.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" render={<Link to={`/tienda/${product._id}`} />}>
            Ver detalle completo
          </Button>
          <Button disabled={product.stock === 0} onClick={() => addToCart(product)}>
            Agregar al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
