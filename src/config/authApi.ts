import type {
  LoginFormData,
  RegisterFormData,
  UpdateUserFormData,
} from "../utils/zodValidation";
import type { User, AuthResponse } from "../types";
import { UserSchema, AuthResponseSchema } from "../utils/schemas";
import { z } from "zod";
import axios, { AxiosError, type AxiosInstance } from "axios";
import { storage } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { toast } from "react-toastify";
import { logger } from "../utils/logger";

class AuthApi {
  private api: AxiosInstance;

  constructor() {
    const baseURL =
      "https://backend-internship-js-hw-03-sky-rus.vercel.app/api";

    this.api = axios.create({
      baseURL,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          storage.remove(STORAGE_KEYS.TOKEN);
          this.api.defaults.headers.common.Authorization = "";
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        }
        return Promise.reject(error);
      },
    );
  }

  hasToken(): boolean {
    return storage.getString(STORAGE_KEYS.TOKEN) !== null;
  }

  initAuthToken(): void {
    const token = storage.getString(STORAGE_KEYS.TOKEN);
    if (token) {
      this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }

  async registerUser(data: RegisterFormData) {
    const response = await this.api.post("/auth/register", data);
    return response.data;
  }

  async loginUser(data: LoginFormData): Promise<AuthResponse> {
    const response = await this.api.post("/auth/login", data);
    const authData = AuthResponseSchema.parse(response.data);
    storage.set(STORAGE_KEYS.TOKEN, authData.token);
    this.api.defaults.headers.common.Authorization = `Bearer ${authData.token}`;
    return authData;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get(`/users/current?t=${Date.now()}`);
    return UserSchema.parse(response.data);
  }

  async logoutUser() {
    const response = await this.api.post("/auth/logout");
    storage.remove(STORAGE_KEYS.TOKEN);
    this.api.defaults.headers.common.Authorization = "";
    return response.data;
  }

  async updateUser(data: UpdateUserFormData) {
    const response = await this.api.patch("/users/update", data);
    return response.data;
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get(`/users?t=${Date.now()}`);
    return z.array(UserSchema).parse(response.data);
  }

  getApiInstance(): AxiosInstance {
    return this.api;
  }
}

export const authApi = new AuthApi();

export const API = authApi.getApiInstance();

export const hasToken = () => authApi.hasToken();
export const initAuthToken = () => authApi.initAuthToken();
export const registerUser = (data: RegisterFormData) =>
  authApi.registerUser(data);
export const loginUser = (data: LoginFormData) => authApi.loginUser(data);
export const getCurrentUser = () => authApi.getCurrentUser();
export const logoutUser = () => authApi.logoutUser();
export const updateUser = (data: UpdateUserFormData) =>
  authApi.updateUser(data);
export const getAllUsers = () => authApi.getAllUsers();

export const handleApiError = (
  error: unknown,
  defaultMessage: string,
): void => {
  logger.error(error);
  if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || defaultMessage);
  } else {
    toast.error(defaultMessage);
  }
};

export const handleValidationError = (error: unknown): void => {
  if (error instanceof Error) {
    toast.warning(error.message);
  }
};

export type { User, AuthResponse };
