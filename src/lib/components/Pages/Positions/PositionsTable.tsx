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
import { Position, PositionTable } from "@/lib/types/position/position";
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { POSITION_COLUMNS, POSITION_VISIBLE_COL } from "@/lib/constants/tables";
import { CellRenderer, AdditionalButton } from "@/lib/types/table/table_data";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { DepartmentOption } from "@/lib/types/department/department";
import { URLs } from "@/lib/constants/urls";

const PositionsTable = () => {
  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
    departmentId: parseAsString,
  };

  const [positions, setPositions] = useState<PositionTable>({
    data: [],
    meta: INITIAL_META,
  });

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const [query, setQuery] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(25),
      search: parseAsString,
      sortField: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("asc"),
      departmentId: parseAsString,
    },
    { history: "push" }
  );

  const router = useRouter();
  const [visibleColumns] = useState<Set<string>>(new Set(POSITION_VISIBLE_COL));
  const [loading, setLoading] = useState(true);

  const headerColumns = useMemo(() => {
    return POSITION_COLUMNS.filter((column) =>
      Array.from(visibleColumns as unknown as Set<string>).includes(column.uid)
    );
  }, [visibleColumns]);

  // Load departments for filter
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await API_DEPARTMENT.getActiveDepartments();
        setDepartments(res.data);
      } catch (error) {
        handleServerError(error as ErrorResponse, (msg) => {
          toast.error(`Failed to load departments: ${msg}`);
        });
      }
    };
    loadDepartments();
  }, []);

  const getPositions = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_POSITION.getAllPositions(request);
      setPositions(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [searchParams, query]);

  useEffect(() => {
    getPositions();
  }, [getPositions]);

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

  const handleDepartmentFilter = (value: string) => {
    setQuery({
      departmentId: value === "all" ? null : value,
      page: 1,
    });
  };

  const cellRenderers: Partial<Record<string, CellRenderer<Position>>> = {
    name: (value, row) => (
      <span
        onClick={() =>
          router.push(`${URLs.admin.positions.edit.replace(":id", row._id)}`)
        }
        className="font-medium cursor-pointer hover:text-blue-600"
      >
        {value as string}
      </span>
    ),
    department: (value, row) => (
      <span className="text-sm">{row.departmentId?.name || "-"}</span>
    ),
    level: (value) => (
      <span className="text-sm text-muted-foreground">
        {(value as string) || "-"}
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
          router.push(`${URLs.admin.positions.edit.replace(":id", row._id)}`)
        }
      >
        <PencilIcon className="size-4 text-blue-500" />
      </Button>
    ),
  };

  const additionalButtons: AdditionalButton[] = [
    {
      label: "Add Position",
      icon: PlusIcon,
      style: "bg-primary text-primary-foreground hover:bg-primary/60",
      onClick: () => {
        router.push(URLs.admin.positions.create);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Department Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Filter by Department:</label>
        <Select
          value={query.departmentId || "all"}
          onValueChange={handleDepartmentFilter}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept._id} value={dept._id}>
                {dept.name} ({dept.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={positions?.data}
        columns={headerColumns}
        serverSide={true}
        loading={loading}
        meta={positions?.meta}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onSort={handleSort}
        enableSelection={false}
        enablePagination={true}
        enableSorting={true}
        enableGlobalSearch={true}
        enableColumnVisibility={true}
        searchPlaceholder="Search positions..."
        emptyStateMessage="No positions found."
        cellRenderers={cellRenderers}
        additionalButtons={additionalButtons}
      />
    </div>
  );
};

export default PositionsTable;
