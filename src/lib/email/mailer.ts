import nodemailer from "nodemailer";
import { env } from "@/config/env";

// ? For production
export const mailer = async (To: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: env.EMAIL_AUTH,
                pass: env.PASSWORD_AUTH,
            },
        });

        const mailOptions = {
            from: `"Sadiqul Islam Shakib | Portfolio" <${env.EMAIL_AUTH}>`,
            to: To,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email. Check your SMTP settings.");
    }
};
