import { z } from "zod";

export const branchSchema = z.object({
  name: z
    .string()
    .min(1, "Branch name is required")
    .min(2, "Name must be at least 2 characters"),
  code: z
    .string()
    .min(1, "Branch code is required")
    .min(2, "Code must be at least 2 characters")
    .regex(
      /^[A-Z0-9_]+$/,
      "Code must be uppercase letters, numbers, or underscores"
    ),
  description: z.string(),
  departmentId: z.string().nullable().optional(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string().email("Invalid email format").or(z.literal("")),
  }),
  managerId: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export type BranchFormValues = z.infer<typeof branchSchema>;