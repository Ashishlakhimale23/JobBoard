import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { auth } from "./FirebaseAuth";

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

export const api = axios.create({
  baseURL: process.env.BASE_URL,
});

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
            this.isRefreshing = false;
          });
      }
    });
  }
}

const concurrencyInstance = new Concurrency();

const refreshToken = async () => {
  const user = auth.currentUser;
  const idToken: string = await user?.getIdToken(true)!;
  localStorage.setItem("AccessToken", idToken);
  return idToken;
};

api.interceptors.request.use(
  function (config) {
    const token: string | null = localStorage.getItem("AccessToken");
    if (token === null) {
      window.location.href = "/login";
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    try {
      const originalRequest = error.config as AxiosRequestConfig;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const idToken = await concurrencyInstance.execute(refreshToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
        return api(originalRequest);
      }  else {
        return Promise.reject(error);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
);