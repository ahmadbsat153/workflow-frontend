import { Meta } from "../common";

export type ActionConfigField = {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "textarea" | "number" | "boolean" | "attachment" | "user";
  required: boolean;
  placeholder?: string;
  actionDescription?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: any;
  supportsTemplate?: boolean;
};

export type ActionConfigSchema = {
  fields: ActionConfigField[];
};

export type Action = {
  _id: string;
  actionName: string;
  displayName: string;
  actionDescription: string;
  category: "notification" | "data" | "approval" | "integration" | "logic";
  icon?: string;
  configSchema: ActionConfigSchema;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ActionTable = { 
  data: Action[]; 
  meta: Meta 
};

export type ActionList ={
  data : Action[];
}

// User selection modes for workflow actions
export enum UserSelectionMode {
  DIRECT_EMAIL = "direct_email",
  DEPARTMENT = "department",
  POSITION_IN_DEPARTMENT = "position_in_department",
  POSITION_FROM_FORM = "position_from_form",
  POSITION_ANY_DEPT = "position_any_dept",
  POSITION_IN_SUBMITTER_DEPT = "position_in_submitter_dept",
  BRANCH = "branch",
  BRANCH_FROM_FORM = "branch_from_form",
}

// Configuration for user field value
export type UserFieldValue = {
  mode: UserSelectionMode;
  // For DIRECT_EMAIL mode
  email?: string; // Legacy single email support
  emails?: string[]; // Multiple emails support
  // For DEPARTMENT mode
  departmentId?: string;
  // For POSITION_IN_DEPARTMENT mode
  positionId?: string;
  // For POSITION_FROM_FORM mode
  formFieldName?: string;
  // For BRANCH mode
  branchId?: string;
  // For BRANCH_FROM_FORM mode (uses formFieldName)
};