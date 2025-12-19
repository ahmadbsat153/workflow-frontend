"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/lib/ui/button";
import { Textarea } from "@/lib/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/ui/dialog";
import { Label } from "@/lib/ui/label";
import { Badge } from "@/lib/ui/badge";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { MyApproval } from "@/lib/types/approval";
import { formatDatesWithYear } from "@/utils/common";
import { API_APPROVAL } from "@/lib/services/approval_service";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";

interface ApprovalActionDialogProps {
  approval: MyApproval | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  action: "approve" | "reject" | null;
}

export function ApprovalActionDialog({
  approval,
  open,
  onOpenChange,
  onSuccess,
  action,
}: ApprovalActionDialogProps) {
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!approval || !action) return;

    // Validate comments for rejection
    if (action === "reject" && !comments.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setIsSubmitting(true);

      // Note: This requires a token-based API call
      // You may need to modify the backend to support approval by submissionId
      // Or navigate to the submission details page for approval

      toast.info("Redirecting to approval page...");

      // For now, redirect to submission details where they can approve/reject
      window.location.href = `/admin/submissions/view/${approval.submissionId}`;

    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setComments("");
    onOpenChange(false);
  };

  if (!approval) return null;

  const isApprove = action === "approve";
  const title = isApprove ? "Approve Submission" : "Reject Submission";
  const description = isApprove
    ? "You are about to approve this submission."
    : "Please provide a reason for rejecting this submission.";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Submission Info */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Form Name</p>
                <p className="font-medium">{approval.formName}</p>
              </div>
              <Badge
                variant={
                  approval.overallApprovalStatus === "Pending"
                    ? "secondary"
                    : approval.overallApprovalStatus === "Approved"
                    ? "default"
                    : "destructive"
                }
              >
                {approval.overallApprovalStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Submitted By</p>
                <p className="font-medium text-sm">{approval.submittedBy.name}</p>
                <p className="text-xs text-muted-foreground">
                  {approval.submittedBy.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted At</p>
                <p className="font-medium text-sm">
                  {formatDatesWithYear(approval.submittedAt)}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Current Stage</p>
              <p className="font-medium text-sm">{approval.stage.stageName}</p>
              <p className="text-xs text-muted-foreground">
                {approval.stage.currentApprovals} of {approval.stage.requiredApprovals}{" "}
                approvals received
              </p>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">
              Comments {!isApprove && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="comments"
              placeholder={
                isApprove
                  ? "Add optional comments..."
                  : "Please provide a reason for rejection..."
              }
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="resize-none"
            />
            {!isApprove && (
              <p className="text-xs text-muted-foreground">
                A rejection reason is required
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">
              This action cannot be undone. Your decision will be recorded and may
              affect the workflow status.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!isApprove && !comments.trim())}
            variant={isApprove ? "default" : "destructive"}
            className={
              isApprove ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isApprove ? (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                {isApprove ? "Approve" : "Reject"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
