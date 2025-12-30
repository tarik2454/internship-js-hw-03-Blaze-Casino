import type {
  LoginFormData,
  RegisterFormData,
  UpdateUserFormData,
} from "../utils/zodValidation";
import type { User, AuthResponse } from "../types";
import { UserSchema, AuthResponseSchema } from "../utils/schemas";
import { z } from "zod";
import axios from "axios";
import { storage } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";

export const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://backend-internship-js-hw-03-sky-rus.vercel.app/api",
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      storage.remove(STORAGE_KEYS.TOKEN);
      API.defaults.headers.common.Authorization = "";

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export const hasToken = () => {
  return storage.getString(STORAGE_KEYS.TOKEN) !== null;
};

export const initAuthToken = () => {
  const token = storage.getString(STORAGE_KEYS.TOKEN);
  if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export type { User, AuthResponse };

export const registerUser = async (data: RegisterFormData) =>
  (await API.post("/auth/register", data)).data;

export const loginUser = async (data: LoginFormData) => {
  const response = await API.post("/auth/login", data);
  const authData = AuthResponseSchema.parse(response.data);
  storage.set(STORAGE_KEYS.TOKEN, authData.token);
  API.defaults.headers.common.Authorization = `Bearer ${authData.token}`;
  return authData;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await API.get(`/users/current?t=${Date.now()}`);
  return UserSchema.parse(response.data);
};

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  storage.remove(STORAGE_KEYS.TOKEN);
  API.defaults.headers.common.Authorization = "";
  return response.data;
};

export const updateUser = async (data: UpdateUserFormData) =>
  (await API.patch("/users/update", data)).data;

export const getAllUsers = async (): Promise<User[]> => {
  const response = await API.get(`/users?t=${Date.now()}`);
  return z.array(UserSchema).parse(response.data);
};
