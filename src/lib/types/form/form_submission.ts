import { Meta } from "../common";
import { Field } from "./fields";
import { Form } from "./form";
import { WorkflowStatus, ApprovalStage } from "../approval";

export type SubmittedBy = {
  _id: string;
  email: string;
  name?: string;
}

export type FormSubmission = {
  _id: string;
  form: Form;
  submittedBy: SubmittedBy;
  submissionData: any;
  workflowStatus?: WorkflowStatus;
  currentStage?: string;
  approvalToken?: string; // Token for direct approval/rejection
  approvalStages?: ApprovalStage[]; // All approval stages for this submission
  overallApprovalStatus?: "Pending" | "Approved" | "Rejected" | "Not Applicable";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type FormSubmissionList = {
  data: FormSubmission[];
  fields?: Field[];
  meta: Meta;
}
