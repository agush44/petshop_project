import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/context/CartContext";
import QuickViewDialog from "./QuickViewDialog";

export default function ProductCard({ product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addToCart } = useCart();

  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <>
      <Card className="group min-w-0 overflow-hidden py-0 gap-0">
        <div className="relative aspect-square min-w-0 bg-muted overflow-hidden">
          <Link to={`/tienda/${product._id}`}>
            <img
              src={product.image}
              alt={product.imageAlt || product.name}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          {product.discount > 0 && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              -{product.discount}%
            </Badge>
          )}
          <Button
            size="icon"
            variant="secondary"
            aria-label="Vista rápida"
            className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => setQuickViewOpen(true)}
          >
            <Eye className="size-4" />
          </Button>
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <Link to={`/tienda/${product._id}`} className="hover:underline">
              <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-semibold">{formatPrice(finalPrice)}</span>
              {product.discount > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>
          <Button
            className="mt-auto w-full"
            size="sm"
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
          >
            {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
          </Button>
        </CardContent>
      </Card>

      <QuickViewDialog
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
