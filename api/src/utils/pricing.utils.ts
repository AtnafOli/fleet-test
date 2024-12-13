import { BillingCycle } from "@prisma/client";
import { ErrorResponse } from "./errorResponse";
import { addMonths } from "date-fns";

export class PricingUtils {
  static calculatePrices(
    basePrice: number,
    cycle: number,
    discountPercentage: number
  ) {
    const totalBasePrice = basePrice * cycle;
    const discountAmount = totalBasePrice * (discountPercentage / 100);
    const finalPrice = totalBasePrice - discountAmount;

    return {
      discountAmount,
      finalPrice,
    };
  }

  static getBillingCycleMultiplier(billingCycle: BillingCycle): number {
    const cycleMap = {
      [BillingCycle.MONTH_3]: 3,
      [BillingCycle.MONTH_6]: 6,
      [BillingCycle.MONTH_12]: 12,
    };

    const cycle = cycleMap[billingCycle];
    if (!cycle) {
      throw new ErrorResponse("Invalid Billing Cycle", 400);
    }

    return cycle;
  }

  static calculateEndDate(startDate: Date, billingCycle: BillingCycle): Date {
    const cycleMultiplier = this.getBillingCycleMultiplier(billingCycle);
    const endDate = addMonths(startDate, cycleMultiplier);
    return endDate;
  }
}
