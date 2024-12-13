import expressAsyncHandler from "express-async-handler";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API!);

/**
 * Send an email using the Resend service.
 * @param from The sender's email address.
 * @param to An array of recipient email addresses.
 * @param subject The subject of the email.
 * @param html The HTML content of the email.
 */
const sendEmail = async (
  from: string,
  to: string[],
  subject: string,
  html: string
): Promise<void> => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Error while sending email");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Exception while sending email:", err.message);
      throw new Error("Error while sending email");
    } else {
      console.error("Unexpected error:", err);
      throw new Error("An unexpected error occurred while sending email");
    }
  }
};

export { sendEmail };
