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
import { hasActiveDiscount, getFinalPrice } from "@/lib/pricing";
import { useCart } from "@/context/CartContext";

export default function QuickViewDialog({ product, open, onOpenChange }) {
  const { addToCart } = useCart();
  const onSale = hasActiveDiscount(product);
  const finalPrice = getFinalPrice(product);

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
              <span className={`text-lg font-semibold ${onSale ? "text-destructive" : ""}`}>
                {formatPrice(finalPrice)}
              </span>
              {onSale && (
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
          <Button variant="outline" className="h-11 cursor-pointer" render={<Link to={`/tienda/${product._id}`} />}>
            Ver detalle completo
          </Button>
          <Button className="h-11 cursor-pointer" disabled={product.stock === 0} onClick={() => addToCart(product)}>
            Agregar al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
