import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { logger } from "./logger";

export const handleApiError = (error: unknown, defaultMessage: string): void => {
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
