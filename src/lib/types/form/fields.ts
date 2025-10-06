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
export type Field = {
  _id: string;
  name: string;
  label: string;
  type: FieldsType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: string[];
  validation?: ValidationRule;
  order: number;
  style: FieldStyle;
};