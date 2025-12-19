"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card";
import { Button } from "@/lib/ui/button";
import { CheckCircle2, XCircle, Home } from "lucide-react";
import { URLs } from "@/lib/constants/urls";

export default function ApprovalSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const decision = searchParams.get("decision") || "approved";

  const isApproved = decision === "approved";

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className={`flex items-center gap-3 ${isApproved ? "text-green-600" : "text-red-600"}`}>
            {isApproved ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <XCircle className="h-8 w-8" />
            )}
            <CardTitle className="text-2xl">
              {isApproved ? "Approval Recorded" : "Rejection Recorded"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg ${isApproved ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <h3 className="font-semibold text-lg mb-2">
              {isApproved ? "✓ Thank You!" : "✗ Decision Recorded"}
            </h3>
            <p className="text-muted-foreground">
              {isApproved
                ? "Your approval has been recorded successfully. The workflow will continue to the next step."
                : "Your rejection has been recorded successfully. The submission workflow has been stopped."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">What happens next?</p>
                <p className="text-sm text-muted-foreground">
                  {isApproved
                    ? "The submitter has been notified of your decision. If all required approvals are met, the workflow will proceed automatically."
                    : "The submitter has been notified of your decision. They may choose to resubmit with corrections."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-medium">Email confirmation</p>
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to your email address with the details of your decision.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={() =>  router.push(URLs.home)} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
