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
  MinusIcon,
  Heading1Icon,
  FileTextIcon,
  SpaceIcon,
  ImageIcon,
  AlertCircleIcon,
  CodeIcon,
  ToggleRightIcon,
} from "lucide-react";

// Helper functions to categorize field types
export const isDisplayElement = (type: FieldsType): boolean => {
  return [
    FieldsType.SEPARATOR,
    FieldsType.TITLE,
    FieldsType.PARAGRAPH,
    FieldsType.SPACER,
    FieldsType.IMAGE,
    FieldsType.ALERT,
    FieldsType.HTML,
  ].includes(type);
};

export const isInputField = (type: FieldsType): boolean => {
  return [
    FieldsType.TEXT,
    FieldsType.NUMBER,
    FieldsType.EMAIL,
    FieldsType.DATE,
    FieldsType.SELECT,
    FieldsType.RADIO,
    FieldsType.CHECKBOX,
    FieldsType.TEXT_AREA,
    FieldsType.SWITCH,
  ].includes(type);
};

// Default values of fields
export const fieldConfigs: Record<FieldsType, Partial<Field>> = {
  // Input Fields
  [FieldsType.TEXT]: {
    label: "Text Input",
    placeholder: "Enter text...",
    required: false,
    defaultValue: "",
    options: undefined,
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
    options: [],
    validation: {},
  },
  [FieldsType.RADIO]: {
    label: "Radio Buttons",
    placeholder: undefined,
    required: false,
    defaultValue: "",
    options: [],
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
  [FieldsType.SWITCH]: {
    label: "Toggle Switch",
    required: false,
    defaultValue: false,
    validation: {},
  },

  // Display Elements
  [FieldsType.SEPARATOR]: {
    label: undefined,
    content: {
      text: undefined,
    },
    style: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#e5e7eb",
      margin: "20px 0",
    },
  },
  [FieldsType.TITLE]: {
    label: undefined,
    content: {
      text: "Section Title",
      level: 2,
    },
    style: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#1f2937",
      alignment: "left",
      margin: "0 0 10px 0",
    },
  },
  [FieldsType.PARAGRAPH]: {
    label: undefined,
    content: {
      text: "Add your description text here. This paragraph will help users understand what information is needed in this section.",
    },
    style: {
      fontSize: "1rem",
      color: "#6b7280",
      alignment: "left",
      margin: "0 0 15px 0",
    },
  },
  [FieldsType.SPACER]: {
    label: undefined,
    content: {
      height: 30,
    },
    style: {},
  },
  [FieldsType.IMAGE]: {
    label: undefined,
    content: {
      imageUrl: "https://via.placeholder.com/600x300",
      imageAlt: "Placeholder image",
    },
    style: {
      alignment: "center",
      margin: "20px 0",
    },
  },
  [FieldsType.ALERT]: {
    label: undefined,
    content: {
      text: "This is an important informational message for your users.",
      alertType: "info",
    },
    style: {
      margin: "10px 0",
    },
  },
  [FieldsType.HTML]: {
    label: undefined,
    content: {
      html: "<p>Add your custom <strong>HTML</strong> content here.</p>",
    },
    style: {
      margin: "10px 0",
    },
  },
};

// Helper function to get all field types
export const getAllFieldTypes = () => Object.values(FieldsType);

// Helper to get only input field types
export const getInputFieldTypes = () =>
  Object.values(FieldsType).filter(isInputField);

// Helper to get only display element types
export const getDisplayElementTypes = () =>
  Object.values(FieldsType).filter(isDisplayElement);

// Helper to create a field from config
export const createFieldFromType = (
  type: FieldsType,
  overrides?: Partial<Field>
): Field => {
  const config = fieldConfigs[type];

  // Base field structure
  const baseField: Partial<Field> = {
    name: overrides?.name || `${type}_${Date.now()}`,
    type: type,
    ...overrides,
  };

  // Display elements don't need label, placeholder, required, defaultValue, options, validation
  if (isDisplayElement(type)) {
    return {
      ...baseField,
      content: config.content,
      style: {
        ...config.style,
        ...overrides?.style,
      },
    } as Field;
  }

  // Input fields structure
  return {
    ...baseField,
    label: config.label || type,
    required: config.required ?? false,
    placeholder: config.placeholder,
    defaultValue: config.defaultValue,
    options: config.options,
    validation: config.validation || {},
  } as Field;
};

export const getFieldTypeIcon = (type: FieldsType) => {
  switch (type) {
    // Input Fields
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
    case FieldsType.SWITCH:
      return ToggleRightIcon;
    // Display Elements
    case FieldsType.SEPARATOR:
      return MinusIcon;
    case FieldsType.TITLE:
      return Heading1Icon;
    case FieldsType.PARAGRAPH:
      return FileTextIcon;
    case FieldsType.SPACER:
      return SpaceIcon;
    case FieldsType.IMAGE:
      return ImageIcon;
    case FieldsType.ALERT:
      return AlertCircleIcon;
    case FieldsType.HTML:
      return CodeIcon;

    default:
      return TypeIcon;
  }
};

// Helper to get field type label for display
export const getFieldTypeLabel = (type: FieldsType): string => {
  const labels: Record<FieldsType, string> = {
    // Input Fields
    [FieldsType.TEXT]: "Text",
    [FieldsType.NUMBER]: "Number",
    [FieldsType.EMAIL]: "Email",
    [FieldsType.DATE]: "Date",
    [FieldsType.SELECT]: "Select",
    [FieldsType.RADIO]: "Radio",
    [FieldsType.CHECKBOX]: "Checkbox",
    [FieldsType.TEXT_AREA]: "Textarea",
    [FieldsType.SWITCH]: "Switch",

    // Display Elements
    [FieldsType.SEPARATOR]: "Separator",
    [FieldsType.TITLE]: "Title",
    [FieldsType.PARAGRAPH]: "Paragraph",
    [FieldsType.SPACER]: "Spacer",
    [FieldsType.IMAGE]: "Image",
    [FieldsType.ALERT]: "Alert",
    [FieldsType.HTML]: "HTML",
  };

  return labels[type] || type;
};
