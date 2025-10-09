/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  FORM_SUBMISSION_COL,
  FORM_SUBMISSION_VISIBLE_COL,
} from "@/lib/constants/tables";
import { API_FORM_SUBMISSION } from "@/lib/services/Form/form_submissions_service";
import {
  FormSubmission,
  FormSubmissionList,
} from "@/lib/types/form/form_submission";
import { useParams, useRouter } from "next/navigation";
import { getUrl, URLs } from "@/lib/constants/urls";
import DotsLoader from "../../Loader/DotsLoader";

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
    meta: INITIAL_META,
  });

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

  const [visibleColumns] = useState<Set<string>>(
    new Set(FORM_SUBMISSION_VISIBLE_COL)
  );
  const [loading, setLoading] = useState(true);

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return FORM_SUBMISSION_COL;

    return FORM_SUBMISSION_COL.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getForms = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_FORM_SUBMISSION.getAllSubmissionsByForm(
        request,
        form_slug
      );
      setForms(res);
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
      setQuery({ limit: size, page: 1 }); // Reset to first page when changing page size
    },
    [setQuery]
  );

  const handleSearch = useCallback(
    (search: string) => {
      setQuery({ search: search || null, page: 1 }); // Reset to first page when searching
    },
    [setQuery]
  );

  const handleSort = useCallback(
    (field: string, order: "asc" | "desc") => {
      setQuery({
        sortField: field,
        sortOrder: order,
        page: 1, // Reset to first page when sorting
      });
    },
    [setQuery]
  );

  const cellRenderers: Partial<Record<string, CellRenderer<FormSubmission>>> = {
    createdAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },

    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },

    submittedBy: (value) => <div className="">{value.email}</div>,
  };

  const handleFormView = (submission: FormSubmission) => {
    router.push(
      getUrl(build_path(URLs.admin.submissions.view, { id: submission._id }))
    );
  };

  if (loading) {
    return <DotsLoader />;
  }

  return (
    <>
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
    </>
  );
};

export default FormsSubmissionsTable;
