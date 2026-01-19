"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PencilIcon, PlusIcon } from "lucide-react";
import { DataTable } from "../../Table/DataTable";
import { ErrorResponse } from "@/lib/types/common";
import { formatDatesWithYear } from "@/utils/common";
import { handleServerError } from "@/lib/api/_axios";
import { INITIAL_META } from "@/lib/constants/initials";
import { Department, DepartmentTable } from "@/lib/types/department/department";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import {
  DEPARTMENT_COLUMNS,
  DEPARTMENT_VISIBLE_COL,
} from "@/lib/constants/tables";
import { CellRenderer, AdditionalButton } from "@/lib/types/table/table_data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";
import { URLs } from "@/lib/constants/urls";

const searchParams = {
  page: parseAsInteger,
  limit: parseAsInteger,
  search: parseAsString,
  sortField: parseAsString,
  sortOrder: parseAsString,
};

const DepartmentsTable = () => {
  const [departments, setDepartments] = useState<DepartmentTable>({
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
    { history: "push" }
  );

  const router = useRouter();
  const [visibleColumns] = useState<Set<string>>(
    new Set(DEPARTMENT_VISIBLE_COL)
  );
  const [loading, setLoading] = useState(true);

  const headerColumns = useMemo(() => {
    return DEPARTMENT_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  const getDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_DEPARTMENT.getAllDepartments(request);
      setDepartments(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

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

  const cellRenderers: Partial<Record<string, CellRenderer<Department>>> = {
    name: (value, row) => (
      <span
        onClick={() =>
          router.push(`${URLs.admin.departments.edit.replace(":id", row._id)}`)
        }
        className="font-medium cursor-pointer hover:text-blue-600"
      >
        {value as string}
      </span>
    ),
    parent: (value, row) => (
      <span className="text-sm text-muted-foreground">
        {row.parent?.name || "-"}
      </span>
    ),
    createdAt: (value) => <span>{formatDatesWithYear(value as string)}</span>,
    updatedAt: (value) => <span>{formatDatesWithYear(value as string)}</span>,
    isActive: (value) => (
      <Badge variant={value ? "active" : "destructive"}>
        {value ? "Active" : "Inactive"}
      </Badge>
    ),
    actions: (value, row) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          router.push(`${URLs.admin.departments.edit.replace(":id", row._id)}`)
        }
      >
        <PencilIcon className="size-4 text-blue-500" />
      </Button>
    ),
  };

  const additionalButtons: AdditionalButton[] = [
    {
      label: "Add Department",
      icon: PlusIcon,
      style: "bg-primary text-primary-foreground hover:bg-primary/60",
      onClick: () => {
        router.push(URLs.admin.departments.create);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      <DataTable
        data={departments?.data}
        columns={headerColumns}
        serverSide={true}
        loading={loading}
        meta={departments?.meta}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onSort={handleSort}
        enableSelection={false}
        enablePagination={true}
        enableSorting={true}
        enableGlobalSearch={true}
        enableColumnVisibility={true}
        searchPlaceholder="Search departments..."
        emptyStateMessage="No departments found."
        cellRenderers={cellRenderers}
        additionalButtons={additionalButtons}
      />
    </div>
  );
};

export default DepartmentsTable;
