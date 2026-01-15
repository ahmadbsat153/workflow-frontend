 
 
"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

import { toast } from "sonner";
import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTable } from "../../Table/DataTable";
import { ErrorResponse } from "@/lib/types/common";
import { formatDatesWithYear } from "@/utils/common";
import { handleServerError } from "@/lib/api/_axios";
import { INITIAL_META } from "@/lib/constants/initials";
import { API_APPROVAL } from "@/lib/services/approval_service";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { APPROVAL_COLUMNS, APPROVAL_VISIBLE_COL } from "@/lib/constants/tables";
import { CellRenderer } from "@/lib/types/table/table_data";
import { MyApproval, MyApprovalTable } from "@/lib/types/approval";
import { URLs } from "@/lib/constants/urls";

const ApprovalsTable = () => {
  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString.withDefault("submittedAt"),
    sortOrder: parseAsString.withDefault("desc"),
    status: parseAsStringEnum(["pending", "approved", "rejected"]),
  };

  const [approvals, setApprovals] = useState<MyApprovalTable>({
    data: [],
    meta: INITIAL_META,
  });

  const [query, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(25),
      search: parseAsString,
      sortField: parseAsString.withDefault("submittedAt"),
      sortOrder: parseAsString.withDefault("desc"),
      status: parseAsStringEnum([
        "pending",
        "approved",
        "rejected",
      ]).withDefault("pending"),
    },
    {
      history: "push",
    }
  );

  const router = useRouter();
  const [visibleColumns] = useState<Set<string>>(new Set(APPROVAL_VISIBLE_COL));
  const [loading, setLoading] = useState(true);

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return APPROVAL_COLUMNS;

    return APPROVAL_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getApprovals = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_APPROVAL.getMyApprovals(request);
      setApprovals(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [query, searchParams]);

  useEffect(() => {
    getApprovals();
  }, [getApprovals]);

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
      setQuery({ search: search || undefined, page: 1 });
    },
    [setQuery]
  );

  const handleSort = useCallback(
    (field: string, order: "asc" | "desc") => {
      setQuery({
        sortField: field || undefined,
        sortOrder: field ? order : undefined,
        page: 1,
      });
    },
    [setQuery]
  );

  const handleTabChange = useCallback(
    (value: string) => {
      setQuery({
        status: value as "pending" | "approved" | "rejected",
        page: 1,
      });
    },
    [setQuery]
  );

  const navigateToDetails = (approval: MyApproval) => {
    router.push(
      `${URLs.admin.approvals.details.replace(
        ":submissionId",
        approval.submissionId
      )}`
    );
  };

  const handleQuickApprove = (approval: MyApproval, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(
      `${URLs.admin.approvals.details.replace(
        ":submissionId",
        approval.submissionId
      )}`
    );
  };

  const handleQuickReject = (approval: MyApproval, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(
      `${URLs.admin.approvals.details.replace(
        ":submissionId",
        approval.submissionId
      )}`
    );
  };

  const cellRenderers: Partial<Record<string, CellRenderer<MyApproval>>> = {
    formName: (value, row) => (
      <span
        onClick={() => navigateToDetails(row)}
        className="font-medium cursor-pointer hover:text-primary"
      >
        {value as ReactNode}
      </span>
    ),

    submittedBy: (value, row) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.submittedBy.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.submittedBy.email}
        </span>
      </div>
    ),

    submittedAt: (value) => {
      return <span className="text-sm">{formatDatesWithYear(value as string)}</span>;
    },

    stage: (value, row) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm">{row.stage.stageName}</span>
        <span className="text-xs text-muted-foreground">
          {row.stage.currentApprovals} / {row.stage.requiredApprovals} approvals
        </span>
      </div>
    ),

    overallApprovalStatus: (value) => (
      <div>
        {value === "Pending" && (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        )}
        {value === "Approved" && (
          <Badge variant="active" className="text-xs">
            Approved
          </Badge>
        )}
        {value === "Rejected" && (
          <Badge variant="destructive" className="text-xs">
            Rejected
          </Badge>
        )}
      </div>
    ),

    myDecision: (value, row) => (
      <div>
        {row.myDecision.decision === "Pending" && (
          <Badge variant="outline" className="text-xs">
            No Decision
          </Badge>
        )}
        {row.myDecision.decision === "Approved" && (
          <div className="flex flex-col gap-1">
            <span>
              <CheckCircle2 className="size-4 mr-1 inline-block text-active" />{" "}
              {row.myDecision.comments ? `- ${row.myDecision.comments}` : ""}
            </span>

            {row.myDecision.decidedAt && (
              <span className="text-xs text-muted-foreground">
                {formatDatesWithYear(row.myDecision.decidedAt)}
              </span>
            )}
          </div>
        )}
        {row.myDecision.decision === "Rejected" && (
          <div className="flex flex-col gap-1">
            <span>
              <XCircle className="size-4 mr-1 inline-block text-destructive" />{" "}
              {row.myDecision.comments ? `- ${row.myDecision.comments}` : ""}
            </span>
            {row.myDecision.decidedAt && (
              <span className="text-xs text-muted-foreground">
                {formatDatesWithYear(row.myDecision.decidedAt)}
              </span>
            )}
          </div>
        )}
      </div>
    ),

    actions: (value, row) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateToDetails(row)}
          title="View Details"
        >
          <Eye className="size-4 text-blue-500" />
        </Button>
        {row.myDecision.decision === "Pending" &&
          query.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleQuickApprove(row, e)}
                title="Approve"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircle2 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleQuickReject(row, e)}
                title="Reject"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="size-4" />
              </Button>
            </>
          )}
      </div>
    ),
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Tabs value={query.status} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <DataTable
            data={approvals?.data}
            columns={headerColumns}
            // Server-side configuration
            serverSide={true}
            loading={loading}
            meta={approvals?.meta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            onSort={handleSort}
            currentSortOrder={query.sortOrder as "asc" | "desc"}
            // Features
            enableSelection={false}
            enablePagination={true}
            enableSorting={true}
            enableGlobalSearch={true}
            enableColumnVisibility={true}
            // Customization
            searchPlaceholder="Search pending approvals..."
            emptyStateMessage="No pending approvals found."
            // Custom renderers
            cellRenderers={cellRenderers}
          />
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <DataTable
            data={approvals?.data}
            columns={headerColumns}
            // Server-side configuration
            serverSide={true}
            loading={loading}
            meta={approvals?.meta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            onSort={handleSort}
            currentSortOrder={query.sortOrder as "asc" | "desc"}
            // Features
            enableSelection={false}
            enablePagination={true}
            enableSorting={true}
            enableGlobalSearch={true}
            enableColumnVisibility={true}
            // Customization
            searchPlaceholder="Search approved items..."
            emptyStateMessage="No approved items found."
            // Custom renderers
            cellRenderers={cellRenderers}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <DataTable
            data={approvals?.data}
            columns={headerColumns}
            // Server-side configuration
            serverSide={true}
            loading={loading}
            meta={approvals?.meta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            onSort={handleSort}
            currentSortOrder={query.sortOrder as "asc" | "desc"}
            // Features
            enableSelection={false}
            enablePagination={true}
            enableSorting={true}
            enableGlobalSearch={true}
            enableColumnVisibility={true}
            // Customization
            searchPlaceholder="Search rejected items..."
            emptyStateMessage="No rejected items found."
            // Custom renderers
            cellRenderers={cellRenderers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalsTable;
