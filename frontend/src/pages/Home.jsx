import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/shop/ProductCard";
import { fetchPromotionProducts } from "@/lib/productApi";

const CATEGORY_LINKS = [
  { to: "/tienda?category=alimentos", label: "Alimentos", emoji: "🍖" },
  { to: "/tienda?category=accesorios", label: "Accesorios", emoji: "🦴" },
  { to: "/tienda?category=piedras sanitarias", label: "Piedras sanitarias", emoji: "🐾" },
  { to: "/tienda?category=golosinas y snacks", label: "Golosinas", emoji: "🍬" },
];

export default function Home() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotionProducts()
      .then(setPromos)
      .catch(() => setPromos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-16">
      <section className="grid items-center gap-10 py-8 sm:py-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Todo para tu mascota, en un solo lugar
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Alimento, accesorios e higiene para perros y gatos, con envío y confirmación
            de pedido directo por WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button size="lg" render={<Link to="/tienda" />}>
              Ver tienda
            </Button>
            <Button size="lg" variant="outline" render={<a href="#como-comprar" />}>
              Cómo comprar
            </Button>
          </div>
        </div>
        <div className="relative min-w-0">
          <div className="aspect-4/3 min-w-0 overflow-hidden rounded-2xl bg-muted">
            <img
              src="https://res.cloudinary.com/dxognqhnp/image/upload/f_auto,q_auto/hero"
              alt="Perro y gato juntos, mascotas felices de Petshop"
              className="size-full object-cover"
              loading="eager"
            />
          </div>
          <span className="absolute -bottom-4 -left-4 hidden rounded-xl bg-background px-4 py-3 shadow-lg ring-1 ring-foreground/10 sm:block">
            <span className="text-sm font-medium">🐾 +{"1500"} mascotas felices</span>
          </span>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-semibold mb-6">Categorías</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center transition-colors hover:bg-muted"
            >
              <span className="text-3xl" aria-hidden>{cat.emoji}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="ofertas">
        <h2 className="font-heading text-2xl font-semibold mb-6">Ofertas</h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full" />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay ofertas activas por el momento.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {promos.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section id="como-comprar" className="rounded-lg border p-8">
        <h2 className="font-heading text-2xl font-semibold mb-4">Cómo comprar</h2>
        <ol className="grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground list-decimal list-inside">
          <li>Elegí tus productos y agregalos al carrito.</li>
          <li>Completá tus datos de envío en el checkout.</li>
          <li>Confirmamos tu pedido por WhatsApp y coordinamos la entrega.</li>
        </ol>
      </section>
    </div>
  );
}
