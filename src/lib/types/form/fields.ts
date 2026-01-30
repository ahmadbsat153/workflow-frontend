import { EditableTableConfig } from "./editableTable";

// export type FieldWidth = 25 | 33 | 50 | 66 | 75 | 100;
export type FieldWidth = 33 | 50 | 66 | 100;

export enum FieldsType {
  // Input fields
  TEXT = "text",
  EMAIL = "email",
  NUMBER = "number",
  DATE = "date",
  PHONE = "phone",
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

  // Submitter Info field
  SUBMITTER_INFO = "submitterInfo",

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
  defaultValue?: unknown;
  options?: FormFieldOption[] | null;
  content?: DisplayContent; // For display elements
  validation?: FormFieldValidation;
  display?: FormFieldDisplay;
  order: number;
  style: FieldStyle;
  autofill?: boolean; // For organizational fields (department, position, branch)
  tableConfig?: EditableTableConfig; // For table fields
  submitterInfoConfig?: SubmitterInfoConfig; // For submitterInfo fields
  dateSettings?: DateSettings; // For date fields
  phoneSettings?: PhoneSettings; // For phone fields
};

export type DateFormat =
  | "MM-DD-YYYY"
  | "DD-MM-YYYY"
  | "YYYY-MM-DD"
  | "MM/DD/YYYY"
  | "DD/MM/YYYY"
  | "YYYY/MM/DD";

export type DateConstraint =
  | "any"
  | "today"
  | "beforeToday"
  | "afterToday"
  | "todayOrBefore"
  | "todayOrAfter";

export type DateSettings = {
  format: DateFormat;
};

export type CountryCode =
  | "US"
  | "GB"
  | "AE"
  | "SA"
  | "EG"
  | "JO"
  | "KW"
  | "QA"
  | "BH"
  | "OM"
  | "LB"
  | "SY"
  | "IQ"
  | "PS"
  | "YE"
  | "LY"
  | "TN"
  | "DZ"
  | "MA"
  | "SD"
  | "IN"
  | "PK"
  | "BD"
  | "DE"
  | "FR"
  | "IT"
  | "ES"
  | "NL"
  | "BE"
  | "CH"
  | "AT"
  | "SE"
  | "NO"
  | "DK"
  | "FI"
  | "PL"
  | "CZ"
  | "PT"
  | "GR"
  | "TR"
  | "RU"
  | "UA"
  | "CN"
  | "JP"
  | "KR"
  | "AU"
  | "NZ"
  | "CA"
  | "MX"
  | "BR"
  | "AR"
  | "CL"
  | "CO"
  | "ZA"
  | "NG"
  | "KE"
  | "GH"
  | "TH"
  | "VN"
  | "MY"
  | "SG"
  | "PH"
  | "ID";

export type PhoneSettings = {
  country: CountryCode;
  allowAnyCountry: boolean;
};

export type FormFieldValidation = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number | string;
  max?: number | string;
  minSelections?: number;
  maxSelections?: number;
  minFiles?: number;
  maxFiles?: number;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  dateConstraint?: DateConstraint;
};

export type FormFieldOption = {
  label: string;
  value: string;
};

export type SensitiveAccess = {
  allowSubmitter: boolean;
  allowApprovers: boolean;
  roles: string[];
  positions: string[];
  departments: string[];
  branches: string[];
  userIds: string[];
};

export type FormFieldDisplay = {
  showInTable: boolean;
  showInForm: boolean;
  showInDetail: boolean;
  sensitiveInfo: boolean;
  sensitiveAccess?: SensitiveAccess;
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

// Submitter Info Configuration
export type SubmitterInfoProperty =
  | "firstname"
  | "lastname"
  | "fullName"
  | "email"
  | "phone"
  | "payrollNo"
  | "businessUnit"
  | "businessUnitAddress"
  | "paymentMethod"
  | "department"
  | "position"
  | "branch"
  | "manager";

export type SubmitterInfoConfig = {
  property: SubmitterInfoProperty;
};
