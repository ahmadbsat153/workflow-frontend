"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import {
  FormSubmission,
  FormSubmissionList,
} from "@/lib/types/form/form_submission";

import { toast } from "sonner";
import { useMemo } from "react";
import { Field } from "@/lib/types/form/fields";
import DotsLoader from "../../Loader/DotsLoader";
import { ErrorResponse } from "@/lib/types/common";
import FormAnalyticsCard from "./FormAnalyticsCard";
import { getUrl, URLs } from "@/lib/constants/urls";
import { handleServerError } from "@/lib/api/_axios";
import { useParams, useRouter } from "next/navigation";
import { INITIAL_META } from "@/lib/constants/initials";
import { useCallback, useEffect, useState } from "react";
import { API_FORM } from "@/lib/services/Form/form_service";
import { DataTable, CellRenderer } from "../../Table/DataTable";
import { build_path, formatDatesWithYear } from "@/utils/common";
import { API_FORM_SUBMISSION } from "@/lib/services/Form/form_submissions_service";

interface FormAnalytics {
  totalSubmissions: number;
  uniqueSubmitters: number;
  recentSubmissions: number;
}

const FormDetailsTab = () => {
  const params = useParams();
  const router = useRouter();
  const form_id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [formSlug, setFormSlug] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [submissions, setSubmissions] = useState<FormSubmissionList>({
    data: [],
    fields: [],
    meta: INITIAL_META,
  });
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

  const [query, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(25),
      search: parseAsString,
      sortField: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("asc"),
    },
    {
      history: "push",
    }
  );

  const getFormDetails = useCallback(async () => {
    if (!form_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const form = await API_FORM.getFormById(form_id);
      setFormSlug(form.slug);

      // Fetch analytics using the slug
      if (form.slug) {
        const analyticsData = await API_FORM.getFormAnalyticsById(form.slug);
        setAnalytics(analyticsData?.analytics);
      }
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [form_id]);

  const getSubmissions = useCallback(async () => {
    if (!formSlug) return;

    try {
      setSubmissionsLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_FORM_SUBMISSION.getAllSubmissionsByForm(
        request,
        formSlug
      );

      setFields(res.fields || []);
      setSubmissions({
        data: res.data,
        fields: res.fields,
        meta: res.meta,
      });
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setSubmissionsLoading(false);
    }
  }, [formSlug, query]);

  useEffect(() => {
    getFormDetails();
  }, [getFormDetails]);

  useEffect(() => {
    if (formSlug) {
      getSubmissions();
    }
  }, [getSubmissions, formSlug]);

  // Create dynamic columns from fields
  const headerColumns = useMemo(() => {
    const baseColumns = [
      {
        name: "Submitted By",
        uid: "submittedBy",
        sortable: true,
      },
    ];

    const fieldColumns = fields.map((field) => ({
      name: field.label,
      uid: field.name,
      sortable: true,
    }));

    const timestampColumns = [
      {
        name: "Submitted At",
        uid: "createdAt",
        sortable: true,
      },
    ];

    return [...baseColumns, ...fieldColumns, ...timestampColumns];
  }, [fields]);

  // Cell renderers
  const cellRenderers: Partial<Record<string, CellRenderer<FormSubmission>>> = {
    createdAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },
    submittedBy: (_, row) => {
      // We ignore 'value' because it's 'unknown'
      // We use 'row' because we KNOW it is 'FormSubmission'
      return <div>{row.submittedBy?.email}</div>;
    },
    ...fields.reduce((acc, field) => {
      acc[field.name] = (value, row) => {
        const fieldValue = row.submissionData?.[field.name] as string;

        if (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === ""
        ) {
          return <span className="text-gray-400 italic">-</span>;
        }

        switch (field.type) {
          case "date":
            return <span>{formatDatesWithYear(fieldValue)}</span>;
          case "checkbox":
            if (!Array.isArray(fieldValue)) {
              return fieldValue ? <span>✓</span> : <span>✗</span>;
            }
            if (fieldValue.length === 0) {
              return (
                <span className="text-gray-400 italic">None selected</span>
              );
            }
            const selectedLabels = fieldValue.map((val) => {
              const option = field.options?.find((opt) => opt.value === val);
              return option?.label || val;
            });
            const displayText = selectedLabels.join(", ");
            if (displayText.length > 50) {
              return (
                <div className="flex items-center gap-1">
                  <span className="truncate max-w-[200px]" title={displayText}>
                    {displayText}
                  </span>
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    ({selectedLabels.length} selected)
                  </span>
                </div>
              );
            }
            return <span>{displayText}</span>;
          case "email":
            return (
              <a
                href={`mailto:${fieldValue}`}
                className="text-blue-600 hover:underline"
              >
                {fieldValue}
              </a>
            );
          default:
            if (typeof fieldValue === "object") {
              return (
                <span className="text-gray-600">
                  {JSON.stringify(fieldValue)}
                </span>
              );
            }
            return <span>{fieldValue}</span>;
        }
      };
      return acc;
    }, {} as Record<string, CellRenderer<FormSubmission>>),
  };

  const handlePageChange = useCallback(
    (page: number) => {
      setQuery({ page });
    },
    [setQuery]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setQuery({ limit: size, page: 1 });
    },
    [setQuery]
  );

  const handleSearch = useCallback(
    (search: string) => {
      setQuery({ search: search || null, page: 1 });
    },
    [setQuery]
  );

  const handleSort = useCallback(
    (field: string, order: "asc" | "desc") => {
      setQuery({
        sortField: field,
        sortOrder: order,
        page: 1,
      });
    },
    [setQuery]
  );

  const handleFormView = (submission: FormSubmission) => {
    router.push(
      getUrl(build_path(URLs.admin.submissions.view, { id: submission._id }))
    );
  };

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  if (!formSlug) {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center">
        <p className="text-gray-500">Form not found</p>
      </div>
    );
  }

  const analyticsCards = [
    {
      title: "Total Submissions",
      count: analytics?.totalSubmissions,
    },
    {
      title: "Unique Submitters",
      count: analytics?.uniqueSubmitters,
    },
    {
      title: "Recent Submissions in 30 days",
      count: analytics?.recentSubmissions,
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto p-4">
      <div className="space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {analyticsCards.map((item, index) => (
            <FormAnalyticsCard
              key={index}
              title={item.title}
              count={item.count}
            />
          ))}
        </div>

        {/* Submissions Table */}
        <div className="mt-6">
          <DataTable
            data={submissions?.data}
            columns={headerColumns}
            serverSide={true}
            loading={submissionsLoading}
            meta={submissions?.meta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            onSort={handleSort}
            enableSelection={false}
            enablePagination={true}
            enableSorting={true}
            enableGlobalSearch={true}
            enableColumnVisibility={true}
            onRowClick={(row) => handleFormView(row)}
            searchPlaceholder="Search Submissions..."
            emptyStateMessage="No Submissions found for this form."
            cellRenderers={cellRenderers}
          />
        </div>
      </div>
    </div>
  );
};

export default FormDetailsTab;
