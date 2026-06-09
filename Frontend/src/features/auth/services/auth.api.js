const BASE = "/api/auth";

export const authApi = {
  async register(fullname, email, password) {
    const res = await fetch(`${BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ fullname, email, password }),
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async logout() {
    const res = await fetch(`${BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${BASE}/get-me`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },
};
