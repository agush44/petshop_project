import fetchData, { API_URL } from "./api";

export const fetchPaymentConfig = () => fetchData(`${API_URL}/api/payments/config`);

export const fetchPaymentStatus = (orderId) =>
  fetchData(`${API_URL}/api/payments/orders/${orderId}/status`);
