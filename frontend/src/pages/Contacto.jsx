import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { sendContactMessage } from "@/lib/contactApi";
import { subscribeNewsletter } from "@/lib/newsletterApi";

export default function Contacto() {
  const [sendingContact, setSendingContact] = useState(false);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const contactForm = useForm();
  const newsletterForm = useForm();

  const onContactSubmit = async (data) => {
    setSendingContact(true);
    try {
      await sendContactMessage(data);
      toast.success("¡Mensaje enviado! Te vamos a responder a la brevedad.");
      contactForm.reset();
    } catch (error) {
      toast.error(error.message || "No se pudo enviar el mensaje.");
    } finally {
      setSendingContact(false);
    }
  };

  const onNewsletterSubmit = async (data) => {
    setSendingNewsletter(true);
    try {
      await subscribeNewsletter(data.email);
      toast.success("¡Suscripción exitosa!");
      newsletterForm.reset();
    } catch (error) {
      toast.error(error.message || "No se pudo completar la suscripción.");
    } finally {
      setSendingNewsletter(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb items={[{ label: "Contacto" }]} />
      <h1 className="font-heading text-3xl font-bold mb-6">Contacto</h1>

      <div className="grid gap-12 sm:grid-cols-2">
        <div>
          <h2 className="font-heading text-xl font-semibold mb-4">Envianos un mensaje</h2>
          <form
            onSubmit={contactForm.handleSubmit(onContactSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...contactForm.register("name", { required: true })} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                {...contactForm.register("email", { required: true })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                rows={4}
                {...contactForm.register("message", { required: true })}
              />
            </div>
            <Button type="submit" disabled={sendingContact}>
              {sendingContact ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </form>
        </div>

        <div>
          <h2 className="font-heading text-xl font-semibold mb-4">Newsletter</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Suscribite para recibir novedades y ofertas exclusivas.
          </p>
          <form
            onSubmit={newsletterForm.handleSubmit(onNewsletterSubmit)}
            className="flex gap-2"
          >
            <Input
              type="email"
              placeholder="tu@email.com"
              aria-label="Correo para newsletter"
              {...newsletterForm.register("email", { required: true })}
            />
            <Button type="submit" disabled={sendingNewsletter}>
              Suscribirme
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
