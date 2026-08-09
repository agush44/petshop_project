import fetchData, { API_URL, authHeaders } from "./api";

export const sendContactMessage = (data) =>
  fetchData(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const fetchContactMessages = () =>
  fetchData(`${API_URL}/api/contact`, { headers: authHeaders() });
