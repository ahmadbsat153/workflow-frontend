"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Meta } from "../common";

export interface TableColumn<TData = unknown> {
  name: string;
  uid: keyof TData | string;
  sortable?: boolean;
  hidden?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface PaginationMeta {
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
  from?: number;
  to?: number;
  [key: string]: unknown;
}

export type CellRenderer<TData = unknown> = (
  value: unknown,
  row: TData,
  column: TableColumn<TData>
) => React.ReactNode;

export interface DataTableProps<TData> {
  data: TData[];
  columns: TableColumn<TData>[];
  title?: string;
  description?: string;

  serverSide?: boolean;
  loading?: boolean;
  meta?: Meta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearch?: (search: string) => void;
  onSort?: (field: string, order: "asc" | "desc") => void;

  currentSortField?: string;
  currentSortOrder?: "asc" | "desc";

  enableSelection?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableGlobalSearch?: boolean;

  pageSize?: number;
  searchPlaceholder?: string;
  defaultSearchValue?: string;
  emptyStateMessage?: string;

  onAddNew?: () => void;
  addNewLabel?: string;
  onRowClick?: (row: TData) => void;
  onSelectionChange?: (selectedRows: TData[]) => void;
  addButtonWrapper?: (children: React.ReactNode) => React.ReactNode;

  cellRenderers?: Partial<Record<string, CellRenderer<TData>>>;
  additionalButtons?: AdditionalButton[];

  className?: string;
  tableClassName?: string;
  maxHeight?: string;
}

export interface AdditionalButton {
  label: string;

  icon: LucideIcon;

  style?: string;

  onClick: React.MouseEventHandler<HTMLButtonElement> | (() => void);

  permission?: string;

  type?: "button" | "submit" | "reset";

  size?: "default" | "sm" | "md" | "lg" | "icon";

  wrapper?: React.ComponentType<{ children: React.ReactNode }>;

  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}
