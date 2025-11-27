import { Node as ReactFlowNode, Edge } from "reactflow";
import { Action, ActionConfigField } from "@/lib/types/actions/action";
import { Form } from "../form/form";
import { User } from "../user/user";
import { Meta } from "../common";
import { SubmittedBy } from "../form/form_submission";

export type WorkflowNodeData = {
  label: string;
  tempId: string;
  stepName: string;
  actionId?: string;
  action?: Action; // Store full action data
  config: Record<string, any>;
  branches?: BranchData[];
};

export type BranchData = {
  name: string;
  conditions: ConditionData[];
  conditionLogic?: "AND" | "OR";
  targetStepTempId: string | null;
  nextStepTempIdAfterBranch?: string | null;
};

export type ConditionData = {
  field: string;
  operator: string;
  value: any;
};

export type WorkflowNode = ReactFlowNode<WorkflowNodeData>;

export type WorkflowStep = {
  tempId: string;
  stepName: string;
  type: "action" | "branch";
  actionId: string | null;
  conditions: ConditionData[];
  conditionLogic: "AND" | "OR";
  config: Record<string, any>;
  nextStepTempId: string | null;
};

export type WorkflowJSON = {
  workflowId: string;
  startStepTempId: string;
  steps: WorkflowStep[];
};

export interface SaveWorkflowRequest {
  workflowId?: string;
  name: string;
  description?: string;
  nodes: any[];
  edges: any[];
  workflowJSON: any;
}

export interface WorkflowResponse {
  _id: string;
  name: string;
  description?: string;
  formId: string;
  nodes: any[];
  edges: any[];
  workflowJSON: any;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTable {
  workflows: WorkflowResponse[];
  totalCount: number;
  page?: number;
  limit?: number;
}

export enum WorkflowStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export type WorkflowHistory = {
  _id: string;
  form: Form;
  submittedBy: SubmittedBy;
  workflowStatus: WorkflowStatus;
  workflowError: string | null;
  workflowCompletedAt: string;
  submissionDataPreview: Record<string, any>;
  executionDuration: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type WorkflowHistoryList = {
  data: WorkflowHistory[];
  meta: Meta;
};
