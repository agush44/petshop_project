import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";
import { CreditCard, Landmark, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import { hasActiveDiscount } from "@/lib/pricing";
import { createOrder, confirmOrderWhatsapp } from "@/lib/orderApi";
import { fetchPaymentConfig, fetchPaymentStatus } from "@/lib/paymentApi";
import { sendWhatsappMessage } from "@/lib/sendWhatsappMessage";

const PAYMENT_OPTIONS = [
  { id: "mercadopago", title: "Mercado Pago", description: "Tarjeta y otros medios disponibles en el checkout seguro.", icon: CreditCard },
  { id: "transfer", title: "Transferencia bancaria", description: "Transferís desde tu banco y administración acredita el pago.", icon: Landmark },
  { id: "whatsapp", title: "Coordinar por WhatsApp", description: "Te contactamos para acordar el pago y la entrega.", icon: MessageCircle },
];

export default function Checkout() {
  const {
    cart, totalPrice, totalRaw, totalOriginalPrice, totalSavingsPrice,
    hasSavings, clearCart,
  } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [transferDetails, setTransferDetails] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState({ mercadoPagoAvailable: false, transfer: {} });
  const [selectedPayment, setSelectedPayment] = useState("whatsapp");
  const [paymentResult, setPaymentResult] = useState(null);
  const paymentReturn = searchParams.get("payment");
  const returnedOrderId = searchParams.get("order");
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    fetchPaymentConfig().then(setPaymentConfig).catch(() => {});
  }, []);

  useEffect(() => {
    if (!paymentReturn || !returnedOrderId) return;
    let active = true;
    setPaymentResult({ returnStatus: paymentReturn, orderId: returnedOrderId, loading: true });
    fetchPaymentStatus(returnedOrderId)
      .then((status) => {
        if (!active) return;
        if (status.paymentStatus === "approved") clearCart();
        setPaymentResult({ ...status, returnStatus: paymentReturn, orderId: returnedOrderId, loading: false });
      })
      .catch(() => { if (active) setPaymentResult({ returnStatus: paymentReturn, orderId: returnedOrderId, loading: false }); });
    return () => { active = false; };
  }, [paymentReturn, returnedOrderId]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const result = await createOrder({
        items: cart.map((item) => ({ product: item._id, name: item.name, price: item.finalPrice, quantity: item.quantity })),
        total: totalRaw,
        shipping: data,
        paymentMethod: selectedPayment,
      });
      const order = result.order;

      if (selectedPayment === "mercadopago") {
        if (!result.checkoutUrl) throw new Error("Mercado Pago no devolvió el enlace de pago.");
        window.location.assign(result.checkoutUrl);
        return;
      }

      setPendingOrder(order);
      if (selectedPayment === "transfer") {
        setTransferDetails(result.transfer || paymentConfig.transfer || {});
      } else {
        sendWhatsappMessage(
          order.items.map((item) => ({ ...item, finalPrice: item.price })),
          formatPrice(order.total),
          order.shipping,
          { orderId: order._id, paymentMethod: "whatsapp" }
        );
      }
    } catch (error) {
      toast.error(error.message || "No se pudo registrar el pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  const reopenWhatsapp = () => {
    sendWhatsappMessage(
      pendingOrder.items.map((item) => ({ ...item, finalPrice: item.price })),
      formatPrice(pendingOrder.total),
      pendingOrder.shipping,
      { orderId: pendingOrder._id, paymentMethod: pendingOrder.payment?.method }
    );
  };

  const finishOrder = async () => {
    if (pendingOrder.payment?.method === "whatsapp") {
      await confirmOrderWhatsapp(pendingOrder._id).catch(() => {});
    }
    clearCart();
    toast.success(pendingOrder.payment?.method === "transfer" ? "Pedido registrado. El pago queda pendiente de acreditación." : "Pedido registrado.");
    navigate("/");
  };

  const refreshPaymentStatus = async () => {
    try {
      const status = await fetchPaymentStatus(returnedOrderId);
      if (status.paymentStatus === "approved") clearCart();
      setPaymentResult({ ...status, returnStatus: paymentReturn, orderId: returnedOrderId, loading: false });
    } catch (error) {
      toast.error(error.message || "No se pudo consultar el pago.");
    }
  };

  if (paymentResult) {
    const approved = paymentResult.paymentStatus === "approved";
    const failed = paymentResult.returnStatus === "failure" || paymentResult.paymentStatus === "rejected";
    return (
      <div className="mx-auto max-w-xl py-12">
        <div className="rounded-2xl border bg-card p-7 text-center shadow-sm sm:p-10">
          <span className={`mx-auto mb-4 grid size-14 place-items-center rounded-full ${approved ? "bg-primary/10 text-primary" : failed ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"}`}>
            <ShieldCheck className="size-7" />
          </span>
          <h1 className="font-heading text-2xl font-bold">{approved ? "Pago acreditado" : failed ? "Pago no completado" : "Estamos verificando el pago"}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {paymentResult.loading
              ? "Consultando el estado del pedido…"
              : approved
                ? "Mercado Pago confirmó el pago. Ya podés volver a la tienda."
                : failed
                  ? "No se registró un pago aprobado. Podés volver al checkout e intentarlo otra vez."
                  : "El pedido está registrado, pero todavía no recibimos la confirmación del pago. La acreditación se valida automáticamente; no hace falta pagar de nuevo."}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">Pedido #{(returnedOrderId || "").slice(-6).toUpperCase()}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            {!approved && !failed && <Button variant="outline" onClick={refreshPaymentStatus} disabled={paymentResult.loading}>Consultar estado</Button>}
            <Button render={<Link to="/tienda" />}>Volver a la tienda</Button>
          </div>
        </div>
      </div>
    );
  }

  if (pendingOrder) {
    const isTransfer = pendingOrder.payment?.method === "transfer";
    return (
      <div className="mx-auto max-w-xl py-12">
        <div className="rounded-2xl border bg-card p-7 text-center shadow-sm sm:p-10">
          {isTransfer ? <Landmark className="mx-auto mb-4 size-10 text-primary" /> : <FaWhatsapp className="mx-auto mb-4 size-10 text-[#25d366]" />}
          <h1 className="font-heading text-2xl font-bold">{isTransfer ? "Pedido listo para transferir" : "Pedido listo para coordinar"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Pedido #{pendingOrder._id.slice(-6).toUpperCase()} · Total {formatPrice(pendingOrder.total)}</p>
          {isTransfer && (
            <div className="my-6 rounded-xl border bg-muted/50 p-5 text-left text-sm">
              <h2 className="mb-3 font-semibold">Datos para la transferencia</h2>
              {transferDetails?.bankName && <p><span className="text-muted-foreground">Banco:</span> {transferDetails.bankName}</p>}
              {transferDetails?.accountType && <p><span className="text-muted-foreground">Tipo de cuenta:</span> {transferDetails.accountType}</p>}
              {transferDetails?.accountHolder && <p><span className="text-muted-foreground">Titular:</span> {transferDetails.accountHolder}</p>}
              {transferDetails?.taxId && <p><span className="text-muted-foreground">CUIT/CUIL:</span> {transferDetails.taxId}</p>}
              {transferDetails?.cbu && <p className="break-all"><span className="text-muted-foreground">CBU/CVU:</span> {transferDetails.cbu}</p>}
              {transferDetails?.alias && <p><span className="text-muted-foreground">Alias:</span> <strong>{transferDetails.alias}</strong></p>}
              {!transferDetails?.cbu && !transferDetails?.alias && <p className="text-muted-foreground">El comercio te compartirá los datos bancarios por WhatsApp para completar la transferencia.</p>}
              <p className="mt-3 border-t pt-3"><span className="text-muted-foreground">Importe exacto:</span> <strong>{formatPrice(pendingOrder.total)}</strong></p>
              <p className="mt-2 text-xs text-muted-foreground">El pago quedará pendiente hasta que administración verifique la acreditación.</p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={reopenWhatsapp}>
              {isTransfer ? "Enviar comprobante por WhatsApp" : "Abrir WhatsApp para coordinar"}
            </Button>
            <Button size="lg" variant="outline" onClick={finishOrder}>Listo, volver a la tienda</Button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return <div className="py-16 text-center"><p className="mb-4 text-muted-foreground">Tu carrito está vacío.</p><Button render={<Link to="/tienda" />}>Ir a la tienda</Button></div>;
  }

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Carrito", to: "/carrito" }, { label: "Checkout" }]} />
      <h1 className="mb-6 font-heading text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:col-span-3">
          <div className="grid gap-1.5">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" {...register("fullName", { required: true })} />
            {errors.fullName && <p className="text-sm text-destructive">Este campo es obligatorio.</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" {...register("phone", { required: true })} />
            {errors.phone && <p className="text-sm text-destructive">Este campo es obligatorio.</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="address">Dirección de envío</Label>
            <Input id="address" {...register("address", { required: true })} />
            {errors.address && <p className="text-sm text-destructive">Este campo es obligatorio.</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea id="notes" {...register("notes")} />
          </div>

          <fieldset className="grid gap-3">
            <legend className="mb-1 font-heading text-lg font-semibold">Forma de pago</legend>
            {PAYMENT_OPTIONS.map(({ id, title, description, icon: Icon }) => {
              const unavailable = id === "mercadopago" && !paymentConfig.mercadoPagoAvailable;
              const selected = selectedPayment === id;
              return (
                <label key={id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card hover:border-primary/50"} ${unavailable ? "cursor-not-allowed opacity-60" : ""}`}>
                  <input type="radio" name="paymentMethod" value={id} checked={selected} disabled={unavailable} onChange={() => setSelectedPayment(id)} className="mt-1 accent-primary" />
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span><span className="block font-semibold">{title}{unavailable && <span className="ml-2 text-xs font-normal text-muted-foreground">Configuración pendiente</span>}</span><span className="mt-1 block text-sm text-muted-foreground">{description}</span></span>
                </label>
              );
            })}
          </fieldset>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Preparando pedido…" : selectedPayment === "mercadopago" ? "Continuar a Mercado Pago" : selectedPayment === "transfer" ? "Generar pedido para transferencia" : "Continuar por WhatsApp"}
          </Button>
        </form>

        <div className="h-fit rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-heading font-semibold">Resumen</h2>
          <ul className="mb-4 flex flex-col gap-3 text-sm">
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between gap-2">
                <span>{item.name} x{item.quantity}</span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {hasActiveDiscount(item) && <span className="text-xs text-muted-foreground line-through">{formatPrice(item.price * item.quantity)}</span>}
                  <span className={hasActiveDiscount(item) ? "font-medium text-destructive" : ""}>{formatPrice(item.finalPrice * item.quantity)}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4">
            <div className="flex items-baseline justify-between text-lg"><span className="font-medium">Total</span><span className="flex items-baseline gap-2">{hasSavings && <span className="text-sm text-muted-foreground line-through">{totalOriginalPrice}</span>}<span className="font-semibold">{totalPrice}</span></span></div>
            {hasSavings && <p className="mt-1 text-right text-sm text-destructive">Ahorrás {totalSavingsPrice}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
