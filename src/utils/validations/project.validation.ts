import { z } from "zod";

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  title: z.string().min(1, "Title is required").max(150),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  tech: z.string().min(1, "Tech stack is required"),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").min(1, "GitHub URL is required"),
  category: z.string().min(1, "Category is required"),
  timeline: z.string().optional().or(z.literal("")),
  features: z.string().optional(),
  challenges: z.string().optional(),
  learnings: z.string().optional(),
  loginEmail: z.string().email().optional().or(z.literal("")),
  loginPassword: z.string().optional().or(z.literal("")),
  warningMessage: z.string().optional().or(z.literal("")),
  thumbnailAssetId: z.string().uuid().optional().or(z.literal("")).or(z.null()),
  fullscreenAssetId: z.string().uuid().optional().or(z.literal("")).or(z.null()),
  sortOrder: z.number().int().min(0),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
