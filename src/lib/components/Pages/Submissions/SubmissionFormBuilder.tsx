"use client";

import { toast } from "sonner";
import { Button } from "@/lib/ui/button";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Form } from "@/lib/types/form/form";
import DotsLoader from "../../Loader/DotsLoader";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import PageContainer from "../../Container/PageContainer";
import { renderFormFieldSubmission } from "@/utils/fieldUtils";
import { API_FORM } from "@/lib/services/Form/form_service";
import { buildValidationSchema } from "@/utils/Validation/fieldValidationSchema";
import { Card, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";
import { FieldsType } from "@/lib/types/form/fields";

const SubmissionFormBuilder = () => {
  const params = useParams();
  const router = useRouter();
  const form_slug = params.form_slug as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Form | null>(null);

  const getForm = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API_FORM.getFormBySlug(form_slug);
      setForm(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [form_slug]);

  useEffect(() => {
    getForm();
  }, [getForm]);

  // IMPORTANT: Please check "buildValidationSchema" for the JSDoc
  const schema = useMemo(() => {
    return form ? buildValidationSchema(form.fields) : null;
  }, [form]);

  const defaultValues = useMemo(() => {
    if (!form) return {};

    return form.fields.reduce((acc, field) => {
      if (field.type === FieldsType.CHECKBOX) {
        acc[field.name] =
          field.defaultValue === true || field.defaultValue === "true";
      } else if (field.type === FieldsType.NUMBER) {
        acc[field.name] = field.defaultValue ? Number(field.defaultValue) : "";
      } else if (
        field.type === FieldsType.SELECT ||
        field.type === FieldsType.RADIO
      ) {
        acc[field.name] = field.defaultValue || undefined;
      } else {
        acc[field.name] = field.defaultValue || "";
      }
      return acc;
    }, {} as Record<string, any>);
  }, [form]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  useEffect(() => {
    if (form && defaultValues && Object.keys(defaultValues).length > 0) {
      reset(defaultValues, { keepDefaultValues: true });
    }
  }, [form, defaultValues, reset]);

  const onSubmit = async (data: any) => {
    if (!form) return;
    try {
      setSubmitting(true);

      const SubmissionData = {
        formId: form._id,
        submissionData: data,
      };

      const res = await API_FORM.submitForm(SubmissionData);
      toast.success("Form submitted successfully!");
      reset();
      router.back();
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  if (!form) {
    return (
      <PageContainer>
        <Card>
          <CardHeader>
            <CardTitle>Form not found</CardTitle>
            <CardDescription>
              The form you are looking for does not exist.
            </CardDescription>
          </CardHeader>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{form.name}</CardTitle>
            <CardDescription>{form.description}</CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-5 mt-5 flex-wrap">
          {form.fields.map((field) => {
            const widthStyle = field.style?.width
              ? { width: `${field.style.width}%` }
              : { width: "100%" };

            const fieldError = errors[field.name] as any;

            return (
              <div key={field._id} style={widthStyle}>
                {renderFormFieldSubmission(field, control, fieldError)}
              </div>
            );
          })}
        </div>

        <div className="mt-8 w-full flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default SubmissionFormBuilder;
