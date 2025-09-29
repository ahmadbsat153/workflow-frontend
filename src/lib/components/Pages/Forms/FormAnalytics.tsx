"use client";

import { handleServerError } from "@/lib/api/_axios";
import { API_FORM } from "@/lib/services/Form/form_service";
import { ErrorResponse } from "@/lib/types/common";
import { FormDetails } from "@/lib/types/form/form";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import DotsLoader from "../../Loader/DotsLoader";
import FormAnalyticsCard from "./FormAnalyticsCard";

const FormAnalytics = () => {
  const params = useParams();
  const form_slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormDetails | null>(null);
  const getFormId = useCallback(async () => {
    if (!form_slug) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await API_FORM.getFormAnalyticsById(form_slug);
      setForm(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getFormId();
  }, [getFormId]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  const analytics = [
    {
      title: "Total Submissions",
      count: form?.analytics.totalSubmissions,
    },
    {
      title: "Unique Submitters",
      count: form?.analytics.uniqueSubmitters,
    },
    {
      title: "Recent Submissions in 30 days",
      count: form?.analytics.recentSubmissions,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {analytics.map((item, index) => (
        <FormAnalyticsCard key={index} title={item.title} count={item.count} />
      ))}
    </div>
  );
};
export default FormAnalytics;
