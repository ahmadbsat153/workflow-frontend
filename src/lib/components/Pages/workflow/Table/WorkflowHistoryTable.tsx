/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { toast } from "sonner";
import { Badge } from "@/lib/ui/badge";
import { ErrorResponse } from "@/lib/types/common";
import { formatDatesWithYear } from "@/utils/common";
import { handleServerError } from "@/lib/api/_axios";
import { INITIAL_META } from "@/lib/constants/initials";
import { CellRenderer } from "@/lib/types/table/table_data";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  WORKFLOW_HISTORY_COLUMNS,
  WORKFLOW_HISTORY_VISIBLE_COL,
} from "@/lib/constants/tables";
import { DataTable } from "@/lib/components/Table/DataTable";
import {
  WorkflowHistory,
  WorkflowHistoryList,
  WorkflowStatus,
} from "@/lib/types/workflow/workflow";
import { API_WORKFLOW_HISTORY } from "@/lib/services/Workflow/workflow_history_service";
import { Form } from "@/lib/types/form/form";
import { User } from "@/lib/types/user/user";
import { SubmittedBy } from "@/lib/types/form/form_submission";
import { WorkflowStatusBadge } from "@/lib/components/Workflow/WorkflowStatusBadge";
import { WorkflowStatus as ApprovalWorkflowStatus } from "@/lib/types/approval";

const WorkflowHistoryTable = () => {
  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

  const [history, setHistory] = useState<WorkflowHistoryList>({
    data: [],
    meta: INITIAL_META,
  });

  const [query, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      search: parseAsString,
      sortField: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("desc"),
    },
    {
      history: "push",
    }
  );

  const [visibleColumns] = useState<Set<string>>(
    new Set(WORKFLOW_HISTORY_VISIBLE_COL)
  );
  const [loading, setLoading] = useState(true);

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return WORKFLOW_HISTORY_COLUMNS;

    return WORKFLOW_HISTORY_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getHistory = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_WORKFLOW_HISTORY.getHistory(request);
      setHistory(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, query]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

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

  const cellRenderers: Partial<Record<string, CellRenderer<WorkflowHistory>>> =
    {
      form: (value) => {
        const form = value as Form; // Manually narrow unknown to Form
        return <span>{form.name}</span>;
      },

      submittedBy: (value) => {
        const user = value as SubmittedBy;
        return <span>{user.name}</span>;
      },

      createdAt: (value) => {
        // Cast value to string (or whatever formatDatesWithYear expects)
        return <span>{formatDatesWithYear(value as string)}</span>;
      },

      updatedAt: (value) => {
        return <span>{formatDatesWithYear(value as string)}</span>;
      },

      workflowCompletedAt: (value) => {
        return <span>{value ? formatDatesWithYear(value as string) : ""}</span>;
      },

      is_active: (value, row) => {
        // Narrowing value to WorkflowStatus
        const status = value as WorkflowStatus;

        const statusMap: Record<WorkflowStatus, ApprovalWorkflowStatus> = {
          [WorkflowStatus.PENDING]: "pending",
          [WorkflowStatus.PROCESSING]: "processing",
          [WorkflowStatus.COMPLETED]: "completed",
          [WorkflowStatus.FAILED]: "failed",
        };

        const mappedStatus = statusMap[status];
        return <WorkflowStatusBadge status={mappedStatus} />;
      },
    };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <DataTable
          data={history?.data}
          columns={headerColumns}
          // Server-side configuration
          serverSide={true}
          loading={loading}
          meta={history?.meta}
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
          // Customization
          searchPlaceholder="Search history..."
          emptyStateMessage="No history found for any submission."
          // Custom renderers
          cellRenderers={cellRenderers}
        />
      </div>
    </>
  );
};

export default WorkflowHistoryTable;
