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
import { Badge } from "@/components/ui/badge";
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
import PostFormDialog from "@/components/admin/PostFormDialog";
import { fetchPostsAdmin, createPost, updatePost, deletePost } from "@/lib/postApi";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = () => {
    setLoading(true);
    fetchPostsAdmin()
      .then(setPosts)
      .catch(() => toast.error("No se pudieron cargar los artículos"))
      .finally(() => setLoading(false));
  };

  useEffect(loadPosts, []);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingPost) {
        await updatePost(editingPost._id, data);
        toast.success("Artículo actualizado");
      } else {
        await createPost(data);
        toast.success("Artículo creado");
      }
      setDialogOpen(false);
      loadPosts();
    } catch (error) {
      toast.error(error.message || "Error al guardar el artículo");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      toast.success("Artículo eliminado");
      loadPosts();
    } catch (error) {
      toast.error(error.message || "Error al eliminar el artículo");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold">Blog</h1>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingPost(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Nuevo artículo
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="hidden sm:table-cell">Slug</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell className="font-medium">
                  {post.title}
                  <p className="text-xs text-muted-foreground sm:hidden">{post.slug}</p>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {post.slug}
                </TableCell>
                <TableCell>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Publicado" : "Borrador"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Editar artículo"
                    onClick={() => {
                      setEditingPost(post);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<Button variant="ghost" size="icon" aria-label="Eliminar artículo" />}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar {post.title}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(post._id)}>
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

      <PostFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        post={editingPost}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
