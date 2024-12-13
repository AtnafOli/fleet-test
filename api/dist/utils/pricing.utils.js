"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingUtils = void 0;
const client_1 = require("@prisma/client");
const errorResponse_1 = require("./errorResponse");
const date_fns_1 = require("date-fns");
class PricingUtils {
    static calculatePrices(basePrice, cycle, discountPercentage) {
        const totalBasePrice = basePrice * cycle;
        const discountAmount = totalBasePrice * (discountPercentage / 100);
        const finalPrice = totalBasePrice - discountAmount;
        return {
            discountAmount,
            finalPrice,
        };
    }
    static getBillingCycleMultiplier(billingCycle) {
        const cycleMap = {
            [client_1.BillingCycle.MONTH_3]: 3,
            [client_1.BillingCycle.MONTH_6]: 6,
            [client_1.BillingCycle.MONTH_12]: 12,
        };
        const cycle = cycleMap[billingCycle];
        if (!cycle) {
            throw new errorResponse_1.ErrorResponse("Invalid Billing Cycle", 400);
        }
        return cycle;
    }
    static calculateEndDate(startDate, billingCycle) {
        const cycleMultiplier = this.getBillingCycleMultiplier(billingCycle);
        const endDate = (0, date_fns_1.addMonths)(startDate, cycleMultiplier);
        return endDate;
    }
}
exports.PricingUtils = PricingUtils;
