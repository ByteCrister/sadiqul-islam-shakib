import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required").max(80),
  category: z.enum(["Frontend", "Backend", "Database", "Programming", "Tools"], {
    message: "Please select a valid category",
  }),
  iconName: z.string().min(1, "Icon name is required (e.g. SiReact, FaBolt)"),
  iconPlatform: z.enum(["react-icons", "lucide"], {
    message: "Please select an icon platform",
  }),
  sortOrder: z.number().int().min(0),
});

export type SkillFormValues = z.infer<typeof skillSchema>;
