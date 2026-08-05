import { z } from "zod";

/** Accepts a standard URL, a mailto: URI, or a bare email address. */
const hrefSchema = z
  .string()
  .min(1, "URL or email is required")
  .transform((val) => val.trim())
  .refine(
    (val) => {
      // Allow bare emails
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return true;
      // Allow mailto: URIs
      if (val.startsWith("mailto:")) return true;
      // Allow any other valid URL
      try { new URL(val); return true; } catch { return false; }
    },
    { message: "Must be a valid URL, email address, or mailto: link" }
  )
  .transform((val) => {
    // Normalise bare emails -> mailto: so the href is always usable
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return `mailto:${val}`;
    return val;
  });

export const socialLinkSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  href: hrefSchema,
  iconName: z.string().min(1, "Icon name is required (e.g. Github, Linkedin)"),
  iconPlatform: z.enum(["react-icons", "lucide"], {
    message: "Please select an icon platform",
  }),
  context: z.enum(["header", "footer", "contact"], {
    message: "Please select a context",
  }),
  sortOrder: z.number().int().min(0),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;
