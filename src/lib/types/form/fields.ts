import { EditableTableConfig } from "./editableTable";

// export type FieldWidth = 25 | 33 | 50 | 66 | 75 | 100;
export type FieldWidth = 33 | 50 | 66 | 100;

export enum FieldsType {
  // Input fields
  TEXT = "text",
  EMAIL = "email",
  NUMBER = "number",
  DATE = "date",
  SELECT = "select",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  TEXT_AREA = "textarea",
  SWITCH = "switch",
  FILE = "file",

  // Organizational fields
  DEPARTMENT = "department",
  POSITION = "position",
  BRANCH = "branch",

  // Display elements
  SEPARATOR = "separator",
  TITLE = "title",
  PARAGRAPH = "paragraph",
  SPACER = "spacer",
  IMAGE = "image",
  ALERT = "alert",
  HTML = "html",

  // Complex fields
  TABLE = "table",
}


export type FieldStyle = {
  width?: FieldWidth;
  alignment?: "left" | "center" | "right";
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
};

export type Field = {
  _id: string;
  name: string;
  label: string;
  type: FieldsType;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: FormFieldOption[] | null;
  content?: DisplayContent; // For display elements
  validation?: FormFieldValidation;
  display?: FormFieldDisplay;
  order: number;
  style: FieldStyle;
  autofill?: boolean; // For organizational fields (department, position, branch)
  tableConfig?: EditableTableConfig; // For table fields
};

export type FormFieldValidation = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  minSelections?: number;
  maxSelections?: number;
  minFiles?: number;
  maxFiles?: number;
  allowedFileTypes?: string[];
  maxFileSize?: number;
};

export type FormFieldOption = {
  label: string;
  value: string;
};

export type FormFieldDisplay = {
  showInTable: boolean;
  showInForm: boolean;
  showInDetail: boolean;
  sensitiveInfo: boolean;
};

export type DisplayContent = {
  text?: string;
  html?: string;
  imageUrl?: string;
  imageAlt?: string;
  level?: number; // 1-6 for title
  height?: number; // pixels for spacer
  alertType?: "info" | "success" | "warning" | "error";
};
