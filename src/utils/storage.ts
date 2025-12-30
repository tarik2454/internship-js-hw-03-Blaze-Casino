import { z } from "zod";

export const safeParseJSON = <T>(
  value: string | null,
  schema: z.ZodSchema<T>,
  defaultValue: T,
): T => {
  if (!value) return defaultValue;
  try {
    const parsed = JSON.parse(value);
    return schema.parse(parsed);
  } catch {
    return defaultValue;
  }
};

export const storage = {
  get: <T>(key: string, schema: z.ZodSchema<T>, defaultValue: T): T => {
    return safeParseJSON(localStorage.getItem(key), schema, defaultValue);
  },
  getString: (key: string, defaultValue: string | null = null): string | null => {
    if (typeof localStorage === "undefined") return defaultValue;
    return localStorage.getItem(key) ?? defaultValue;
  },
  set: (key: string, value: unknown): void => {
    if (typeof localStorage === "undefined") return;
    if (typeof value === "string") {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove: (key: string): void => {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(key);
  },
};

