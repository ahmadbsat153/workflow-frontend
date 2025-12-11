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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
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

  const schema = useMemo(() => {
    return form ? buildValidationSchema(form.fields) : null;
  }, [form]);

  const defaultValues = useMemo(() => {
    if (!form) return {};

    return form.fields.reduce((acc, field) => {
      if (field.type === FieldsType.NUMBER) {
        acc[field.name] = field.defaultValue ? Number(field.defaultValue) : "";
      } else if (field.type === FieldsType.SWITCH) {
        acc[field.name] =
          field.defaultValue === "true" || field.defaultValue === true || false;
      } else if (field.type === FieldsType.CHECKBOX) {
        if (field.options && field.options.length > 0) {
          acc[field.name] = field.defaultValue
            ? Array.isArray(field.defaultValue)
              ? field.defaultValue
              : [field.defaultValue]
            : [];
        } else {
          acc[field.name] =
            field.defaultValue === "true" ||
            field.defaultValue === true ||
            false;
        }
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

      const hasFileFields = form.fields.some(
        (field) => field.type === FieldsType.FILE
      );

      if (hasFileFields) {
        const formData = new FormData();
        formData.append("formId", form._id);

        const nonFileData: any = {};

        form.fields.forEach((field) => {
          const value = data[field.name];

          if (field.type === FieldsType.FILE) {
            if (value instanceof FileList && value.length > 0) {
              Array.from(value).forEach((file) => {
                formData.append(field.name, file);
              });
            }
          } else {
            if (value !== undefined && value !== null) {
              nonFileData[field.name] = value;
            }
          }
        });

        formData.append("submissionData", JSON.stringify(nonFileData));

        console.log("Sending FormData with:");
        console.log("- formId:", form._id);
        console.log(
          "- File fields:",
          form.fields
            .filter((f) => f.type === FieldsType.FILE)
            .map((f) => f.name)
        );
        console.log("- Non-file fields:", Object.keys(nonFileData));

        const res = await API_FORM.submitFormWithFiles(formData);
        toast.success("Form submitted successfully!");
      } else {
        const SubmissionData = {
          formId: form._id,
          submissionData: data,
        };

        const res = await API_FORM.submitForm(SubmissionData);
        toast.success("Form submitted successfully!");
      }

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
    <PageContainer className="bg-cultured !p-0 flex justify-center overflow-hidden">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl flex items-center"
      >
        <Card className="w-full flex flex-col h-[90vh]">
          <CardHeader className="flex-shrink-0">
            <CardTitle>{form.name}</CardTitle>
            <CardDescription>{form.description}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto min-h-0 py-2 [&_textarea]:resize-y [&_textarea]:max-h-[200px]">
            <div className="flex flex-wrap gap-5">
              {form.fields.map((field) => {
                const widthStyle = field.style?.width
                  ? { width: `calc(${field.style.width}% - 1.25rem)` }
                  : { width: "100%" };

                const fieldError = errors[field.name] as any;

                return (
                  <div key={field._id} style={widthStyle}>
                    {renderFormFieldSubmission(field, control, fieldError)}
                  </div>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="border-t flex-shrink-0">
            <div className="w-full flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  );
};

export default SubmissionFormBuilder;
