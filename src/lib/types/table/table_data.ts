"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

// Generic column definition interface
export interface TableColumn<TData = any> {
  name: string;
  uid: keyof TData | string;
  sortable?: boolean;
  hidden?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
}

// Pagination metadata interface - make it flexible to match your existing Meta type
export interface PaginationMeta {
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
  from?: number;
  to?: number;
  // Allow any additional properties from your existing Meta type
  [key: string]: any;
}

// Custom cell renderer type
export type CellRenderer<TData = any> = (
  value: any,
  row: TData,
  column: TableColumn<TData>
) => React.ReactNode;

// Table configuration interface
export interface DataTableProps<TData> {
  data: TData[];
  columns: TableColumn<TData>[];
  title?: string;
  description?: string;

  // Server-side pagination - use generic meta type
  serverSide?: boolean;
  loading?: boolean;
  meta?: any;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearch?: (search: string) => void;
  onSort?: (field: string, order: "asc" | "desc") => void;

  // Current sort state for server-side sorting
  currentSortField?: string;
  currentSortOrder?: "asc" | "desc";

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
  addButtonWrapper?: (children: React.ReactNode) => React.ReactNode;

  // Custom renderers
  cellRenderers?: Partial<Record<string, CellRenderer<TData>>>;
  additionalButtons?: AdditionalButton[];

  // Styling
  className?: string;
  tableClassName?: string;
}

export interface AdditionalButton {
  // label: The text displayed on the button.
  label: string;

  // icon: The component/reference for the icon.
  icon: LucideIcon;

  // style: The Tailwind CSS classes for styling.
  style?: string;

  // onClick: The function to execute when the button is clicked.
  onClick: React.MouseEventHandler<HTMLButtonElement> | (() => void);

  // permission: The permission required to access the button.
  permission?: string;
  // Button properties
  type?: "button" | "submit" | "reset";
  size?: "default" | "sm" | "md" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}
