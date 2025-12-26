import nodemailer from "nodemailer";
import type { Transporter, SendMailOptions } from "nodemailer";

const { gmailUser, gmailPass } = useRuntimeConfig();

// Create a transporter using Gmail SMTP
const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL
  secure: true, // true for 465, false for other ports
  auth: {
    user: gmailUser, // Your Gmail address
    pass: gmailPass, // App password (not regular password)
  },
});

// Function to send email
export async function sendEmail(options: SendMailOptions): Promise<void> {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    return Promise.reject(error);
  }
}
