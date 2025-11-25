import { Meta } from "../common";

export type ActionConfigField = {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "textarea" | "number" | "boolean";
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