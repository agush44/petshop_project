import { Link } from "react-router-dom";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

const SOCIAL_LINKS = {
  instagram: "https://instagram.com/tupetshop",
  facebook: "https://facebook.com/tupetshop",
  whatsapp: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`,
};

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="font-heading font-semibold mb-2">Petshop</h3>
          <p className="text-sm text-muted-foreground">
            Tu tienda de confianza para consentir a tus mascotas.
          </p>
        </div>
        <div>
          <h3 className="font-heading font-semibold mb-2">Enlaces</h3>
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Inicio</Link></li>
            <li><Link to="/tienda" className="hover:text-primary">Tienda</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/nosotros" className="hover:text-primary">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-primary">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-semibold mb-2">Seguinos</h3>
          <div className="flex gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary"
            >
              <FaInstagram className="size-5" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-primary"
            >
              <FaFacebook className="size-5" />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="text-muted-foreground hover:text-primary"
            >
              <FaWhatsapp className="size-5" />
            </a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground pb-6">
        © {new Date().getFullYear()} Petshop. Todos los derechos reservados.
      </p>
    </footer>
  );
}
