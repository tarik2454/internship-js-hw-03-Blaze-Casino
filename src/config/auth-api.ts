import type {
  LoginFormData,
  RegisterFormData,
  UpdateUserFormData,
} from "../utils/zod-validation";
import axios from "axios";

export const API = axios.create({
  // baseURL: "https://backend-internship-js-hw-03-sky-rus.vercel.app/api",
  baseURL: "http://localhost:3000/api",
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      API.defaults.headers.common.Authorization = "";

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export const hasToken = () => {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem("token") !== null;
};

export const initAuthToken = () => {
  if (typeof localStorage === "undefined") return;
  const token = localStorage.getItem("token");
  if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export interface AuthResponse {
  token: string;
}

export interface User {
  _id: string;
  username: string;
  gamesPlayed: number;
  balance: number;
  totalWagered: number;
  totalWon: number;
}

export const registerUser = async (data: RegisterFormData) =>
  (await API.post("/auth/register", data)).data;

export const loginUser = async (data: LoginFormData) => {
  const response = await API.post("/auth/login", data);
  localStorage.setItem("token", response.data.token);
  API.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
  return response.data;
};

export const getCurrentUser = async () =>
  (await API.get(`/users/current?t=${Date.now()}`)).data;

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  localStorage.removeItem("token");
  API.defaults.headers.common.Authorization = "";
  return response.data;
};

export const updateUser = async (data: UpdateUserFormData) =>
  (await API.patch("/users/update", data)).data;

export const getAllUsers = async (): Promise<User[]> =>
  (await API.get(`/users?t=${Date.now()}`)).data;
