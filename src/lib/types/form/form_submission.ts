import { Meta } from "../common";

export interface SubmittedBy {
  _id: string;
  email: string;
}

export interface FormSubmission {
  _id: string;
  formId: string;
  submittedBy: SubmittedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FormSubmissionList {
  data: FormSubmission[];
  meta: Meta;
}
