import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const api = axios.create({
  // Allow overriding the backend URL at build time; fallback is local dev.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1",
});

export function useApi() {
  const { getToken } = useAuth();
  const tokenTemplate = import.meta.env.VITE_CLERK_TOKEN_TEMPLATE;

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

  return api;
}

