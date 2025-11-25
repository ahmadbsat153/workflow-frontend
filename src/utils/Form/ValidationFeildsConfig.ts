import { FieldsType } from "@/lib/types/form/fields";

/**
 * Configuration for validation input fields in the form builder UI.
 * This defines the metadata for rendering validation rule inputs
 * and must stay in sync with buildFieldSettingsSchema.
 */
export const VALIDATION_FIELD_CONFIGS = {
  minLength: {
    label: "Minimum Length",
    type: "number",
    placeholder: "0",
    description: "Minimum number of characters required",
  },
  maxLength: {
    label: "Maximum Length",
    type: "number",
    placeholder: "100",
    description: "Maximum number of characters allowed",
  },
  pattern: {
    label: "Pattern (Regex)",
    type: "text",
    placeholder: "^[^@]+@[^@]+\\.[^@]+$",
    description: "Regular expression for validation",
  },
  min: {
    label: "Minimum Value",
    type: "number",
    placeholder: "0",
    description: "Minimum numeric value",
  },
  max: {
    label: "Maximum Value",
    type: "number",
    placeholder: "999",
    description: "Maximum numeric value",
  },
  minDate: {
    label: "Minimum Date",
    type: "date",
    placeholder: "",
    description: "Earliest selectable date",
  },
  maxDate: {
    label: "Maximum Date",
    type: "date",
    placeholder: "",
    description: "Latest selectable date",
  },
  minSelections: {
    label: "Minimum Selections",
    type: "number",
    placeholder: "1",
    description: "Minimum number of options that must be selected",
  },
  maxSelections: {
    label: "Maximum Selections",
    type: "number",
    placeholder: "3",
    description: "Maximum number of options that can be selected",
  },
  minFiles: {
    label: "Minimum Files",
    type: "number",
    placeholder: "1",
    description: "Minimum number of files required",
  },
  maxFiles: {
    label: "Maximum Files",
    type: "number",
    placeholder: "5",
    description: "Maximum number of files allowed",
  },
  maxFileSize: {
    label: "Maximum File Size (bytes)",
    type: "number",
    placeholder: "5242880",
    description:
      "Maximum size per file in bytes (default: 5MB = 5242880 bytes)",
  },
  allowedFileTypes: {
    label: "Allowed File Types",
    type: "multiselect",
    placeholder: "Select file types",
    description: "Select which file types are allowed for upload",
    options: [
      { label: "Images (PNG)", value: "image/png" },
      { label: "Images (JPEG)", value: "image/jpeg" },
      { label: "Images (GIF)", value: "image/gif" },
      { label: "Images (WebP)", value: "image/webp" },
      { label: "PDF", value: "application/pdf" },
      {
        label: "Word (DOCX)",
        value:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      {
        label: "Excel (XLSX)",
        value:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      { label: "Text", value: "text/plain" },
      { label: "CSV", value: "text/csv" },
      { label: "JSON", value: "application/json" },
      { label: "ZIP", value: "application/zip" },
    ],
  },
} as const;

/**
 * Returns the validation fields that should be displayed for a given field type.
 * This mapping mirrors the validation schema structure in buildFieldSettingsSchema.
 *
 * @param fieldType - The type of field to get validation inputs for
 * @returns Array of validation field configurations
 */
export const getValidationFieldsForType = (fieldType: FieldsType) => {
  switch (fieldType) {
    case FieldsType.TEXT:
    case FieldsType.TEXT_AREA:
      return ["minLength", "maxLength"].map((key) => ({
        name: `validation.${key}` as const,
        ...VALIDATION_FIELD_CONFIGS[
          key as keyof typeof VALIDATION_FIELD_CONFIGS
        ],
      }));

    case FieldsType.EMAIL:
      return ["minLength", "maxLength", "pattern"].map((key) => ({
        name: `validation.${key}` as const,
        ...VALIDATION_FIELD_CONFIGS[
          key as keyof typeof VALIDATION_FIELD_CONFIGS
        ],
      }));

    case FieldsType.NUMBER:
      return ["min", "max"].map((key) => ({
        name: `validation.${key}` as const,
        ...VALIDATION_FIELD_CONFIGS[
          key as keyof typeof VALIDATION_FIELD_CONFIGS
        ],
      }));

    case FieldsType.DATE:
      return [
        {
          name: "validation.min" as const,
          ...VALIDATION_FIELD_CONFIGS.minDate,
        },
        {
          name: "validation.max" as const,
          ...VALIDATION_FIELD_CONFIGS.maxDate,
        },
      ];

    case FieldsType.CHECKBOX:
      return ["minSelections", "maxSelections"].map((key) => ({
        name: `validation.${key}` as const,
        ...VALIDATION_FIELD_CONFIGS[
          key as keyof typeof VALIDATION_FIELD_CONFIGS
        ],
      }));

    case FieldsType.SELECT:
    case FieldsType.RADIO:
      return [];

    case FieldsType.FILE:
      return ["minFiles", "maxFiles", "allowedFileTypes", "maxFileSize"].map(
        (key) => ({
          name: `validation.${key}` as const,
          ...VALIDATION_FIELD_CONFIGS[
            key as keyof typeof VALIDATION_FIELD_CONFIGS
          ],
        })
      );

    default:
      return [];
  }
};
