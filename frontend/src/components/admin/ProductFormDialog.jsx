import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  ANIMAL_TYPES,
  CATEGORY_ITEMS,
  ANIMAL_TYPE_ITEMS,
} from "@/components/shop/ProductFilters";

const EMPTY_PRODUCT = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  animalType: "",
  image: "",
  imageAlt: "",
  discount: "",
};

export default function ProductFormDialog({ open, onOpenChange, product, onSubmit, submitting }) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: EMPTY_PRODUCT,
  });

  useEffect(() => {
    reset(product ?? EMPTY_PRODUCT);
  }, [product, reset, open]);

  const submit = (data) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      discount: data.discount ? Number(data.discount) : 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name", { required: true })} />
            {errors.name && <p className="text-sm text-destructive">Requerido</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register("description", { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" type="number" step="0.01" {...register("price", { required: true })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...register("stock", { required: true })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Categoría</Label>
              <Select
                items={CATEGORY_ITEMS}
                value={watch("category")}
                onValueChange={(v) => setValue("category", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegir" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Mascota</Label>
              <Select
                items={ANIMAL_TYPE_ITEMS}
                value={watch("animalType")}
                onValueChange={(v) => setValue("animalType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegir" />
                </SelectTrigger>
                <SelectContent>
                  {ANIMAL_TYPES.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="image">URL de imagen</Label>
            <Input id="image" {...register("image")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="imageAlt">Texto alternativo de la imagen</Label>
            <Input id="imageAlt" {...register("imageAlt")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="discount">Descuento (%)</Label>
            <Input id="discount" type="number" {...register("discount")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
