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
import ImageUploadField from "./ImageUploadField";

const EMPTY_SERVICE = { name: "", description: "", price: "", durationMinutes: "", image: "" };

export default function ServiceFormDialog({ open, onOpenChange, service, onSubmit, submitting }) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: EMPTY_SERVICE,
  });

  useEffect(() => {
    reset(service ?? EMPTY_SERVICE);
  }, [service, reset, open]);

  const submit = (data) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      durationMinutes: data.durationMinutes ? Number(data.durationMinutes) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{service ? "Editar servicio" : "Nuevo servicio"}</DialogTitle>
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
              <Label htmlFor="durationMinutes">Duración (min)</Label>
              <Input id="durationMinutes" type="number" {...register("durationMinutes")} />
            </div>
          </div>
          <ImageUploadField
            label="Imagen del servicio"
            value={watch("image")}
            onChange={(url) => setValue("image", url)}
          />
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
