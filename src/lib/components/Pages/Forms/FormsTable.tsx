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
import { handleServerError } from "@/lib/api/_axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDatesWithYear } from "@/utils/common";
import { INITIAL_META } from "@/lib/constants/initials";
import { CellRenderer, DataTable } from "../../Table/DataTable";
import { FORM_COLUMNS, FORM_VISIBLE_COL } from "@/lib/constants/tables";
import { Button } from "@/lib/ui/button";
import { PencilIcon } from "lucide-react";
import { Form, FormList } from "@/lib/types/form/form";
import { API_FORM } from "@/lib/services/Form/form_service";

const FormsTable = () => {
  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

  const [forms, setForms] = useState<FormList>({
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

  const [visibleColumns] = useState<Set<string>>(new Set(FORM_VISIBLE_COL));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headerColumns = useMemo(() => {
    if (typeof visibleColumns === "string" && visibleColumns === "all")
      return FORM_COLUMNS;

    return FORM_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getForms = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_FORM.getAllForms(request);
      setForms(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
        setError(err_msg as string);
      });
    } finally {
      setLoading(false);
    }
  }, [query]);

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

  const cellRenderers: Partial<Record<string, CellRenderer<Form>>> = {
    createdAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },

    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value)}</span>;
    },

    isActive: (value) => (
      <div className="">
        {value ? (
          <Badge variant="active">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </div>
    ),

    actions: (value, row) => (
      <Button variant="ghost" size="sm">
        <PencilIcon className="size-4 text-blue-500" />
      </Button>
    ),
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
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
          // Customization
          searchPlaceholder="Search forms..."
          emptyStateMessage="No forms found."
          // Custom renderers
          cellRenderers={cellRenderers}
        />
      </div>
    </>
  );
};

export default FormsTable;
