import { Resend } from "resend";

export const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

    throw new Error("RESEND_API_KEY no está definida");
  }

  return new Resend(process.env.RESEND_API_KEY);
};
