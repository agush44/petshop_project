import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/shop/ProductCard";
import ProductFilters from "@/components/shop/ProductFilters";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/lib/productApi";

export default function Tienda() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    category: searchParams.get("category") || "",
    animalType: "",
    sort: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      fetchProducts({ category: filters.category, animalType: filters.animalType, search: filters.search })
        .then(setProducts)
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [filters.search, filters.category, filters.animalType]);

  const sortedProducts = [...products].sort((a, b) => {
    if (filters.sort === "price-asc") return a.price - b.price;
    if (filters.sort === "price-desc") return b.price - a.price;
    if (filters.sort === "name-asc") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Tienda" }]} />
      <h1 className="font-heading text-3xl font-bold mb-6">Tienda</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <ProductFilters filters={filters} onChange={setFilters} />
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full" />
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No encontramos productos con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
