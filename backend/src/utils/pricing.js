// Espejo de frontend/src/lib/pricing.js: un descuento solo cuenta si
// discountExpiresAt sigue en el futuro (o no tiene fecha de expiración).
export const hasActiveDiscount = (product) => {
  if (!product.discount || product.discount <= 0) return false;
  if (!product.discountExpiresAt) return true;
  return new Date(product.discountExpiresAt) >= new Date();
};

export const getFinalPrice = (product) =>
  hasActiveDiscount(product)
    ? product.price * (1 - product.discount / 100)
    : product.price;
