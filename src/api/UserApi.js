import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export function useUserApi() {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL: "http://localhost:8080/api/v1/users",
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
  };
}
