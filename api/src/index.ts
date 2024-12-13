import express from "express";
import { notFoundHandler } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/errorHandler";
import allRoutes from "./routes";
import { ErrorResponse } from "./errors/errorResponses";
import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import logger from "./utils/logger";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: [
      ...Array.from({ length: 65535 }, (_, i) => `http://localhost:${i + 1}`),
      "https://nice-events.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
// Routes
app.use("/api", allRoutes);

// Catch 404 routes
app.use(notFoundHandler);

// global error handler
app.use(
  (
    err: ErrorResponse | Prisma.PrismaClientKnownRequestError | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
