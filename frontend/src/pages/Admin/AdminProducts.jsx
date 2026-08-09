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
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import { formatPrice } from "@/lib/formatPrice";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/lib/productApi";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch(() => toast.error("No se pudieron cargar los productos"))
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
        toast.success("Producto actualizado");
      } else {
        await createProduct(data);
        toast.success("Producto creado");
      }
      setDialogOpen(false);
      loadProducts();
    } catch (error) {
      toast.error(error.message || "Error al guardar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("Producto eliminado");
      loadProducts();
    } catch (error) {
      toast.error(error.message || "Error al eliminar el producto");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Productos</h1>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingProduct(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Nuevo producto
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden sm:table-cell">Categoría</TableHead>
              <TableHead className="hidden sm:table-cell">Precio</TableHead>
              <TableHead className="hidden sm:table-cell">Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">
                  {product.name}
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {product.category} · {formatPrice(product.price)} · stock: {product.stock}
                  </p>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{product.category}</TableCell>
                <TableCell className="hidden sm:table-cell">{formatPrice(product.price)}</TableCell>
                <TableCell className="hidden sm:table-cell">{product.stock}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Editar producto"
                    onClick={() => {
                      setEditingProduct(product);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<Button variant="ghost" size="icon" aria-label="Eliminar producto" />}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar {product.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product._id)}>
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

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
