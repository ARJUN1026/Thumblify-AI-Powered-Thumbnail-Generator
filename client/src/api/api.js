const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// request(endpoint, options) → base fetch helper
//   - attaches token from localStorage if present
//   - sets Content-Type: application/json
//   - throws error if response not ok
//   - returns parsed JSON data
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("thumblify_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  signup: (payload) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }), // POST /auth/signup
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }), // POST /auth/login
  getMe: () => request("/auth/me"), // GET  /auth/me
  generateThumbnail: (payload) =>
    request("/ai/generate-thumbnail", {
      method: "POST",
      body: JSON.stringify(payload),
    }), // POST /ai/generate-thumbnail
  getMyThumbnails: () => request("/thumbnails"), // GET  /thumbnails
  deleteThumbnail: (id) => request(`/thumbnails/${id}`, { method: "DELETE" }), // DELETE /thumbnails/:id
  getCommunityFeed: () => request("/thumbnails/community"), // GET  /thumbnails/community
  likeThumbnail: (id) =>
    request(`/thumbnails/community/${id}/like`, { method: "POST" }), // POST /thumbnails/community/:id/like
};

export default API_BASE_URL;
