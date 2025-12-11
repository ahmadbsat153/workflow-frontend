/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PencilIcon, UserRoundPlusIcon } from "lucide-react";
import { DataTable } from "../../Table/DataTable";
import { ErrorResponse } from "@/lib/types/common";
import { build_path, formatDatesWithYear } from "@/utils/common";
import { handleServerError } from "@/lib/api/_axios";
import { INITIAL_META } from "@/lib/constants/initials";
import { Action, ActionTable } from "@/lib/types/actions/action";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API_ACTION } from "@/lib/services/Actions/action_service";
import { ACTION_COLUMNS, ACTION_VISIBLE_COL } from "@/lib/constants/tables";
import { CellRenderer, AdditionalButton } from "@/lib/types/table/table_data";
import { Button } from "@/lib/ui/button";
import Link from "next/link";
import { getUrl, URLs } from "@/lib/constants/urls";

const ActionsTable = () => {
  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

  const [actions, setActions] = useState<ActionTable>({
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

  const router = useRouter();
  const [visibleColumns] = useState<Set<string>>(new Set(ACTION_VISIBLE_COL));
  const [loading, setLoading] = useState(true);

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return ACTION_COLUMNS;

    return ACTION_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getActions = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_ACTION.getAllActions(request);
      setActions(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    getActions();
  }, [getActions]);

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

  const cellRenderers: Partial<Record<string, CellRenderer<Action>>> = {
    createdAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },

    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },

    actions: (value, row) => {
      return (
        <Button
          variant={"link"}
          size={"icon"}
          className=""
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Link
            href={getUrl(
              build_path(URLs.admin.actions.edit, {
                action_id: row._id,
              })
            )}
          >
            <PencilIcon className="!size-[18px] text-pumpkin" />
          </Link>
        </Button>
      );
    },
  };

  const additionalButtons: AdditionalButton[] = [
    {
      label: "Add Action",
      icon: UserRoundPlusIcon,
      style: "bg-primary text-primary-foreground hover:bg-primary/60",
      onClick: () => {
        router.push(URLs.admin.actions.create);
      },
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <DataTable
          data={actions?.data}
          columns={headerColumns}
          // Server-side configuration
          serverSide={true}
          loading={loading}
          onSort={handleSort}
          meta={actions?.meta}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          // Features
          enableSelection={false}
          enablePagination={true}
          enableSorting={true}
          enableGlobalSearch={true}
          enableColumnVisibility={true}
          onRowClick={(row) => {
            router.push(
              getUrl(
                build_path(URLs.admin.actions.details, {
                  action_id: row._id,
                })
              )
            );
          }}
          // Customization
          searchPlaceholder="Search actions..."
          emptyStateMessage="No actions found."
          // Custom renderers
          cellRenderers={cellRenderers}
          additionalButtons={additionalButtons}
        />
      </div>
    </>
  );
};

export default ActionsTable;
