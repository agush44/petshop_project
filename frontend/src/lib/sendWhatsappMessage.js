const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export const sendWhatsappMessage = (cart, total, customerData) => {
  const itemsMessage = cart
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} - ${formatItemPrice(item.finalPrice)}`
    )
    .join("\n");

  const message = `¡Hola! Quiero confirmar mi pedido:\n\n${itemsMessage}\n\nTotal: ${total}\n\nDatos de envío:\nNombre: ${customerData.fullName}\nTeléfono: ${customerData.phone}\nDirección: ${customerData.address}${customerData.notes ? `\nNotas: ${customerData.notes}` : ""}`;

  const encodedMessage = encodeURIComponent(message);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const whatsappUrl = isMobile
    ? `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`
    : `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  const newWindow = window.open(whatsappUrl, "_blank");
  if (!newWindow) {
    alert("No se pudo abrir WhatsApp. Verificá que no estén bloqueadas las ventanas emergentes.");
  }
};

const formatItemPrice = (price) => Number(price).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
