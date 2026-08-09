import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Share2, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { formatPrice } from "@/lib/formatPrice";
import { hasActiveDiscount, getFinalPrice } from "@/lib/pricing";
import { fetchProductById } from "@/lib/productApi";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    fetchProductById(productId)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Mirá ${product.name} en Petshop`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // usuario canceló, no hacer nada
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado al portapapeles");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center py-12 text-muted-foreground">Producto no encontrado.</p>;
  }

  const onSale = hasActiveDiscount(product);
  const finalPrice = getFinalPrice(product);

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Tienda", to: "/tienda" }, { label: product.name }]} />
      <div className="grid gap-8 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setZoomed((z) => !z)}
          className="relative aspect-square w-full min-w-0 overflow-hidden rounded-lg bg-muted cursor-zoom-in"
          aria-label="Ampliar imagen"
        >
          <img
            src={product.image}
            alt={product.imageAlt || product.name}
            className={`size-full object-cover transition-transform duration-300 ${
              zoomed ? "scale-150" : "scale-100"
            }`}
          />
          <span className="absolute bottom-2 right-2 rounded-full bg-background/80 p-1.5">
            <ZoomIn className="size-4" />
          </span>
        </button>

        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-semibold ${onSale ? "text-destructive" : ""}`}>
              {formatPrice(finalPrice)}
            </span>
            {onSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{product.description}</p>
          <p className="text-sm">
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
          </p>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              disabled={product.stock === 0}
              onClick={() => addToCart(product)}
            >
              {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </Button>
            <Button variant="outline" size="icon" aria-label="Compartir producto" onClick={handleShare}>
              <Share2 className="size-4" />
            </Button>
          </div>
          <Link to="/tienda" className="text-sm text-muted-foreground hover:underline">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
