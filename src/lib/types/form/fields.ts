export type FieldWidth = 25 | 33 | 50 | 66 | 75 | 100;

export enum FieldsType {
  TEXT = "text",
  NUMBER = "number",
  TEXT_AREA = "textarea",
  SELECT = "select",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  DATE = "date",
  EMAIL = "email",
}

export type FieldStyle = {
  width?: FieldWidth;
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
  validation?: FormFieldValidation;
  display?: FormFieldDisplay;
  order: number;
  style: FieldStyle;
};

export type FormFieldValidation = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  minSelections?: number;
  maxSelections?: number;
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
