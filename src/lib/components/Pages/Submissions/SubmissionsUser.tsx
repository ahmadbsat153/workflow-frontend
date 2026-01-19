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
import { useAuth } from "@/lib/context/AuthContext";
import { WorkflowStatusBadge } from "../../Workflow/WorkflowStatusBadge";

const searchParams = {
  page: parseAsInteger,
  limit: parseAsInteger,
  search: parseAsString,
  sortField: parseAsString,
  sortOrder: parseAsString,
};

const SubmissionsUserTable = () => {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const form_slug = params.slug as string;

  const [forms, setSubmissions] = useState<FormSubmissionList>({
    data: [],
    fields: [],
    meta: INITIAL_META,
  });

  const [query, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(25),
      search: parseAsString,
      sortField: parseAsString, // Remove default to allow clearing
      sortOrder: parseAsString, // Remove default to allow clearing
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
        name: "form name",
        uid: "form.name",
        sortable: true,
      },
      {
        name: "Status",
        uid: "workflowStatus",
        sortable: true,
      },
    ];

    // Add timestamp columns
    const timestampColumns = [
      {
        name: "Submitted At",
        uid: "createdAt",
        sortable: true,
      },
    ];

    return [...baseColumns, ...timestampColumns];
  }, []);

  const getSubmissionsByUser = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_FORM_SUBMISSION.getSubmissionByUser(request);
      console.log(res);
      setSubmissions({
        data: res.data,
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
    getSubmissionsByUser();
  }, [getSubmissionsByUser]);

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
      if (field === "") {
        // Clear the sort
        setQuery({
          sortField: null,
          sortOrder: null,
          page: 1,
        });
      } else {
        setQuery({
          sortField: field,
          sortOrder: order,
          page: 1,
        });
      }
    },
    [setQuery]
  );

  const cellRenderers: Partial<Record<string, CellRenderer<FormSubmission>>> = {
    createdAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },

    "form.name": (value, row) => {
      return <div>{row.form?.name}</div>;
    },
    submittedBy: (_, row) => {
      // We ignore 'value' because it's 'unknown'
      // We use 'row' because we KNOW it is 'FormSubmission'
      return <div>{row.submittedBy?.email}</div>;
    },
    workflowStatus: (value, row) => {
      if (!row.workflowStatus) {
        return (
          <span className="text-muted-foreground text-sm">No workflow</span>
        );
      }
      return <WorkflowStatusBadge status={row.workflowStatus} />;
    },
  };

  const handleFormView = (submission: FormSubmission) => {
    const url = isAdmin
      ? URLs.admin.submissions.view
      : URLs.app.submissions.view;

    router.push(getUrl(build_path(url, { id: submission._id })));
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] w-full flex justify-center items-center ">
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
        // Pass current sort state
        currentSortField={query.sortField || undefined}
        currentSortOrder={query.sortOrder as "asc" | "desc" | undefined}
        // Features
        enableSelection={false}
        enablePagination={true}
        enableSorting={true}
        enableGlobalSearch={true}
        enableColumnVisibility={true}
        onRowClick={(row) => handleFormView(row)}
        // Customization
        searchPlaceholder="Search Submissions..."
        emptyStateMessage="No Submissions found for this user."
        // Custom renderers
        cellRenderers={cellRenderers}
      />
    </div>
  );
};

export default SubmissionsUserTable;
