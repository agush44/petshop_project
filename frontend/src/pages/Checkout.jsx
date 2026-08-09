import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import { createOrder, confirmOrderWhatsapp } from "@/lib/orderApi";
import { sendWhatsappMessage } from "@/lib/sendWhatsappMessage";

export default function Checkout() {
  const { cart, totalPrice, totalRaw, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Tu carrito está vacío.</p>
        <Button render={<Link to="/tienda" />}>Ir a la tienda</Button>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const order = await createOrder({
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.finalPrice,
          quantity: item.quantity,
        })),
        total: totalRaw,
        shipping: data,
      });

      sendWhatsappMessage(cart, totalPrice, data);
      await confirmOrderWhatsapp(order._id).catch(() => {});

      clearCart();
      toast.success("¡Pedido confirmado! Te contactamos por WhatsApp.");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "No se pudo confirmar el pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Carrito", to: "/carrito" }, { label: "Checkout" }]} />
      <h1 className="font-heading text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" {...register("fullName", { required: true })} />
            {errors.fullName && (
              <p className="text-sm text-destructive">Este campo es obligatorio.</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" {...register("phone", { required: true })} />
            {errors.phone && (
              <p className="text-sm text-destructive">Este campo es obligatorio.</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">Dirección de envío</Label>
            <Input id="address" {...register("address", { required: true })} />
            {errors.address && (
              <p className="text-sm text-destructive">Este campo es obligatorio.</p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea id="notes" {...register("notes")} />
          </div>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Confirmando..." : "Confirmar pedido por WhatsApp"}
          </Button>
        </form>

        <div className="border rounded-lg p-6 h-fit">
          <h2 className="font-heading font-semibold mb-4">Resumen</h2>
          <ul className="flex flex-col gap-2 text-sm mb-4">
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>{formatPrice(item.finalPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-medium text-lg border-t pt-4">
            <span>Total</span>
            <span>{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
