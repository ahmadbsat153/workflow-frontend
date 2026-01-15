"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_APPROVAL } from "@/lib/services/approval_service";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { toast } from "sonner";
import { Button } from "@/lib/ui/button";
import { Textarea } from "@/lib/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { Badge } from "@/lib/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { ApprovalVerificationResponse } from "@/lib/types/approval";
import { URLs } from "@/lib/constants/urls";

type PageState = "loading" | "loaded" | "submitting" | "success" | "error";

export default function ApprovalReviewPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [state, setState] = useState<PageState>("loading");
  const [data, setData] = useState<ApprovalVerificationResponse["data"] | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState<"Approved" | "Rejected" | null>(
    null
  );

  const verifyToken = async () => {
    try {
      setState("loading");
      const response = await API_APPROVAL.verifyToken(token);
      setData(response.data);
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
    verifyToken();
  }, [verifyToken, token]);

  const handleApprove = async () => {
    try {
      setState("submitting");
      const response = await API_APPROVAL.approve(token, {
        comments: comments || undefined,
      });
      setDecision("Approved");
      toast.success(response.message || "Submission approved successfully!");
      setState("success");

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(URLs.admin.approvals.success);
      }, 3000);
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

    try {
      setState("submitting");
      const response = await API_APPROVAL.reject(token, {
        comments: comments || undefined,
      });
      setDecision("Rejected");
      toast.success(response.message || "Submission rejected successfully!");
      setState("success");

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(URLs.admin.approvals.success);
      }, 3000);
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
          <p className="text-muted-foreground">Verifying approval link...</p>
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
              <CardTitle>Invalid Approval Link</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push(URLs.home)} className="w-full">
              Go to Home
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
                Redirecting in 3 seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { submission, approvalStage } = data;

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Review Approval Request
                </CardTitle>
                <CardDescription className="mt-2">
                  {approvalStage.stageName}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200"
              >
                <Clock className="h-3 w-3 mr-1" />
                Pending Your Decision
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Approval Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approval Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {approvalStage.currentApprovals} of{" "}
                    {approvalStage.requiredApprovals} approvals
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        (approvalStage.currentApprovals /
                          approvalStage.requiredApprovals) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Form Name</p>
                <p className="font-medium">{submission.formName}</p>
              </div>
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
                  {new Date(submission.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submission ID</p>
                <p className="font-medium text-xs">{submission.id}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Form Data</h3>
              <div className="space-y-3">
                {Object.entries(submission.submissionData).map(
                  ([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <p className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="font-medium">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Comments{" "}
              {!comments && (
                <span className="text-xs text-muted-foreground font-normal">
                  (Optional for approval, required for rejection)
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Provide feedback or reasons for your decision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your comments here..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleReject}
            variant="destructive"
            className="flex-1"
            disabled={state === "submitting"}
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
      </div>
    </div>
  );
}
