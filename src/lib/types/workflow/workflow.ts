import { Meta } from "../common";
import { Form } from "../form/form";
import { Edge, Node as ReactFlowNode } from "reactflow";
import { Action } from "@/lib/types/actions/action";
import { SubmittedBy } from "../form/form_submission";

export type WorkflowNodeData = {
  label: string;
  tempId: string;
  stepName: string;
  actionId?: string;
  action?: Action;
  config: Record<string, unknown>;
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
  value: unknown;
};

export type WorkflowNode = ReactFlowNode<WorkflowNodeData>;

export type WorkflowStep = {
  tempId: string;
  stepName: string;
  type: "action" | "branch";
  actionId: string | null;
  conditions: ConditionData[];
  conditionLogic: "AND" | "OR";
  config: Record<string, unknown>;
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
  nodes: WorkflowNode[];
  edges: Edge[];
  workflowJSON: WorkflowJSON;
}

export interface WorkflowResponse {
  _id: string;
  name: string;
  description?: string;
  formId: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  workflowJSON: WorkflowJSON;
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
  submissionDataPreview: Record<string, unknown>;
  executionDuration: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type WorkflowHistoryList = {
  data: WorkflowHistory[];
  meta: Meta;
};
