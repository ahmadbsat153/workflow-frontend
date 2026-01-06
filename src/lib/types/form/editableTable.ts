/**
 * Editable Table Types - Matches Backend Schema Exactly
 * Backend: src/schemas/editableTable.ts
 */

export interface TableCell {
  value: any;
  editable: boolean;
  dataType: "text" | "number" | "date" | "select" | "checkbox";
  options?: Array<{ label: string; value: string }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  style?: {
    textAlign?: "left" | "center" | "right";
    fontWeight?: "normal" | "bold";
    backgroundColor?: string;
    textColor?: string;
  };
}

export interface TableRow {
  rowId: string;
  cells: TableCell[];
  isHeader?: boolean;
  isFooter?: boolean;
  readonly?: boolean;
}

export interface TableColumn {
  columnId: string;
  header: string;
  width?: string;
  dataType: "text" | "number" | "date" | "select" | "checkbox";
  editable: boolean;
}

export interface EditableTableConfig {
  columns: TableColumn[];
  rows: TableRow[];
  settings?: {
    allowAddRows?: boolean;
    allowDeleteRows?: boolean;
    minRows?: number;
    maxRows?: number;
    showBorders?: boolean;
    alternateRowColors?: boolean;
    stickyHeader?: boolean;
  };
  tableStyle?: {
    width?: string;
    borderColor?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
  };
}

export interface CellValidationError {
  rowId: string;
  cellIndex: number;
  message: string;
}
