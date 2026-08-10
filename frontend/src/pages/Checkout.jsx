import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import { hasActiveDiscount } from "@/lib/pricing";
import { createOrder, confirmOrderWhatsapp } from "@/lib/orderApi";
import { sendWhatsappMessage } from "@/lib/sendWhatsappMessage";

export default function Checkout() {
  const {
    cart,
    totalPrice,
    totalRaw,
    totalOriginalPrice,
    totalSavingsPrice,
    hasSavings,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  // Se guarda acá en vez de vaciar el carrito apenas se abre WhatsApp: si el
  // usuario cierra esa pestaña sin mandar el mensaje, no queremos que el
  // pedido quede dado por confirmado ni perder lo que tenía en el carrito.
  const [pendingOrder, setPendingOrder] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (cart.length === 0 && !pendingOrder) {
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
      setPendingOrder(order);
    } catch (error) {
      toast.error(error.message || "No se pudo registrar el pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopenWhatsapp = () => {
    // Reconstruye el mismo mensaje a partir del pedido ya creado, por si
    // el usuario cerró la pestaña de WhatsApp sin querer.
    sendWhatsappMessage(
      pendingOrder.items.map((item) => ({ ...item, finalPrice: item.price })),
      formatPrice(pendingOrder.total),
      pendingOrder.shipping
    );
  };

  const handleConfirm = async () => {
    await confirmOrderWhatsapp(pendingOrder._id).catch(() => {});
    clearCart();
    toast.success("¡Pedido confirmado!");
    navigate("/");
  };

  if (pendingOrder) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <FaWhatsapp className="size-12 text-[#25d366] mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Casi listo</h1>
        <p className="text-muted-foreground mb-8">
          Se abrió WhatsApp con tu pedido #{pendingOrder._id.slice(-6).toUpperCase()} listo
          para enviar. Confirmalo ahí para completar la compra.
        </p>
        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={handleConfirm}>
            Ya envié el mensaje por WhatsApp
          </Button>
          <Button size="lg" variant="outline" onClick={handleReopenWhatsapp}>
            No se abrió / lo cerré, reabrir WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Carrito", to: "/carrito" }, { label: "Checkout" }]} />
      <h1 className="font-heading text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 flex flex-col gap-4">
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

        <div className="lg:col-span-2 border rounded-lg p-6 h-fit">
          <h2 className="font-heading font-semibold mb-4">Resumen</h2>
          <ul className="flex flex-col gap-3 text-sm mb-4">
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between gap-2">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {hasActiveDiscount(item) && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  )}
                  <span className={hasActiveDiscount(item) ? "text-destructive font-medium" : ""}>
                    {formatPrice(item.finalPrice * item.quantity)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4">
            <div className="flex justify-between items-baseline text-lg">
              <span className="font-medium">Total</span>
              <span className="flex items-baseline gap-2">
                {hasSavings && (
                  <span className="text-sm text-muted-foreground line-through">
                    {totalOriginalPrice}
                  </span>
                )}
                <span className="font-medium">{totalPrice}</span>
              </span>
            </div>
            {hasSavings && (
              <p className="text-sm text-destructive text-right mt-1">
                Ahorrás {totalSavingsPrice}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
