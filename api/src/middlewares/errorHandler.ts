import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import logger from "../utils/logger";
import { ErrorResponse } from "../utils/errorResponse";
import { NotFoundError } from "../errors/errorResponses";

export function errorHandler(
  err: ErrorResponse | Prisma.PrismaClientKnownRequestError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body || {},
  });

  // generic HTTP error mapping for potential customization
  const genericErrorMap: Record<
    string,
    { message: string; statusCode: number }
  > = {
    ValidationError: { message: "Invalid input data", statusCode: 400 },
    UnauthorizedError: { message: "Unauthorized access", statusCode: 401 },
  };

  // Prisma error handling with a detailed map
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErrorMap: Record<
      string,
      { message: string; statusCode: number }
    > = {
      P2002: {
        message: "Duplicate field value: Unique constraint failed",
        statusCode: 409,
      },
      P2025: { message: "Record not found", statusCode: 404 },
      P2003: { message: "Foreign key constraint violation", statusCode: 400 },
    };

    const { message, statusCode } = prismaErrorMap[err.code] || {
      message: "Database error",
      statusCode: 500,
    };

    return res.status(statusCode).json({
      status: "fail",
      error: { message },
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // ErrorResponse handling
  if (err instanceof ErrorResponse) {
    return res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? "error" : "fail",
      error: { message: err.message },
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      status: 404 >= 500 ? "error" : "fail",
      error: { message: err.message },
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  const genericError = genericErrorMap[err.name] || {
    message: "Internal server error",
    statusCode: 500,
  };

  return res.status(genericError.statusCode).json({
    status: genericError.statusCode >= 500 ? "error" : "fail",
    error: { message: genericError.message },
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
