import { Meta } from "../common";
import { Field } from "./fields";

export interface FormCreatedBy {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface Form {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  fields: Field[];
  workflowId?: string | null;
  createdBy: FormCreatedBy;
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
