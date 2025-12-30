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

