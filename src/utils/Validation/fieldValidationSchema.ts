import { Field, FieldsType, FormFieldOption } from "@/lib/types/form/fields";
import { z } from "zod";
import { isDisplayElement } from "@/lib/constants/formFields";

const optionSchema = z.object({
  label: z.string().min(1, "Label cannot be empty"),
  value: z.string().min(1, "Value cannot be empty"),
});

/**
 * Builds a Zod validation schema for validating user input values in a form.
 *
 * This function creates a dynamic schema that validates the actual data entered by users
 * based on the field configurations. It applies validation rules like min/max length,
 * required fields, patterns, and type-specific validations.
 *
 * @param fields - Array of field configuration objects that define the form structure
 *
 * @returns A Zod object schema that validates user input data against the defined field rules
 *
 * @example
 * // Basic form with text and email fields
 * const fields = [
 *   {
 *     name: "username",
 *     type: FieldsType.TEXT,
 *     label: "Username",
 *     required: true,
 *     validation: { minLength: 3, maxLength: 20 }
 *   },
 *   {
 *     name: "email",
 *     type: FieldsType.EMAIL,
 *     label: "Email",
 *     required: true
 *   }
 * ];
 *
 * const schema = buildValidationSchema(fields);
 * const result = schema.safeParse({ username: "john", email: "john@example.com" });
 * // result.success = true
 *
 * @example
 * // Form with number validation
 * const fields = [
 *   {
 *     name: "age",
 *     type: FieldsType.NUMBER,
 *     label: "Age",
 *     required: true,
 *     validation: { min: 18, max: 100 }
 *   }
 * ];
 *
 * const schema = buildValidationSchema(fields);
 * const result = schema.safeParse({ age: 25 });
 * // result.success = true
 *
 * @example
 * // Form with select/radio and checkbox
 * const fields = [
 *   {
 *     name: "country",
 *     type: FieldsType.SELECT,
 *     label: "Country",
 *     required: true,
 *     options: [{ label: "USA", value: "us" }]
 *   },
 *   {
 *     name: "terms",
 *     type: FieldsType.CHECKBOX,
 *     label: "Accept Terms",
 *     required: true
 *   }
 * ];
 *
 * const schema = buildValidationSchema(fields);
 * const result = schema.safeParse({ country: "us", terms: true });
 * // result.success = true
 *
 * @remarks
 * This schema is used for runtime validation of end-user input in forms.
 * For validating field configuration metadata in a form builder, use `buildFieldSettingsSchema`.
 *
 * Validation rules by field type:
 * - TEXT/TEXT_AREA: minLength, maxLength, pattern (regex), required
 * - EMAIL: Valid email format, minLength (via required check)
 * - NUMBER: min value, max value, required (coerces strings to numbers)
 * - SELECT/RADIO: Non-empty string selection when required, validates against allowed options
 * - CHECKBOX: Boolean value, can require true value, multiple checkboxes support min/max selection
 * - DATE: Non-empty date string when required
 *
 * @see {@link buildFieldSettingsSchema} for validating field configuration metadata
 */
export const buildValidationSchema = (fields: Field[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    // Skip display elements - they don't collect user input
    if (isDisplayElement(field.type)) {
      return;
    }

    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case FieldsType.TEXT:
      case FieldsType.TEXT_AREA:
        let stringSchema = z.string();

        if (field.validation?.minLength) {
          stringSchema = stringSchema.min(
            field.validation.minLength,
            `${field.label} must be at least ${field.validation.minLength} characters`
          );
        }

        if (field.validation?.maxLength) {
          stringSchema = stringSchema.max(
            field.validation.maxLength,
            `${field.label} must be at most ${field.validation.maxLength} characters`
          );
        }

        if (field.validation?.pattern) {
          stringSchema = stringSchema.regex(
            new RegExp(field.validation.pattern),
            `${field.label} format is invalid`
          );
        }

        if (field.required) {
          stringSchema = stringSchema.min(1, `${field.label} is required`);
        }

        fieldSchema = field.required ? stringSchema : stringSchema.optional();
        break;

      case FieldsType.EMAIL:
        let emailSchema = z
          .string()
          .email(`Please enter a valid email address`);

        if (field.required) {
          emailSchema = emailSchema.min(1, `${field.label} is required`);
        }

        fieldSchema = field.required ? emailSchema : emailSchema.optional();
        break;

      case FieldsType.NUMBER:
        let numberSchema = z.coerce.number();

        if (field.validation?.min !== undefined) {
          numberSchema = numberSchema.min(
            field.validation.min,
            `${field.label} must be at least ${field.validation.min}`
          );
        }

        if (field.validation?.max !== undefined) {
          numberSchema = numberSchema.max(
            field.validation.max,
            `${field.label} must be at most ${field.validation.max}`
          );
        }

        fieldSchema = field.required ? numberSchema : numberSchema.optional();
        break;

      case FieldsType.SELECT:
      case FieldsType.RADIO:
        let selectSchema = z.string();

        if (field.required) {
          selectSchema = selectSchema.min(1, `Please select a ${field.label}`);
        }

        // Validate that selected value is one of the allowed options
        if (field.options && field.options.length > 0) {
          const allowedValues = field.options.map((opt) => opt.value);
          selectSchema = selectSchema.refine(
            (val) => !val || allowedValues.includes(val),
            `Please select a valid ${field.label}`
          );
        }

        fieldSchema = field.required ? selectSchema : selectSchema.optional();
        break;

      case FieldsType.CHECKBOX:
        // Single checkbox (boolean)
        if (!field.options || field.options.length === 0) {
          fieldSchema = z.boolean();
          if (field.required) {
            fieldSchema = fieldSchema.refine(
              (val) => val === true,
              `${field.label} must be checked`
            );
          } else {
            fieldSchema = fieldSchema.optional();
          }
        }
        // Multiple checkboxes (array of values)
        else {
          let checkboxArraySchema = z.array(z.string());

          // Validate that all checked values are valid options
          const allowedValues = field.options.map((opt) => opt.value);
          checkboxArraySchema = checkboxArraySchema.refine(
            (values) => values.every((val) => allowedValues.includes(val)),
            `Invalid selection for ${field.label}`
          );

          // Minimum selections validation
          if (field.validation?.minSelections) {
            checkboxArraySchema = checkboxArraySchema.min(
              field.validation.minSelections,
              `Please select at least ${field.validation.minSelections} ${field.label}`
            );
          } else if (field.required) {
            checkboxArraySchema = checkboxArraySchema.min(
              1,
              `Please select at least one ${field.label}`
            );
          }

          // Maximum selections validation
          if (field.validation?.maxSelections) {
            checkboxArraySchema = checkboxArraySchema.max(
              field.validation.maxSelections,
              `Please select at most ${field.validation.maxSelections} ${field.label}`
            );
          }

          fieldSchema = field.required
            ? checkboxArraySchema
            : checkboxArraySchema.optional();
        }
        break;

      case FieldsType.DATE:
        let dateSchema = z.string();

        if (field.required) {
          dateSchema = dateSchema.min(1, `Please select a date`);
        }

        // Validate date range if min/max dates are specified
        if (field.validation?.min || field.validation?.max) {
          dateSchema = dateSchema.refine(
            (val) => {
              if (!val) return true;
              const date = new Date(val);

              if (field.validation?.min) {
                const minDate = new Date(field.validation.min);
                if (date < minDate) return false;
              }

              if (field.validation?.max) {
                const maxDate = new Date(field.validation.max);
                if (date > maxDate) return false;
              }

              return true;
            },
            {
              message:
                field.validation?.min && field.validation?.max
                  ? `Date must be between ${field.validation.min} and ${field.validation.max}`
                  : field.validation?.min
                  ? `Date must be after ${field.validation.min}`
                  : `Date must be before ${field.validation.max}`,
            }
          );
        }

        fieldSchema = field.required ? dateSchema : dateSchema.optional();
        break;

      default:
        fieldSchema = z.string().optional();
    }

    schemaFields[field.name] = fieldSchema;
  });

  return z.object(schemaFields);
};

/**
 * Builds a Zod validation schema for field configuration settings.
 *
 * This function creates a schema that validates the metadata and configuration
 * of a form field (such as name, label, validation rules), NOT the actual user input values.
 * It's used when editing or creating field settings in a form builder interface.
 *
 * @param field - The field object containing type and current configuration
 *
 * @returns A Zod schema object that validates:
 * - For input fields: name, label, placeholder, required, defaultValue, validation rules, options
 * - For display elements: name, content, style
 *
 * @example
 * // For a TEXT field
 * const field = { type: FieldsType.TEXT, name: "username", label: "Username" };
 * const schema = buildFieldSettingsSchema(field);
 * // Returns schema that validates: name, label, placeholder, required,
 * // and validation rules (minLength, maxLength, pattern)
 *
 * @example
 * // For a TITLE display element
 * const field = { type: FieldsType.TITLE, name: "header_title" };
 * const schema = buildFieldSettingsSchema(field);
 * // Returns schema that validates: name, content (text, level), style
 *
 * @remarks
 * This schema is used for validating field configuration in a form builder UI,
 * not for validating end-user input. For user input validation, use `buildValidationSchema`.
 */
export const buildFieldSettingsSchema = (field: Field) => {
  // Schema for display elements
  if (isDisplayElement(field.type)) {
    switch (field.type) {
      case FieldsType.SEPARATOR:
        return z.object({
          name: z.string().min(1, "Field name is required"),
          content: z.object({}).optional(),
          style: z.object({
            borderStyle: z.string().optional(),
            borderWidth: z.string().optional(),
            borderColor: z.string().optional(),
            margin: z.string().optional(),
          }).optional(),
        });

      case FieldsType.TITLE:
        return z.object({
          name: z.string().min(1, "Field name is required"),
          content: z.object({
            text: z.string().min(1, "Title text is required"),
            level: z.number().min(1).max(6).optional(),
          }),
          style: z.object({
            fontSize: z.string().optional(),
            fontWeight: z.string().optional(),
            color: z.string().optional(),
            backgroundColor: z.string().optional(),
            alignment: z.enum(["left", "center", "right"]).optional(),
            padding: z.string().optional(),
            margin: z.string().optional(),
          }).optional(),
        });

      case FieldsType.PARAGRAPH:
        return z.object({
          name: z.string().min(1, "Field name is required"),
          content: z.object({
            text: z.string().min(1, "Paragraph text is required"),
          }),
          style: z.object({
            fontSize: z.string().optional(),
            fontWeight: z.string().optional(),
            color: z.string().optional(),
            backgroundColor: z.string().optional(),
            alignment: z.enum(["left", "center", "right"]).optional(),
            padding: z.string().optional(),
            margin: z.string().optional(),
          }).optional(),
        });

      case FieldsType.SPACER:
        return z.object({
          name: z.string().min(1, "Field name is required"),
          content: z.object({
            height: z.number().min(1, "Height must be at least 1px").max(1000, "Height cannot exceed 1000px"),
          }),
          style: z.object({}).optional(),
        });

      case FieldsType.IMAGE:
        return z.object({
          name: z.string().min(1, "Field name is required"),
          content: z.object({
            imageUrl: z.string().url("Must be a valid URL"),
            imageAlt: z.string().optional(),
          }),
          style: z.object({
            alignment: z.enum(["left", "center", "right"]).optional(),
            padding: z.string().optional(),
            margin: z.string().optional(),
          }).optional(),
        });

      case FieldsType.ALERT:
        return z.object({
          name: z.string().min(1, "Field name is required"),
          content: z.object({
            text: z.string().min(1, "Alert message is required"),
            alertType: z.enum(["info", "success", "warning", "error"]).optional(),
          }),
          style: z.object({
            margin: z.string().optional(),
          }).optional(),
        });

      case FieldsType.HTML:
        return z.object({
          name: z.string().min(1, "Field name is required"),
          content: z.object({
            html: z.string().min(1, "HTML content is required"),
          }),
          style: z.object({
            padding: z.string().optional(),
            margin: z.string().optional(),
          }).optional(),
        });

      default:
        // Fallback for any display element
        return z.object({
          name: z.string().min(1, "Field name is required"),
          content: z.object({}).passthrough().optional(),
          style: z.object({}).passthrough().optional(),
        });
    }
  }

  // Schema for input fields
  const baseSchema = {
    name: z.string().min(1, "Field name is required"),
    label: z.string().min(1, "Label is required"),
    placeholder: z.string().optional(),
    required: z.boolean(),
    defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
    display: z.object({
      showInTable: z.boolean(),
      showInForm: z.boolean(),
      showInDetail: z.boolean(),
      sensitiveInfo: z.boolean(),
    }),
  };

  const getValidationSchema = () => {
    switch (field.type) {
      case FieldsType.TEXT:
      case FieldsType.TEXT_AREA:
        return z
          .object({
            minLength: z.number().optional(),
            maxLength: z.number().optional(),
            pattern: z.string().optional(),
          })
          .optional();

      case FieldsType.EMAIL:
        return z
          .object({
            minLength: z.number().optional(),
            maxLength: z.number().optional(),
            pattern: z.string().optional(),
          })
          .optional();

      case FieldsType.NUMBER:
        return z
          .object({
            min: z.number().optional(),
            max: z.number().optional(),
          })
          .optional();

      case FieldsType.SELECT:
      case FieldsType.RADIO:
        return z.any().optional();

      case FieldsType.CHECKBOX:
        return z
          .object({
            minSelections: z.number().min(1).optional(),
            maxSelections: z.number().min(1).optional(),
          })
          .optional()
          .refine((data) => {
            if (!data?.minSelections || !data?.maxSelections) return true;
            return data.minSelections <= data.maxSelections;
          }, "Minimum selections cannot be greater than maximum selections");

      case FieldsType.DATE:
        return z
          .object({
            min: z.string().optional(),
            max: z.string().optional(),
          })
          .optional();

      default:
        return z.any().optional();
    }
  };

  const schemaObject = {
    ...baseSchema,
    validation: getValidationSchema(),
  };

  if (
    field.type === FieldsType.SELECT ||
    field.type === FieldsType.RADIO ||
    field.type === FieldsType.CHECKBOX
  ) {
    return z.object({
      ...schemaObject,
      options: z
        .array(optionSchema)
        .min(1, "At least one option is required")
        .refine((options) => {
          const values = options.map((opt) => opt.value);
          return new Set(values).size === values.length;
        }, "Option values must be unique"),
    });
  }

  return z.object(schemaObject);
};