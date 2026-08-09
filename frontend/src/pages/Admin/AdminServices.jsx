import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ServiceFormDialog from "@/components/admin/ServiceFormDialog";
import { formatPrice } from "@/lib/formatPrice";
import {
  fetchServicesAdmin,
  createService,
  updateService,
  deleteService,
} from "@/lib/serviceApi";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadServices = () => {
    setLoading(true);
    fetchServicesAdmin()
      .then(setServices)
      .catch(() => toast.error("No se pudieron cargar los servicios"))
      .finally(() => setLoading(false));
  };

  useEffect(loadServices, []);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingService) {
        await updateService(editingService._id, data);
        toast.success("Servicio actualizado");
      } else {
        await createService(data);
        toast.success("Servicio creado");
      }
      setDialogOpen(false);
      loadServices();
    } catch (error) {
      toast.error(error.message || "Error al guardar el servicio");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      toast.success("Servicio eliminado");
      loadServices();
    } catch (error) {
      toast.error(error.message || "Error al eliminar el servicio");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Servicios</h1>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingService(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Nuevo servicio
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden sm:table-cell">Precio</TableHead>
              <TableHead className="hidden sm:table-cell">Duración</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell className="font-medium">
                  {service.name}
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {formatPrice(service.price)}
                    {service.durationMinutes ? ` · ${service.durationMinutes} min` : ""}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{formatPrice(service.price)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {service.durationMinutes ? `${service.durationMinutes} min` : "-"}
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Editar servicio"
                    onClick={() => {
                      setEditingService(service);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<Button variant="ghost" size="icon" aria-label="Eliminar servicio" />}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar {service.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(service._id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={editingService}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
