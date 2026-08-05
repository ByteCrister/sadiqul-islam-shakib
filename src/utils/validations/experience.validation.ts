import { z } from "zod";

export const experienceSchema = z.object({
  role: z.string().min(1, "Role is required").max(150),
  org: z.string().max(150).optional().or(z.literal("")),
  period: z.string().min(1, "Period is required (e.g. 2022 – Present)"),
  description: z.string().min(5, "Description is required").max(1000),
  points: z.string().optional().or(z.literal("")),
  iconName: z.string().min(1, "Icon name is required (e.g. Briefcase)"),
  iconPlatform: z.enum(["react-icons", "lucide"], {
    message: "Please select an icon platform",
  }),
  sortOrder: z.number().int().min(0),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
