import { Meta } from "../common";

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  _id: string;
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "date"
    | "select"
    | "radio"
    | "checkbox";
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: FormFieldOption[];
  validation?: FormFieldValidation;
}

export interface Form {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  fields: FormField[];
  workflowId?: string | null;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Analytics {
  totalSubmissions: number;
  uniqueSubmitters: number;
  recentSubmissions: number;
}

export interface FormDetails {
  form: Form;
  analytics: Analytics;
}

export interface FormList {
  data: Form[];
  meta: Meta;
}
