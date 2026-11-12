import fetchData, { API_URL, authHeaders } from "./api";

export const createOrder = (orderData) =>
  fetchData(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

export const fetchOrders = () =>
  fetchData(`${API_URL}/api/orders`, { headers: authHeaders() });

export const fetchOrderById = (id) =>
  fetchData(`${API_URL}/api/orders/${id}`, { headers: authHeaders() });

export const updateOrderStatus = (id, status) =>
  fetchData(`${API_URL}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });

export const confirmOrderWhatsapp = (id) =>
  fetchData(`${API_URL}/api/orders/${id}/whatsapp-confirm`, { method: "PATCH" });

export const confirmBankTransfer = (id) =>
  fetchData(`${API_URL}/api/payments/orders/${id}/transfer/confirm`, {
    method: "PATCH",
    headers: authHeaders(),
  });
