import { ApiResponse } from "../types/apiResponse";

export const ok = <T>(data: T, message?: string): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const created = <T>(message?: string): ApiResponse<T> => ({
  success: true,
  message,
});

export const fail = (
  message: string,
  code: string = "INTERNAL_ERROR",
  details?: any
): ApiResponse => ({
  success: false,
  message,
  error: { code, details },
});
