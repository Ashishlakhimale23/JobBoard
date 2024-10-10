import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { auth } from "./FirebaseAuth";

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 10000,
});

// ... Concurrency class remains the same ...
class Concurrency {
  queue: { resolve: Function; reject: Function }[];
  isRefreshing: boolean;
  constructor() {
    this.queue = [];
    this.isRefreshing = false;
  }
  execute(refreshTokenFunction: () => Promise<string>) {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        refreshTokenFunction()
          .then((token) => {
            this.queue.forEach((promise) => promise.resolve(token));
            this.queue = [];
            this.isRefreshing = false;
          })
          .catch((err) => {
            this.queue.forEach((promise) => promise.reject(err));
            this.queue = [];

          });
      }
    });
  }
}

const concurrencyInstance = new Concurrency();

const refreshToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user logged in");
  }
  
  try {
    const idToken = await user.getIdToken(true);
    localStorage.setItem("AccessToken", idToken);
    return idToken;
  } catch (error) {
    localStorage.removeItem("AccessToken");
    window.location.href = "/login";
    throw error;
  }
};

// Updated request interceptor with correct types
api.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const token = localStorage.getItem("AccessToken");
    if (!token) {
      window.location.href = "/login";
      return Promise.reject("No token found");
    }
    
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  }
);

// Response interceptor remains the same, but let's update types for consistency
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    try {
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const idToken = await concurrencyInstance.execute(refreshToken);
        
        if (!idToken) {
          throw new Error("Failed to refresh token");
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
        originalRequest.headers.Authorization = `Bearer ${idToken}`;
        
        return api(originalRequest);
      }
      return Promise.reject(error);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Token refresh failed:", err.message);
      }
      localStorage.removeItem("AccessToken");
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);