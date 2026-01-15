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
import { Button } from "@/lib/ui/button";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ErrorResponse } from "@/lib/types/common";
import { getUrl, URLs } from "@/lib/constants/urls";
import { useAuth } from "@/lib/context/AuthContext";
import { handleServerError } from "@/lib/api/_axios";
import { Form, FormList } from "@/lib/types/form/form";
import { INITIAL_META } from "@/lib/constants/initials";
import { API_FORM } from "@/lib/services/Form/form_service";
import { CellRenderer, DataTable } from "../../Table/DataTable";
import { build_path, formatDatesWithYear } from "@/utils/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FORM_COLUMNS, FORM_VISIBLE_COL } from "@/lib/constants/tables";
import Link from "next/link";

const FormsTable = () => {
  const router = useRouter();
  const { isAdmin } = useAuth();

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
  }, [searchParams, query]);

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
    name: (value) => <span className="font-medium">{value as string}</span>,
    createdAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
    },

    updatedAt: (value) => {
      return <span>{formatDatesWithYear(value as string)}</span>;
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

    //TODO: Fix edit overlay link
    actions: (value, row) => (
      <Button
        variant="ghost"
        size="sm"
        asChild
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          href={getUrl(
            build_path(URLs.admin.forms.edit, {
              id: row._id,
            })
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <PencilIcon className="size-4 text-pumpkin" />
        </Link>
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
          onRowClick={(row) => {
            const admin_url = getUrl(
              build_path(URLs.admin.forms.detail, { slug: row.slug })
            );

            const user_url = getUrl(
              build_path(URLs.app.submissions.submit, {
                form_slug: row.slug,
              })
            );

            const url = isAdmin ? admin_url : user_url;
            router.push(url);
          }}
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
