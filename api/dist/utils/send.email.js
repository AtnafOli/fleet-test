"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API);
/**
 * Send an email using the Resend service.
 * @param from The sender's email address.
 * @param to An array of recipient email addresses.
 * @param subject The subject of the email.
 * @param html The HTML content of the email.
 */
const sendEmail = (from, to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield resend.emails.send({
            from,
            to,
            subject,
            html,
        });
        if (error) {
            console.error("Error sending email:", error);
            throw new Error("Error while sending email");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Exception while sending email:", err.message);
            throw new Error("Error while sending email");
        }
        else {
            console.error("Unexpected error:", err);
            throw new Error("An unexpected error occurred while sending email");
        }
    }
});
exports.sendEmail = sendEmail;
