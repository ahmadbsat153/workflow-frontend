"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/lib/ui/button";
import { Checkbox } from "@/lib/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/ui/table";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns2Icon,
  PlusIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Generic column definition interface
export interface TableColumn<TData = any> {
  name: string;
  uid: keyof TData | string;
  sortable?: boolean;
  hidden?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
}

// Custom cell renderer type
export type CellRenderer<TData = any> = (
  value: any,
  row: TData,
  column: TableColumn<TData>
) => React.ReactNode;

// Table configuration interface
interface DataTableProps<TData> {
  data: TData[];
  columns: TableColumn<TData>[];
  title?: string;
  description?: string;

  // Feature toggles
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableGlobalSearch?: boolean;

  // Customization
  pageSize?: number;
  searchPlaceholder?: string;
  emptyStateMessage?: string;

  // Actions
  onAddNew?: () => void;
  addNewLabel?: string;
  onRowClick?: (row: TData) => void;
  onSelectionChange?: (selectedRows: TData[]) => void;

  // Custom renderers
  cellRenderers?: Partial<Record<string, CellRenderer<TData>>>;

  // Styling
  className?: string;
  tableClassName?: string;
}

// Sortable header component
const SortableHeader: React.FC<{
  column: any;
  title: string;
  align?: "left" | "center" | "right";
}> = ({ column, title, align = "left" }) => {
  const alignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[align];

  if (!column.getCanSort()) {
    return <div className={`flex items-center ${alignClass}`}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 p-0 hover:bg-transparent flex items-center ${alignClass}`}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

export function DataTable<TData extends Record<string, any>>({
  data,
  columns: userColumns,
  enableSelection = false,
  enablePagination = true,
  enableColumnVisibility = true,
  enableSorting = true,
  enableGlobalSearch = true,
  pageSize = 10,
  searchPlaceholder = "Search...",
  emptyStateMessage = "No results found.",
  onAddNew,
  addNewLabel = "Add Item",
  onRowClick,
  onSelectionChange,
  cellRenderers = {},
  className,
  tableClassName,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() => {
      const initial: VisibilityState = {};
      userColumns.forEach((col) => {
        if (col.hidden) {
          initial[col.uid as string] = false;
        }
      });
      return initial;
    });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Convert user columns to react-table columns
  const columns = React.useMemo(() => {
    const reactTableColumns: ColumnDef<TData>[] = userColumns.map((col) => ({
      id: col.uid as string,
      accessorKey: col.uid as string,
      header: ({ column }) => (
        <SortableHeader column={column} title={col.name} align={col.align} />
      ),
      cell: ({ getValue, row }) => {
        const value = getValue();
        const renderer =
          cellRenderers[col.uid as string] || ((val) => val?.toString() || "");
        return (
          <div
            className={`${
              col.align === "center"
                ? "text-center"
                : col.align === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            {renderer(value, row.original, col as any)}
          </div>
        );
      },
      enableSorting: enableSorting && col.sortable,
      size: typeof col.width === "number" ? col.width : undefined,
    }));

    // Add selection column if enabled
    if (enableSelection) {
      const selectionColumn: ColumnDef<TData> = {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      };
      reactTableColumns.unshift(selectionColumn);
    }

    return reactTableColumns;
  }, [userColumns, enableSelection, enableSorting, cellRenderers]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : [],
      columnVisibility,
      rowSelection: enableSelection ? rowSelection : {},
      columnFilters,
      pagination: enablePagination
        ? pagination
        : { pageIndex: 0, pageSize: data.length },
      globalFilter: enableGlobalSearch ? globalFilter : "",
    },
    enableRowSelection: enableSelection,
    enableSorting,
    onRowSelectionChange: enableSelection ? setRowSelection : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: enablePagination ? setPagination : undefined,
    onGlobalFilterChange: enableGlobalSearch ? setGlobalFilter : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "includesString",
  });

  // Handle selection changes
  React.useEffect(() => {
    if (onSelectionChange && enableSelection) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, enableSelection, table]);

  return (
    <div className={`w-full flex flex-col gap-4 ${className || ""}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Search */}
          {enableGlobalSearch && (
            <div className="max-w-sm">
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="h-8"
              />
            </div>
          )}

          {/* Selection count */}
          {enableSelection && (
            <div className="text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Column visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns2Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">Columns</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {userColumns.find((col) => col.uid === column.id)?.name ||
                        column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Add button */}
          {onAddNew && (
            <Button variant="outline" size="sm" onClick={onAddNew}>
              <PlusIcon className="h-4 w-4" />
              <span className="hidden lg:inline">{addNewLabel}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table className={tableClassName}>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyStateMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {enableSelection && (
              <>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </>
            )}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
