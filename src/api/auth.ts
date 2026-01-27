import type { LoginFormData, RegisterFormData } from "../utils/zodValidation";
import type { AuthResponse } from "../types";
import { AuthResponseSchema } from "../utils/schemas";
import { AxiosError } from "axios";
import { storage } from "../utils/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { toast } from "react-toastify";
import { logger } from "../utils/logger";
import { API } from "./axios";

export const hasToken = (): boolean => {
  return storage.getString(STORAGE_KEYS.ACCESS_TOKEN) !== null;
};

export const initAuthToken = (): void => {
  const token = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

export const registerUser = async (data: RegisterFormData) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await API.post("/auth/login", data);
  const authData = AuthResponseSchema.parse(response.data);

  storage.set(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);

  API.defaults.headers.common.Authorization = `Bearer ${authData.accessToken}`;
  return authData;
};

export const logoutUser = async () => {
  try {
    if (hasToken()) {
      await API.post("/auth/logout");
    }
  } catch (error) {
    logger.error(error);
  } finally {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER_DATA);
    API.defaults.headers.common.Authorization = "";
  }
};

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
