import { Meta } from "../common";
import { Field } from "./fields";
import { Form } from "./form";

export type SubmittedBy = {
  _id: string;
  email: string;
}

export type FormSubmission = {
  _id: string;
  form: Form;
  submittedBy: SubmittedBy;
  submissionData: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type FormSubmissionList = {
  data: FormSubmission[];
  fields?: Field[];
  meta: Meta;
}
