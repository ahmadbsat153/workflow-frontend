"use client";

import { Field } from "@/lib/types/form/fields";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { formatDatesWithYear } from "@/utils/common";
import PageContainer from "@/lib/components/Container/PageContainer";
import { renderSubmittedFieldValue } from "@/utils/fieldUtils";
import { useRouter } from "next/navigation";
import { Button } from "@/lib/ui/button";
import { ChevronLeftIcon, InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import { WorkflowStatus } from "@/lib/types/approval";
import { WorkflowStatusBadge } from "../../Workflow/WorkflowStatusBadge";

export type SubmissionData = {
  [key: string]: string;
};

type SubmissionDisplayProps = {
  fields: Field[];
  submissionData: SubmissionData;
  formName?: string;
  formDescription?: string;
  submittedBy?: {
    _id: string;
    name?: string;
    email: string;
  };
  createdAt?: string;
  workflowStatus?: WorkflowStatus;
  currentStage?: string;
};

const SubmissionDisplay = ({
  fields,
  submissionData,
  formName,
  formDescription,
  submittedBy,
  createdAt,
  workflowStatus,
  currentStage,
}: SubmissionDisplayProps) => {
  const router = useRouter();
  const sortedFields = [...fields].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  console.log(workflowStatus);

  return (
    <PageContainer className="bg-cultured !p-0 flex justify-center overflow-hidden">
      <div className="w-full max-w-3xl flex items-center">
        <Card className="w-full flex flex-col max-h-[90vh]">
          {/* Header Section */}
          <CardHeader className="flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle>{formName}</CardTitle>
              </div>
              {workflowStatus && (
                <WorkflowStatusBadge status={workflowStatus} />
              )}
            </div>
            <CardDescription>
              {formDescription}
              {(submittedBy || createdAt || currentStage) && (
                <div className="flex flex-wrap gap-4 text-sm mt-2">
                  {submittedBy && (
                    <div>
                      <span className="font-medium">Submitted by:</span>{" "}
                      {submittedBy.name || submittedBy.email}
                    </div>
                  )}
                  {createdAt && (
                    <div>
                      <span className="font-medium">Submitted on:</span>{" "}
                      {formatDatesWithYear(createdAt)}
                    </div>
                  )}
                  {currentStage && workflowStatus === "waiting_approval" && (
                    <div>
                      <span className="font-medium">Current Stage:</span>{" "}
                      {currentStage}
                    </div>
                  )}
                </div>
              )}
            </CardDescription>
          </CardHeader>

          {/* Submission Data */}
          <CardContent className="flex-1 overflow-y-auto min-h-0 py-2">
            <div className="flex flex-wrap gap-2">
              {sortedFields.map((field) => {
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

                const value = submissionData[field.name];

                return (
                  <div key={field._id} style={widthStyle}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary flex gap-2">
                        {field.label}
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

          <CardFooter className="border-t flex-shrink-0">
            <div className="w-full flex justify-end">
              <Button
                type="reset"
                variant="secondary"
                className="mr-3"
                onClick={() => router.back()}
              >
                <ChevronLeftIcon /> Go Back
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SubmissionDisplay;
