import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CATEGORIES = [
  { value: "alimentos", label: "Alimentos" },
  { value: "accesorios", label: "Accesorios" },
  { value: "piedras sanitarias", label: "Piedras sanitarias" },
  { value: "golosinas y snacks", label: "Golosinas y snacks" },
];

const ANIMAL_TYPES = [
  { value: "Perros", label: "Perros" },
  { value: "Gatos", label: "Gatos" },
  { value: "Otros", label: "Otros" },
];

// Base UI resuelve la etiqueta mostrada en el trigger a partir de este mapa
// value -> label (sin `items`, muestra el value crudo en vez del texto del SelectItem).
const ANIMAL_TYPE_ITEMS = {
  all: "Todas las mascotas",
  ...Object.fromEntries(ANIMAL_TYPES.map((a) => [a.value, a.label])),
};
const CATEGORY_ITEMS = {
  all: "Todas las categorías",
  ...Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label])),
};
const SORT_ITEMS = {
  none: "Relevancia",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  "name-asc": "Nombre: A-Z",
};

function FilterFields({ filters, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Buscar producto..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        aria-label="Buscar producto"
      />
      <Select
        items={ANIMAL_TYPE_ITEMS}
        value={filters.animalType || "all"}
        onValueChange={(v) => onChange({ ...filters, animalType: v === "all" ? "" : v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Mascota" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las mascotas</SelectItem>
          {ANIMAL_TYPES.map((a) => (
            <SelectItem key={a.value} value={a.value}>
              {a.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={CATEGORY_ITEMS}
        value={filters.category || "all"}
        onValueChange={(v) => onChange({ ...filters, category: v === "all" ? "" : v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={SORT_ITEMS}
        value={filters.sort || "none"}
        onValueChange={(v) => onChange({ ...filters, sort: v === "none" ? "" : v })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Ordenar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Relevancia</SelectItem>
          <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
          <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
          <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default function ProductFilters({ filters, onChange }) {
  return (
    <>
      <aside className="hidden md:block w-56 shrink-0">
        <h2 className="font-heading font-semibold mb-4">Filtros</h2>
        <FilterFields filters={filters} onChange={onChange} />
      </aside>

      <div className="md:hidden mb-4">
        <Sheet>
          <SheetTrigger render={<Button variant="outline" className="gap-2" />}>
            <SlidersHorizontal className="size-4" />
            Filtros
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="px-4">
              <FilterFields filters={filters} onChange={onChange} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export { CATEGORIES, ANIMAL_TYPES, CATEGORY_ITEMS, ANIMAL_TYPE_ITEMS };
