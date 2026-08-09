import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

export default function Nosotros() {
  return (
    <div>
      <PageBreadcrumb items={[{ label: "Nosotros" }]} />
      <h1 className="font-heading text-3xl font-bold mb-6">Sobre nosotros</h1>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col gap-4 text-muted-foreground">
          <p>
            Petshop nació como un pet shop de barrio con la idea de ofrecer productos
            de calidad y asesoramiento cercano para el cuidado de perros y gatos.
            Hoy sumamos la tienda online para llegar a más familias, sin perder ese
            trato personalizado.
          </p>
          <p>
            Trabajamos con marcas reconocidas de alimento balanceado, accesorios e
            higiene, y complementamos la tienda con contenido educativo sobre
            bienestar animal en nuestro blog.
          </p>
        </div>

        <div className="rounded-lg overflow-hidden border aspect-video">
          <iframe
            title="Ubicación de Petshop"
            src="https://www.google.com/maps?q=Santa+Fe,+Argentina&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
