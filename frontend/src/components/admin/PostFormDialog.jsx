import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
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

const EMPTY_POST = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  coverImageAlt: "",
  author: "Equipo Petshop",
  sections: [{ anchor: "", heading: "", content: "" }],
};

export default function PostFormDialog({ open, onOpenChange, post, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY_POST,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "sections" });

  useEffect(() => {
    reset(post ?? EMPTY_POST);
  }, [post, reset, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Editar artículo" : "Nuevo artículo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register("title", { required: true })} />
            {errors.title && <p className="text-sm text-destructive">Requerido</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="slug">Slug (url)</Label>
            <Input id="slug" placeholder="cuidado-dental-perros" {...register("slug", { required: true })} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="excerpt">Resumen</Label>
            <Textarea id="excerpt" {...register("excerpt", { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField
              label="Imagen de portada"
              value={watch("coverImage")}
              onChange={(url) => setValue("coverImage", url)}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="coverImageAlt">Alt de la imagen</Label>
              <Input id="coverImageAlt" {...register("coverImageAlt")} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Secciones (con ancla para el índice)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => append({ anchor: "", heading: "", content: "" })}
            >
              <Plus className="size-3.5" />
              Agregar sección
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  placeholder="ancla (ej: introduccion)"
                  {...register(`sections.${index}.anchor`, { required: true })}
                />
                <Input
                  placeholder="Título de sección"
                  {...register(`sections.${index}.heading`, { required: true })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Eliminar sección"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
              <Textarea
                placeholder="Contenido"
                {...register(`sections.${index}.content`, { required: true })}
              />
            </div>
          ))}

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
