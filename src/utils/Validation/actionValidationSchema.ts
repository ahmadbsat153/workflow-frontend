// utils/Validation/actionValidationSchema.ts
import { z } from "zod";

const actionConfigFieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Label is required"),
  type: z.enum(["text", "email", "select", "textarea", "number", "boolean", "attachment"]),
  required: z.boolean(), // Remove .default() here - make it required
  placeholder: z.string().optional(),
  actionDescription: z.string().optional(),
  options: z
    .array(
      z.object({
        label: z.string().min(1, "Option label is required"),
        value: z.string().min(1, "Option value is required"),
      })
    )
    .optional(),
  defaultValue: z.any().optional(),
  supportsTemplate: z.boolean().optional(),
});

export const actionSchema = z.object({
  actionName: z
    .string()
    .min(2, "Action name must be at least 2 characters")
    .max(50, "Action name cannot exceed 50 characters")
    .regex(/^[a-z0-9-]+$/, "Action name must be lowercase with hyphens only"),

  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name cannot exceed 100 characters"),

  actionDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),

  category: z.enum(["notification", "data", "approval", "integration", "logic"]),

  icon: z.string().optional(),

  configSchema: z.object({
    fields: z
      .array(actionConfigFieldSchema)
      .min(1, "At least one config field is required"),
  }),

  isActive: z.boolean().optional(),
});

export type ActionFormValues = z.infer<typeof actionSchema>;