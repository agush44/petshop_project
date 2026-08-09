export const formatPrice = (price) => {
  const num = Number(price);
  if (Number.isNaN(num)) return "$0";

  return num.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
