import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/shop/ProductCard";
import { fetchPromotionProducts } from "@/lib/productApi";

const CATEGORY_LINKS = [
  { to: "/tienda?category=alimentos", label: "Alimentos", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=85", alt: "Perro disfrutando su alimento" },
  { to: "/tienda?category=accesorios", label: "Accesorios", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=85", alt: "Perros paseando con sus accesorios" },
  { to: "/tienda?category=piedras sanitarias", label: "Piedras sanitarias", image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85", alt: "Gato en primer plano" },
  { to: "/tienda?category=golosinas y snacks", label: "Golosinas y snacks", image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=900&q=85", alt: "Perro jugando al aire libre" },
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
      <section className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-10 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-balance">
            Todo para tu mascota, en un solo lugar
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Alimento, accesorios e higiene para perros y gatos, con envío y confirmación
            de pedido directo por WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button size="lg" className="h-12 px-7 text-base" render={<Link to="/tienda" />}>
              Ver tienda
            </Button>
          </div>
        </div>
        <div className="aspect-4/3 min-w-0 overflow-hidden rounded-2xl bg-muted shadow-md">
          <img
            src="https://res.cloudinary.com/dxognqhnp/image/upload/f_auto,q_auto/hero"
            alt="Perro y gato juntos, mascotas felices de Petshop"
            className="size-full object-cover"
            loading="eager"
          />
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">Encontrá lo que necesita</p><h2 className="font-heading text-3xl font-bold">Explorá por categoría</h2></div>
          <Link to="/tienda" className="hidden text-sm font-semibold text-primary hover:underline sm:block">Ver toda la tienda →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="group relative isolate flex min-h-52 items-end overflow-hidden rounded-2xl border border-border bg-foreground text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:min-h-64"
            >
              <img src={cat.image} alt={cat.alt} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <span className="w-full p-4 text-left font-heading text-base font-bold sm:p-5 sm:text-xl">{cat.label}<span className="mt-1 block text-xs font-medium text-white/80">Descubrir productos →</span></span>
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
    </div>
  );
}
