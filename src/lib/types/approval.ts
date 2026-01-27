import { Meta } from "./common";

export type ApprovalDecision = "Pending" | "Approved" | "Rejected";

export type WorkflowStatus =
  | "waiting_approval"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "no_workflow";
  

export type ApproverDecision = {
  approverEmail: string;
  decision: ApprovalDecision;
  decidedAt: string;
  comments?: string;
};

export type ApprovalStage = {
  stageName: string;
  stageOrder: number;
  status: "Pending" | "Approved" | "Rejected" | "Skipped";
  requiredApprovals: number;
  approverDecisions: ApproverDecision[];
  stageStartedAt: string;
  stageCompletedAt: string | null;
};

export type SubmissionWithApproval = {
  id: string;
  workflowStatus: WorkflowStatus;
  overallApprovalStatus: "Pending" | "Approved" | "Rejected" | "Not Applicable";
  currentApprovalStageOrder: number;
  approvalStages: ApprovalStage[];
};

export type ApprovalVerificationResponse = {
  success: boolean;
  data: {
    submission: {
      id: string;
      formName: string;
      submittedBy: {
        name: string;
        email: string;
      };
      submittedAt: string;
      submissionData: Record<string, unknown>;
    };
    approvalStage: {
      stageName: string;
      requiredApprovals: number;
      currentApprovals: number;
      status: string;
    };
    approver: {
      email: string;
    };
  };
};

export type ApprovalDecisionRequest = {
  comments?: string;
  approverId?: string;
};

export type ApprovalDecisionResponse = {
  success: boolean;
  message: string;
  data: {
    decision: "Approved" | "Rejected";
    stageStatus: string;
    stageComplete: boolean;
    approvalCount: number;
    requiredApprovals: number;
  };
};

export type DecideRequest = ApprovalDecisionRequest & {
  decision: "Approved" | "Rejected";
};

// Approvals Listing Types
export interface MyApprovalSubmittedBy {
  name: string;
  email: string;
}

export interface MyApprovalStage {
  stageName: string;
  stageOrder: string;
  status: "Pending" | "Approved" | "Rejected";
  requiredApprovals: number;
  currentApprovals: number;
}

export interface MyApprovalDecision {
  decision: "Pending" | "Approved" | "Rejected";
  decidedAt: string | null;
  comments: string;
}

export interface MyApproval {
  _id?: string;
  submissionId: string;
  formName: string;
  submittedBy: MyApprovalSubmittedBy;
  submittedAt: string;
  stage: MyApprovalStage;
  myDecision: MyApprovalDecision;
  workflowStatus: WorkflowStatus;
  overallApprovalStatus: "Pending" | "Approved" | "Rejected";
  approvalToken?: string; // Token for direct approval/rejection
}

export interface MyApprovalPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyApprovalResponse {
  success: boolean;
  data: MyApproval[];
  pagination: MyApprovalPagination;
}

export interface MyApprovalTable {
  data: MyApproval[];
  meta: Meta;
}

export interface MyApprovalQueryParams {
  status?: "pending" | "approved" | "rejected";
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}
