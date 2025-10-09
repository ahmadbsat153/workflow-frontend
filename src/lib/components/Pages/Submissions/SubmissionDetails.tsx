"use client";

import { handleServerError } from "@/lib/api/_axios";
import { API_FORM_SUBMISSION } from "@/lib/services/Form/form_submissions_service";
import { ErrorResponse } from "@/lib/types/common";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import HeaderContainer from "../../Container/HeaderContainer";
import { FormSubmission } from "@/lib/types/form/form_submission";
import DotsLoader from "../../Loader/DotsLoader";
import { formatDatesWithYear } from "@/utils/common";
import { Button } from "@/lib/ui/button";
import SubmissionDisplay from "./SubmissionDisplay";
import SectionContainer from "../../Container/SectionContainer";

const SubmissionDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [submission, setSubmission] = useState<FormSubmission>();
  const [loading, setLoading] = useState(true);
  const getSubmission = async () => {
    setLoading(true);
    try {
      const res = await API_FORM_SUBMISSION.getSubmissionById(id);

      setSubmission(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleServerError(error as ErrorResponse, (msg) => {
        toast.error(`${msg}`);
      });
    }
  };

  useEffect(() => {
    getSubmission();
  }, []);

  if (loading) {
    return <DotsLoader />;
  }

  if (!submission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Submission Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The submission you're looking for doesn't exist
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }
  return (
    <SectionContainer className="">
      <SubmissionDisplay
        fields={submission.form.fields}
        submissionData={submission.submissionData}
        formName={submission.form.name}
        formDescription={submission.form.description}
        submittedBy={submission.submittedBy}
        createdAt={submission.createdAt}
      />
    </SectionContainer>
  );
};

export default SubmissionDetails;
