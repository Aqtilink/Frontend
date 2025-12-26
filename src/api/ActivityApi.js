import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export function useActivityApi() {
  const { getToken } = useAuth();

  const api = axios.create({
    baseURL: "http://localhost:8081/api/v1/activities",
  });

  // Automatically attach JWT to all requests
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  const getFeed = async () => {
    const res = await api.get("/feed");
    return res.data;
  }

  const getFriendsFeed = async () => {
    const res = await api.get("/friends-feed");
    return res.data;
  };

  const joinActivity = async (activityId) => {
    await api.post(`/${activityId}/join`);
  };

  const createActivity = async (payload) => {
    const res = await api.post("/json", payload);
    return res.data;
  };

  return { 
    getFeed, 
    getFriendsFeed,
    getJoinedActivities: async () => {
      const res = await api.get("/joined");
      return res.data;
    },
    getUserActivities: async () => {
      const res = await api.get("/user");
      return res.data;
    },
    joinActivity, 
    createActivity 
  };
}
