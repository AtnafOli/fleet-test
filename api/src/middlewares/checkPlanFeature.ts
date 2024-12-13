import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { ErrorResponse } from "../utils/errorResponse";
import { db } from "../utils/db.server";
import { SubscriptionStatus } from "@prisma/client";

/**
 * Middleware to check if the user has access to a specific feature based on their subscription.
 */
export const checkPlanFeature = (featureId: number) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new ErrorResponse("User not authorized", 401));
      }

      const vendorId = req.user.id;

      try {
        const hasFeature = await checkIfUserHasFeature(vendorId, featureId);
        if (!hasFeature) {
          return next(
            new ErrorResponse("Access to this feature is not allowed", 403)
          );
        }
      } catch (err) {
        return next(err);
      }

      next();
    }
  );

/**
 * Check if the user has access to a specific feature based on their active plan.
 */
async function checkIfUserHasFeature(
  vendorId: number,
  featureId: number
): Promise<boolean> {
  const vendorPlan = await db.subscription.findFirst({
    where: {
      userId: vendorId,
      status: SubscriptionStatus.active,
    },
  });

  if (!vendorPlan) {
    throw new ErrorResponse("No active plan found for this vendor", 404);
  }

  console.log(vendorPlan.id);
  console.log(featureId);

  const featureAssignment = await db.planFeatureAssignment.findFirst({
    where: {
      featureId: featureId,
      planId: vendorPlan.planId,
    },
  });

  if (!featureAssignment) {
    throw new ErrorResponse(
      "You are not allowed to access this feature. Please upgrade your plan!",
      403
    );
  }

  return true;
}
