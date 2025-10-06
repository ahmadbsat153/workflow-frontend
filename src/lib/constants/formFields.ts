import { FieldsType, Field } from "@/lib/types/form/fields";
import {
  CalendarIcon,
  CheckSquareIcon,
  CircleDotIcon,
  HashIcon,
  ListIcon,
  MailIcon,
  TextIcon,
  TypeIcon,
} from "lucide-react";

export const fieldConfigs: Record<FieldsType, Partial<Field>> = {
  [FieldsType.TEXT]: {
    label: "Text Input",
    placeholder: "Enter text...",
    required: false,
    defaultValue: "",
    validation: {
      minLength: 1,
      maxLength: 100,
    },
  },
  [FieldsType.NUMBER]: {
    label: "Number Input",
    placeholder: "Enter number...",
    required: false,
    defaultValue: 0,
    validation: {
      min: 0,
      max: 999,
    },
  },
  [FieldsType.TEXT_AREA]: {
    label: "Text Area",
    placeholder: "Enter long text...",
    required: false,
    defaultValue: "",
    validation: {
      minLength: 10,
      maxLength: 500,
    },
  },
  [FieldsType.SELECT]: {
    label: "Select Option",
    placeholder: "Choose an option...",
    required: false,
    defaultValue: "",
    options: ["Option 1", "Option 2", "Option 3"],
    validation: {},
  },
  [FieldsType.RADIO]: {
    label: "Radio Buttons",
    placeholder: undefined,
    required: false,
    defaultValue: "",
    options: ["Yes", "No", "Maybe"],
    validation: {},
  },
  [FieldsType.CHECKBOX]: {
    label: "Checkbox",
    placeholder: undefined,
    required: false,
    defaultValue: "",
    validation: {},
  },
  [FieldsType.DATE]: {
    label: "Date Picker",
    placeholder: "Select date...",
    required: false,
    defaultValue: "",
    validation: {},
  },
  [FieldsType.EMAIL]: {
    label: "Email Address",
    placeholder: "email@example.com",
    required: false,
    defaultValue: "",
    validation: {
      pattern: "^[^@]+@[^@]+\\.[^@]+$",
      minLength: 5,
      maxLength: 100,
    },
  },
};

// Helper function to get all field types
export const getAllFieldTypes = () => Object.values(FieldsType);

// Helper to create a field from config
export const createFieldFromType = (
  type: FieldsType,
  overrides?: Partial<Field>
): Field => {
  const config = fieldConfigs[type];
  return {
    name: overrides?.name || type,
    label: config.label || type,
    type: type,
    required: config.required ?? false,
    placeholder: config.placeholder,
    defaultValue: config.defaultValue,
    options: config.options,
    validation: config.validation || {},
    ...overrides,
  } as Field;
};

export const getFieldTypeIcon = (type: FieldsType) => {
  switch (type) {
    case FieldsType.TEXT:
      return TypeIcon;
    case FieldsType.NUMBER:
      return HashIcon;
    case FieldsType.TEXT_AREA:
      return TextIcon;
    case FieldsType.SELECT:
      return ListIcon;
    case FieldsType.CHECKBOX:
      return CheckSquareIcon;
    case FieldsType.RADIO:
      return CircleDotIcon;
    case FieldsType.DATE:
      return CalendarIcon;
    case FieldsType.EMAIL:
      return MailIcon;
    default:
      return TypeIcon;
  }
};