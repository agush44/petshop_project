import fetchData, { API_URL, authHeaders } from "./api";

export const subscribeNewsletter = (email) =>
  fetchData(`${API_URL}/api/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

export const fetchNewsletterSubscribers = () =>
  fetchData(`${API_URL}/api/newsletter`, { headers: authHeaders() });
