"use client";

import { toast } from "sonner";
import { InfoIcon } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { URLs } from "@/lib/constants/urls";
import { useState, useEffect } from "react";
import { Textarea } from "@/lib/ui/textarea";
import { ErrorResponse } from "@/lib/types/common";
import { useAuth } from "@/lib/context/AuthContext";
import { formatDatesWithYear } from "@/utils/common";
import { handleServerError } from "@/lib/api/_axios";
import { useParams, useRouter } from "next/navigation";
import { PERMISSIONS } from "@/lib/constants/permissions";
import BackButton from "@/lib/components/Common/BackButton";
import { API_APPROVAL } from "@/lib/services/approval_service";
import { renderSubmittedFieldValue, SubmittedFieldValue } from "@/utils/fieldUtils";
import { FormSubmission } from "@/lib/types/form/form_submission";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import PageContainer from "@/lib/components/Container/PageContainer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import { API_FORM_SUBMISSION } from "@/lib/services/Form/form_submissions_service";
import { WorkflowStatusBadge } from "@/lib/components/Workflow/WorkflowStatusBadge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { Badge } from "@/lib/ui/badge";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type PageState = "loading" | "loaded" | "submitting" | "success" | "error";

function ApprovalDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const submissionId = params.submissionId as string;

  const [state, setState] = useState<PageState>("loading");
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [error, setError] = useState<string>("");
  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState<"Approved" | "Rejected" | null>(
    null
  );

  const loadSubmission = async () => {
    try {
      setState("loading");
      const res = await API_FORM_SUBMISSION.getSubmissionById(submissionId);
      setSubmission(res);
      setState("loaded");
    } catch (err: unknown) {
      handleServerError(err as ErrorResponse, (err_msg) => {
        setError(err_msg as string);
        toast.error(err_msg);
      });
      setState("error");
    }
  };

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission, submissionId]);

  const handleApprove = async () => {
    if (!submission) {
      toast.error("Submission data not available");
      return;
    }

    // Find the current pending stage
    const currentStage = submission.approvalStages?.find(
      (stage) => stage.status === "Pending"
    );

    if (!currentStage) {
      toast.error("No pending approval stage found");
      return;
    }

    try {
      setState("submitting");
      const response = await API_APPROVAL.approveSubmission(
        submission._id,
        currentStage.stageOrder.toString(),
        comments || undefined
      );
      setDecision("Approved");
      toast.success(response.message || "Submission approved successfully!");
      setState("success");

      // Redirect back to approvals list after 2 seconds
      setTimeout(() => {
        router.push(URLs.admin.approvals.index);
      }, 2000);
    } catch (err: unknown) {
      handleServerError(err as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
      setState("loaded");
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    if (!submission) {
      toast.error("Submission data not available");
      return;
    }

    // Find the current pending stage
    const currentStage = submission.approvalStages?.find(
      (stage) => stage.status === "Pending"
    );

    if (!currentStage) {
      toast.error("No pending approval stage found");
      return;
    }

    try {
      setState("submitting");
      const response = await API_APPROVAL.rejectSubmission(
        submission._id,
        currentStage.stageOrder.toString(),
        comments
      );
      setDecision("Rejected");
      toast.success(response.message || "Submission rejected successfully!");
      setState("success");

      // Redirect back to approvals list after 2 seconds
      setTimeout(() => {
        router.push(URLs.admin.approvals.index);
      }, 2000);
    } catch (err: unknown) {
      handleServerError(err as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
      setState("loaded");
    }
  };

  if (state === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading approval details...</p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="h-screen w-full flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Error Loading Approval</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={() => router.push(URLs.admin.approvals.index)}
              className="w-full"
            >
              Back to My Approvals
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="h-screen w-full flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div
              className={`flex items-center gap-2 ${
                decision === "Approved" ? "text-green-600" : "text-red-600"
              }`}
            >
              {decision === "Approved" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <CardTitle>Decision Recorded</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className={`p-4 border rounded-lg ${
                  decision === "Approved"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p className="font-semibold">
                  {decision === "Approved" ? "✓ Approved" : "✗ Rejected"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your decision has been recorded successfully.
                </p>
              </div>
              {comments && (
                <div>
                  <p className="text-sm font-medium mb-1">Your Comments:</p>
                  <p className="text-sm text-muted-foreground">{comments}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Redirecting to approvals list...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!submission) return null;

  // Check if user can approve/reject this submission
  // User can approve/reject only if their decision is pending
  const canApproveReject = submission.approvalStages?.some((stage) =>
    stage.approverDecisions.some(
      (decision) =>
        decision.decision === "Pending" &&
        decision.approverEmail === user?.user?.email
    )
  );

  const currentStage = submission.approvalStages?.find(
    (stage) => stage.status === "Pending"
  );

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto space-y-6 pb-5">
        <BackButton
          handleGoBack={() => router.push(URLs.admin.approvals.index)}
          text="Back to Approvals"
        />

        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {submission.form.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {submission.form.description}
                </CardDescription>
              </div>
              {submission.workflowStatus && (
                <WorkflowStatusBadge status={submission.workflowStatus} />
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submission Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Submitted By</p>
                <p className="font-medium">{submission.submittedBy.name}</p>
                <p className="text-xs text-muted-foreground">
                  {submission.submittedBy.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submission Date</p>
                <p className="font-medium">
                  {formatDatesWithYear(submission.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Status</p>
                <Badge variant="outline">
                  {submission.overallApprovalStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Approval Stage */}
        {currentStage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Approval Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Stage Name</p>
                  <p className="font-medium">{currentStage.stageName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {
                          currentStage.approverDecisions.filter(
                            (d) => d.decision === "Approved"
                          ).length
                        }{" "}
                        of {currentStage.requiredApprovals} approvals
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            (currentStage.approverDecisions.filter(
                              (d) => d.decision === "Approved"
                            ).length /
                              currentStage.requiredApprovals) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submitted Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {submission.form.fields
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((field) => {
                  const widthStyle = field.style?.width
                    ? {
                        flexBasis:
                          field.style.width === 100
                            ? "100%"
                            : `calc(${field.style.width}% - 1.25rem)`,
                        flexGrow: 0,
                        flexShrink: 0,
                        maxWidth:
                          field.style.width === 100
                            ? "100%"
                            : `calc(${field.style.width}% - 1.25rem)`,
                      }
                    : { width: "100%" };

                  const value = submission.submissionData[field.name] as SubmittedFieldValue;

                  return (
                    <div key={field._id} style={widthStyle}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-primary flex gap-2">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                          {field.display?.sensitiveInfo && (
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="text-destructive size-4 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent
                                side="bottom"
                                className="bg-cultured text-primary [&>span]:fill-cultured"
                              >
                                <p>Sensitive Information!</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </label>
                        <div className="text-gray-900">
                          {renderSubmittedFieldValue(field, value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Approval Actions */}
        {canApproveReject &&
          submission.workflowStatus === "waiting_approval" && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Make Your Decision</CardTitle>
                <CardDescription>
                  Review the submission carefully before approving or rejecting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comments Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Comments
                    <span className="text-xs text-muted-foreground ml-2">
                      (Required for rejection, optional for approval)
                    </span>
                  </label>
                  <Textarea
                    placeholder="Add your comments or reason for decision..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    This action cannot be undone. Your decision will be recorded
                    and may affect the workflow status.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <Button
                    onClick={handleReject}
                    variant="destructive"
                    className="flex-1"
                    size="lg"
                    disabled={state === "submitting" || !comments.trim()}
                  >
                    {state === "submitting" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={state === "submitting"}
                  >
                    {state === "submitting" ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        {/* Already decided message */}
        {!canApproveReject && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <p className="text-blue-800">
                  You have already made your decision on this submission, or you
                  are not required to approve at this stage.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

export default function ApprovalDetailsPage() {
  return (
    <ProtectedPage permission={PERMISSIONS.APPROVALS.VIEW}>
      <ApprovalDetailsContent />
    </ProtectedPage>
  );
}
