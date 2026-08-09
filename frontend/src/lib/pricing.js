// Un descuento solo cuenta como activo si tiene discountExpiresAt en el futuro
// (o sin fecha de expiración). Centralizado acá para que el badge, el precio
// tachado y el precio final que se cobra en el carrito nunca queden
// desincronizados entre sí.
export const hasActiveDiscount = (product) => {
  if (!product.discount || product.discount <= 0) return false;
  if (!product.discountExpiresAt) return true;
  return new Date(product.discountExpiresAt) >= new Date();
};

export const getFinalPrice = (product) =>
  hasActiveDiscount(product)
    ? product.price * (1 - product.discount / 100)
    : product.price;
