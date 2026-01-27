import { Meta } from "../common";
import { Field } from "./fields";

export type FormVisibility = {
  roles: string[];
  departments: string[];
  branches: string[];
  positions: string[];
};

export type FormCanEdit = {
  roles: string[];
  positions: string[];
};

export type FormSettings = {
  visibility: FormVisibility;
  canEdit: FormCanEdit;
};

export type Form = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  fields: Field[];
  workflowId?: string | null;
  createdBy: createdBy;
  isActive: boolean;
  settings?: FormSettings;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Analytics = {
  totalSubmissions: number;
  uniqueSubmitters: number;
  recentSubmissions: number;
};

type createdBy = {
  _id: string;
  firstname: string;
  lastname: string;
  email?: string;
};
export type FormDetails = {
  form: Form;
  analytics: Analytics;
};

export type FormList = {
  data: Form[];
  meta: Meta;
};

export type FieldTemplate = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  description?: string;
}

export type FormTemplateResponse = {
  formId: string;
  formName: string;
  fields: FieldTemplate[];
  metadata: FieldTemplate[];
  totalFields: number;
};
