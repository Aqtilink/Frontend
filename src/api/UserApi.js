import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export function useUserApi() {
  const { getToken } = useAuth();
  const tokenTemplate = import.meta.env.VITE_CLERK_TOKEN_TEMPLATE;

  const api = axios.create({
    baseURL:
      import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users",
  });

  api.interceptors.request.use(async (config) => {
    try {
      const token = await getToken(
        tokenTemplate ? { template: tokenTemplate } : undefined
      );
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get token:", error);
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
      return Array.isArray(res.data) ? res.data : [];
    },

    searchUsers: async (query) => {
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
      return res.data;
    },

    sendFriendRequest: async (receiverId) => {
      const token = await getToken(
        tokenTemplate ? { template: tokenTemplate } : undefined
      );
      const baseUrl = import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users";
      const friendRequestsUrl = baseUrl.replace(/\/users$/, "/friend-requests");
      const url = `${friendRequestsUrl}/send?receiverClerkId=${receiverId}`;
      console.log("Sending friend request to:", url);
      try {
        const res = await axios.post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        return res.data;
      } catch (error) {
        console.error("Friend request error:", error.response?.data || error.message);
        throw error;
      }
    },

    getPendingRequests: async () => {
      const base = (import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users").replace(/\/users$/, "");
        const token = await getToken(
          tokenTemplate ? { template: tokenTemplate } : undefined
        );
        const res = await axios.get(
        `${base}/friend-requests/pending`,
        {
          headers: {
                Authorization: `Bearer ${token}`
          }
        }
      );
      return res.data;
    },

    acceptFriendRequest: async (requestId) => {
      const base = (import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users").replace(/\/users$/, "");
        const token = await getToken(
          tokenTemplate ? { template: tokenTemplate } : undefined
        );
        await axios.post(
        `${base}/friend-requests/${requestId}/accept`,
        null,
        {
          headers: {
                Authorization: `Bearer ${token}`
          }
        }
      );
    },

    rejectFriendRequest: async (requestId) => {
      const base = (import.meta.env.VITE_USER_API_URL || "http://localhost:8080/api/v1/users").replace(/\/users$/, "");
        const token = await getToken(
          tokenTemplate ? { template: tokenTemplate } : undefined
        );
        await axios.post(
        `${base}/friend-requests/${requestId}/reject`,
        null,
        {
          headers: {
                Authorization: `Bearer ${token}`
          }
        }
      );
    },

    deleteUser: async (id) => {
      await api.delete(`/${id}`);
    },
  };
}
