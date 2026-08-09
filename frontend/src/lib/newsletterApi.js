import fetchData, { API_URL } from "./api";

export const subscribeNewsletter = (email) =>
  fetchData(`${API_URL}/api/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
