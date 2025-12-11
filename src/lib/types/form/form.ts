import { metadata } from './../../../app/layout';
import { Meta } from "../common";
import { Field } from "./fields";

export type Form = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  fields: Field[];
  workflowId?: string | null;
  createdBy: createdBy;
  isActive: boolean;
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
  firstname: string;
  lastname: string;
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
