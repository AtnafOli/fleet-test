import { Response } from "express";
import { ApiResponse } from "../types/response.types";

interface ResponseHandlerOptions<T> {
  res: Response;
  statusCode: number;
  data?: T;
  error?: string | null;
  message?: string;
}

/**
 * Sends a structured JSON response.
 *
 * @template T
 * @param {ResponseHandlerOptions<T>} options
 */
export const responseHandler = <T>({
  res,
  statusCode,
  data = {} as T,
  error = null,
  message = "Success",
}: ResponseHandlerOptions<T>): void => {
  const response: ApiResponse<T> = {
    success: !error,
    data: data || null,
    error: error || null,
    message: message || (error ? "An error occurred" : "Success"),
    timestamp: new Date().toISOString(),
    statusCode,
  };

  res.status(statusCode).json(response);
};
