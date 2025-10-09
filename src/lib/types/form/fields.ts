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

export type ValidationRule = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
};

export interface Field {
  _id: string;
  name: string;
  label: string;
  type: FieldsType;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: FormFieldOption[] | null;
  validation?: FormFieldValidation;
  order: number;
  style: FieldStyle;
}

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  minSelections?: number;
  maxSelections?: number;
}

export interface FormFieldOption {
  label: string;
  value: string;
}
