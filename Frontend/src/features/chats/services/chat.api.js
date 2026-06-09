const BASE = "/api/chat";

export const chatApi = {
  async getUserChats() {
    const res = await fetch(`${BASE}/`, {
      method: "GET",
      credentials: "include",
    });
    return res.json();
  },

  async getChatMessages(chatId) {
    const res = await fetch(`${BASE}/messages/${chatId}`, {
      method: "GET",
      credentials: "include",
    });
    return res.json();
  },

  async createChat(title) {
    const res = await fetch(`${BASE}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title }),
    });
    return res.json();
  },

  async deleteChat(chatId) {
    const res = await fetch(`${BASE}/delete/${chatId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },

  async sendMessage(chatId, messages, file = null) {
    return fetch(`${BASE}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ chatId, messages, file }),
    });
  },
};
