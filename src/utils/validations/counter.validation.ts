import { z } from "zod";

export const counterSchema = z.object({
  label: z.string().min(1, "Label is required").max(100),
  value: z.number().int("Value must be a whole number").min(0, "Value must be 0 or more"),
  iconName: z.string().min(1, "Icon name is required (e.g. Calendar, Award)"),
  iconPlatform: z.enum(["react-icons", "lucide"], {
    message: "Please select an icon platform",
  }),
  sortOrder: z.number().int().min(0),
});

export type CounterFormValues = z.infer<typeof counterSchema>;
