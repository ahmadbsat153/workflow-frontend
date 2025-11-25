import { Node as ReactFlowNode, Edge } from "reactflow";
import { Action, ActionConfigField } from "@/lib/types/actions/action";

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
