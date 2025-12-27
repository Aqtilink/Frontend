import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export function useUserApi() {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL:
      import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users",
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    getUser: async (id) => {
      const res = await api.get(`/${id}`);
      return res.data;
    },

    updateUser: async (id, payload) => {
      const res = await api.put(`/${id}`, payload);
      return res.data;
    },

    getFriends: async () => {
      const res = await api.get(`/me/friends`);
      return res.data;
    },

    searchUsers: async (query) => {
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
      return res.data;
    },

    sendFriendRequest: async (receiverId) => {
      const base = (import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users").replace(/\/users$/, "");
      const res = await axios.post(
        `${base}/friend-requests/send?receiverClerkId=${receiverId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      );
      return res.data;
    },

    getPendingRequests: async () => {
      const base = (import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users").replace(/\/users$/, "");
      const res = await axios.get(
        `${base}/friend-requests/pending`,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      );
      return res.data;
    },

    acceptFriendRequest: async (requestId) => {
      const base = (import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users").replace(/\/users$/, "");
      await axios.post(
        `${base}/friend-requests/${requestId}/accept`,
        null,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      );
    },

    rejectFriendRequest: async (requestId) => {
      const base = (import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users").replace(/\/users$/, "");
      await axios.post(
        `${base}/friend-requests/${requestId}/reject`,
        null,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      );
    },

    deleteUser: async (id) => {
      await api.delete(`/${id}`);
    },
  };
}
