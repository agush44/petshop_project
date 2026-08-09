import fetchData, { API_URL, authHeaders } from "./api";

export const fetchPosts = () => fetchData(`${API_URL}/api/posts`);

export const fetchPostsAdmin = () =>
  fetchData(`${API_URL}/api/posts/admin`, { headers: authHeaders() });

export const fetchPostBySlug = (slug) =>
  fetchData(`${API_URL}/api/posts/${slug}`);

export const createPost = (data) =>
  fetchData(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });

export const updatePost = (id, data) =>
  fetchData(`${API_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });

export const deletePost = (id) =>
  fetchData(`${API_URL}/api/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
