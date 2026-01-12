"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { toast } from "sonner";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { build_path, formatDatesWithYear } from "@/utils/common";
import { INITIAL_META } from "@/lib/constants/initials";
import { CellRenderer, DataTable } from "../../Table/DataTable";
import { API_FORM_SUBMISSION } from "@/lib/services/Form/form_submissions_service";
import {
  FormSubmission,
  FormSubmissionList,
} from "@/lib/types/form/form_submission";
import { useParams, useRouter } from "next/navigation";
import { getUrl, URLs } from "@/lib/constants/urls";
import DotsLoader from "../../Loader/DotsLoader";
import { Field } from "@/lib/types/form/fields";

const FormsSubmissionsTable = () => {
  const params = useParams();
  const router = useRouter();
  const form_slug = params.slug as string;

  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

  const [forms, setForms] = useState<FormSubmissionList>({
    data: [],
    fields: [],
    meta: INITIAL_META,
  });

  const [fields, setFields] = useState<Field[]>([]);

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

  const [loading, setLoading] = useState(true);

  // Create dynamic columns from fields
  const headerColumns = useMemo(() => {
    const baseColumns = [
      {
        name: "Submitted By",
        uid: "submittedBy",
        sortable: true,
      },
    ];

    // Add dynamic field columns
    const fieldColumns = fields.map((field) => ({
      name: field.label,
      uid: field.name,
      sortable: true,
    }));

    // Add timestamp columns
    const timestampColumns = [
      {
        name: "Submitted At",
        uid: "createdAt",
        sortable: true,
      },
    ];

    return [...baseColumns, ...fieldColumns, ...timestampColumns];
  }, [fields]);

  const getForms = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_FORM_SUBMISSION.getAllSubmissionsByForm(
        request,
        form_slug
      );

      // Extract fields and submissions
      setFields(res.fields || []);
      setForms({
        data: res.data,
        fields: res.fields,
        meta: res.meta,
      });
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [query, form_slug]);

  useEffect(() => {
    getForms();
  }, [getForms]);

  // Server-side pagination handlers
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

  const cellRenderers: Partial<Record<string, CellRenderer<FormSubmission>>> = {
    createdAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },

    submittedBy: (value) => <div>{value.email}</div>,

    // Dynamically handle all field columns
    ...fields.reduce((acc, field) => {
      acc[field.name] = (value, row) => {
        const fieldValue = row.submissionData?.[field.name];

        if (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === ""
        ) {
          return <span className="text-gray-400 italic">-</span>;
        }

        // Handle different field types
        switch (field.type) {
          case "date":
            return <span>{formatDatesWithYear(fieldValue)}</span>;
          case "checkbox":
            if (!Array.isArray(fieldValue)) {
              // Single boolean checkbox (like "I agree")
              return fieldValue ? <span>✓</span> : <span>✗</span>;
            }

            // Multiple checkbox values
            if (fieldValue.length === 0) {
              return (
                <span className="text-gray-400 italic">None selected</span>
              );
            }

            // Get the labels for selected values
            const selectedLabels = fieldValue.map((val) => {
              const option = field.options?.find((opt) => opt.value === val);
              return option?.label || val;
            });

            // Join all values
            const displayText = selectedLabels.join(", ");

            // Truncate if too long
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
            // Handle objects and arrays by converting to string
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

  const handleFormView = (submission: FormSubmission) => {
    router.push(
      getUrl(build_path(URLs.admin.submissions.view, { id: submission._id }))
    );
  };

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center ">
        <DotsLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full mt-5">
      <DataTable
        data={forms?.data}
        columns={headerColumns}
        // Server-side configuration
        serverSide={true}
        loading={loading}
        meta={forms?.meta}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onSort={handleSort}
        // Features
        enableSelection={false}
        enablePagination={true}
        enableSorting={true}
        enableGlobalSearch={true}
        enableColumnVisibility={true}
        onRowClick={(row) => handleFormView(row)}
        // Customization
        searchPlaceholder="Search Submissions..."
        emptyStateMessage="No Submissions found for this form."
        // Custom renderers
        cellRenderers={cellRenderers}
      />
    </div>
  );
};

export default FormsSubmissionsTable;
