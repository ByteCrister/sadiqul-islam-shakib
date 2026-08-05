import { z } from "zod";

export const siteConfigSchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .regex(/^[a-z_]+$/, "Key must be lowercase letters and underscores only"),
  value: z.string().min(1, "Value is required"),
});

export type SiteConfigFormValues = z.infer<typeof siteConfigSchema>;
