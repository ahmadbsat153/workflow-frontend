import { Badge } from "@/lib/ui/badge";
import { Clock, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import type { WorkflowStatus } from "@/lib/types/approval";

type WorkflowStatusBadgeProps = {
  status: WorkflowStatus;
  className?: string;
};

const statusConfig: Record<
  WorkflowStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
  }
> = {
  pending: {
    label: "Pending",
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: <Clock className="h-3 w-3" />,
  },
  processing: {
    label: "Processing",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  waiting_approval: {
    label: "Awaiting Approval",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: <Clock className="h-3 w-3" />,
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  failed: {
    label: "Failed",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: <XCircle className="h-3 w-3" />,
  },
};

export function WorkflowStatusBadge({ status, className = "" }: WorkflowStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`${config.color} ${config.bgColor} ${config.borderColor} ${className}`}
    >
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  );
}

type ApprovalProgressProps = {
  currentApprovals: number;
  requiredApprovals: number;
  className?: string;
};

export function ApprovalProgress({
  currentApprovals,
  requiredApprovals,
  className = "",
}: ApprovalProgressProps) {
  const percentage = (currentApprovals / requiredApprovals) * 100;
  const isComplete = currentApprovals >= requiredApprovals;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Approvals</span>
        <span className="font-medium">
          {currentApprovals}/{requiredApprovals}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${isComplete ? "bg-green-600" : "bg-primary"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

type ApprovalStageStatusProps = {
  stageName: string;
  status: "Pending" | "Approved" | "Rejected" | "Skipped";
  currentApprovals?: number;
  requiredApprovals?: number;
};

export function ApprovalStageStatus({
  stageName,
  status,
  currentApprovals,
  requiredApprovals,
}: ApprovalStageStatusProps) {
  const statusColors = {
    Pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
    Approved: "text-green-600 bg-green-50 border-green-200",
    Rejected: "text-red-600 bg-red-50 border-red-200",
    Skipped: "text-gray-600 bg-gray-50 border-gray-200",
  };

  const statusIcons = {
    Pending: <Clock className="h-4 w-4" />,
    Approved: <CheckCircle className="h-4 w-4" />,
    Rejected: <XCircle className="h-4 w-4" />,
    Skipped: <AlertCircle className="h-4 w-4" />,
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${statusColors[status]}`}>{statusIcons[status]}</div>
        <div>
          <p className="font-medium">{stageName}</p>
          {currentApprovals !== undefined && requiredApprovals !== undefined && (
            <p className="text-sm text-muted-foreground">
              {currentApprovals} of {requiredApprovals} approved
            </p>
          )}
        </div>
      </div>
      <Badge variant="outline" className={statusColors[status]}>
        {status}
      </Badge>
    </div>
  );
}
