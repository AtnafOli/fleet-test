import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../utils/db.server";
import { ErrorResponse } from "../utils/errorResponse";
import expressAsyncHandler from "express-async-handler";

const auth = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number;
      };

      const user = await db.user.findUnique({
        where: { id: decoded.id },
        select: { role: true, id: true },
      });

      if (!user) {
        return next(new ErrorResponse("User not found", 404));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(
        new ErrorResponse("Not authorized to access this resource", 403)
      );
    }
  }
);

const softAuth = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number;
      };

      const user = await db.user.findUnique({
        where: { id: decoded.id },
        select: { role: true, id: true },
      });

      if (user) {
        req.user = user;
      }

      next();
    } catch (error) {
      return next(
        new ErrorResponse("Not authorized to access this resource", 403)
      );
    }
  }
);

const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `This user role is not authorized to access this resource`,
          403
        )
      );
    }
    next();
  };
};

export { auth, authorize, softAuth };
