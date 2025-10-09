import { Meta } from "../common";
import { Form } from "./form";

export interface SubmittedBy {
  _id: string;
  email: string;
}

export interface FormSubmission {
  _id: string;
  form: Form;
  submittedBy: SubmittedBy;
  submissionData: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FormSubmissionList {
  data: FormSubmission[];
  meta: Meta;
}
