import type { UpdateUserFormData } from "../utils/zodValidation";
import type { User } from "../types";
import { UserSchema } from "../utils/schemas";
import { z } from "zod";
import { API } from "./axios";

export const getCurrentUser = async (): Promise<User> => {
  const response = await API.get(`/users/current?t=${Date.now()}`);
  return UserSchema.parse(response.data);
};

export const updateUser = async (data: UpdateUserFormData) => {
  const response = await API.patch("/users/update", data);
  return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await API.get(`/users?t=${Date.now()}`);
  return z.array(UserSchema).parse(response.data);
};
