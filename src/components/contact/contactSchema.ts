import { z } from "zod";

const ALLOWED_DOMAINS = ["gmail.com", "yahoo.com"] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name can’t exceed 50 characters")
    .regex(/^[a-zA-Z\s'.-]+$/, "Name can only contain letters, spaces, and basic punctuation"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .refine((email) => {
      const domain = email.split("@")[1];
      return ALLOWED_DOMAINS.includes(domain as typeof ALLOWED_DOMAINS[number]);
    }, {
      message: `Email must be one of: ${ALLOWED_DOMAINS.join(", ")}`,
    })
    .max(100, "Email can’t exceed 100 characters"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long")
    .max(500, "Message can’t exceed 500 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
