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
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Loader2,
} from "lucide-react";
export type TableColumn<TData = Record<string, unknown>> = {
  name: string;
  uid: keyof TData | string;
  sortable?: boolean;
  hidden?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
};

export type CellRenderer<TData = Record<string, unknown>> = (
  value: unknown,
  row: TData,
  column: TableColumn<TData>
) => React.ReactNode;

import { DataTableProps, AdditionalButton } from "@/lib/types/table/table_data";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { Column } from "@tanstack/react-table";

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>;
  title: string;
  align?: "left" | "center" | "right";
  serverSide?: boolean;
  onSort?: (field: string, order: "asc" | "desc") => void;
  field?: string;
  currentSortField?: string;
  currentSortOrder?: "asc" | "desc";
}

function SortableHeader<TData>({
  column,
  title,
  align = "left",
  serverSide,
  onSort,
  field,
  currentSortField,
  currentSortOrder,
}: SortableHeaderProps<TData>) {
  const alignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[align];

  const handleSort = () => {
    if (serverSide && onSort && field) {
      // Check if we're currently sorting by this field
      const isCurrentlySorted = currentSortField === field && currentSortOrder;

      if (isCurrentlySorted) {
        if (currentSortOrder === "asc") {
          // First click: asc -> desc
          onSort(field, "desc");
        } else if (currentSortOrder === "desc") {
          // Second click: desc -> remove sort
          onSort("", "asc");
        }
      } else {
        // Not currently sorted by this field, start with asc
        onSort(field, "asc");
      }
    } else {
      column.toggleSorting(column.getIsSorted() === "asc");
    }
  };

  if (!column.getCanSort()) {
    return (
      <div className={`flex items-center capitalize ${alignClass}`}>
        {title}
      </div>
    );
  }

  // Determine the sort direction for this column
  let sortDirection: "asc" | "desc" | false = false;

  if (serverSide) {
    // For server-side sorting, check if this field is currently sorted
    if (currentSortField === field && currentSortOrder) {
      sortDirection = currentSortOrder as "asc" | "desc";
    }
  } else {
    // For client-side sorting, use TanStack Table's state
    sortDirection = column.getIsSorted();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 p-0 hover:bg-transparent flex items-center has-[>svg]:px-0 capitalize ${alignClass}`}
      onClick={handleSort}
    >
      <span className="capitalize">{title}</span>
      {sortDirection === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : sortDirection === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
}

export function DataTable<TData>({
  data,
  columns: userColumns,
  serverSide = false,
  loading = false,
  meta,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  enableSelection = false,
  enablePagination = true,
  enableColumnVisibility = true,
  enableSorting = true,
  enableGlobalSearch = true,
  pageSize = 10,
  searchPlaceholder = "Search...",
  emptyStateMessage = "No results found.",
  onAddNew,
  addButtonWrapper,
  addNewLabel = "Add Item",
  onRowClick,
  onSelectionChange,
  cellRenderers = {},
  className,
  tableClassName,
  additionalButtons = [],
  currentSortField,
  currentSortOrder,
}: DataTableProps<TData>) {
  const { hasPermission } = usePermissions();
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

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);

    if (serverSide && onSearch) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, 500);
    }
  };

  const columns = React.useMemo(() => {
    const reactTableColumns: ColumnDef<TData>[] = userColumns.map((col) => ({
      id: col.uid as string,
      accessorKey: col.uid as string,
      header: ({ column }) => (
        <SortableHeader
          column={column}
          title={col.name}
          align={col.align}
          serverSide={serverSide}
          onSort={onSort}
          field={col.uid as string}
          currentSortField={currentSortField}
          currentSortOrder={currentSortOrder}
        />
      ),
      cell: ({ getValue, row }) => {
        const value = getValue();
        const renderer =
          cellRenderers[col.uid as string] || ((val) => val?.toString() || "");
        return (
          <div
            className={`truncate max-w-[250px] ${
              col.align === "center"
                ? "text-center"
                : col.align === "right"
                ? "text-right"
                : "text-left"
            }`}
          >
            {renderer(value, row.original, col as TableColumn<TData>)}
          </div>
        );
      },
      enableSorting: enableSorting && col.sortable,
      size: typeof col.width === "number" ? col.width : undefined,
    }));

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
        size: 40,
      };
      return [selectionColumn, ...reactTableColumns];
    }

    return reactTableColumns;
  }, [
    userColumns,
    enableSelection,
    enableSorting,
    cellRenderers,
    serverSide,
    onSort,
    currentSortField,
    currentSortOrder,
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
    getPaginationRowModel: serverSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: serverSide ? undefined : getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: serverSide,
    manualSorting: serverSide,
    manualFiltering: serverSide,
    pageCount: serverSide && meta ? meta.total_pages : undefined,
  });

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  const totalPages =
    serverSide && meta
      ? meta.total_pages || meta.total_pages
      : table.getPageCount();
  const currentPage = serverSide && meta ? meta.page : pagination.pageIndex + 1;
  const totalItems =
    serverSide && meta
      ? meta.count || meta.count
      : table.getFilteredRowModel().rows.length;
  const currentPageSize = serverSide && meta ? meta.limit : pagination.pageSize;

  const handlePageChange = (page: number) => {
    if (serverSide && onPageChange) {
      onPageChange(page);
    } else {
      setPagination((prev) => ({ ...prev, pageIndex: page - 1 }));
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (serverSide && onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      setPagination({ pageIndex: 0, pageSize: size });
    }
  };

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          {enableGlobalSearch && (
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-8 w-full lg:w-[250px]"
              disabled={loading}
            />
          )}

          {enableSelection && (
            <div className="text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {serverSide
                ? totalItems
                : table.getFilteredRowModel().rows.length}{" "}
              row(s) selected.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Column visibility */}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={loading}>
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
            <>
              {addButtonWrapper ? (
                addButtonWrapper(
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onAddNew}
                    disabled={loading}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden lg:inline">{addNewLabel}</span>
                  </Button>
                )
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onAddNew}
                  disabled={loading}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden lg:inline">{addNewLabel}</span>
                </Button>
              )}
            </>
          )}
          {/* Additional Buttons */}
          {additionalButtons?.map(
            (button: AdditionalButton, index: number) =>
              (!button.permission || hasPermission(button.permission)) && (
                <React.Fragment key={index + button.label}>
                  {button.wrapper ? (
                    <button.wrapper>
                      <Button
                        type={button.type || "button"}
                        size={button.size || "sm"}
                        className={`${button.style} flex items-center justify-center transition-all hover:scale-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:bg-opacity-0`}
                        disabled={loading}
                        onClick={(event) => button.onClick(event)}
                      >
                        {button.icon && (
                          <React.Fragment>
                            {React.createElement(button.icon, {
                              className: "size-4",
                            })}
                          </React.Fragment>
                        )}
                        {button.label}
                      </Button>
                    </button.wrapper>
                  ) : (
                    <Button
                      type={button.type || "button"}
                      size={button.size || "sm"}
                      className={`${button.style} flex items-center justify-center transition-all hover:scale-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent disabled:hover:bg-opacity-0`}
                      disabled={loading}
                      onClick={(event) => button.onClick(event)}
                    >
                      {button.icon && (
                        <React.Fragment>
                          {React.createElement(button.icon, {
                            className: "size-4",
                          })}
                        </React.Fragment>
                      )}
                      {button.label}
                    </Button>
                  )}
                </React.Fragment>
              )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border relative">
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        <Table className={tableClassName}>
          <TableHeader className="bg-cultured">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="capitalize !text-secondary"
                  >
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
                    <TableCell key={cell.id} className="">
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
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    emptyStateMessage
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {enableSelection && (
              <>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {totalItems} row(s) selected.
              </>
            )}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${currentPageSize}`}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
                disabled={loading}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={currentPageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(1)}
                disabled={currentPage <= 1 || loading}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage >= totalPages || loading}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
