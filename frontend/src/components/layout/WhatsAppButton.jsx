import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const message = "¡Hola! Estoy interesado en sus productos";

  const handleClick = () => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <button
      aria-label="Abrir WhatsApp"
      onClick={handleClick}
      className="fixed z-50 bottom-5 right-5 flex size-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform hover:scale-110"
    >
      <FaWhatsapp size={26} />
    </button>
  );
}
