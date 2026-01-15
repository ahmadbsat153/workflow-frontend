"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/lib/ui/input";
import { Checkbox } from "@/lib/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { Button } from "@/lib/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  EditableTableConfig,
  TableCell,
  TableRow,
  CellValidationError,
} from "@/lib/types/form/editableTable";

interface EditableTableFieldProps {
  config: EditableTableConfig;
  value?: EditableTableConfig;
  onChange?: (config: EditableTableConfig) => void;
  disabled?: boolean;
}

/**
 * EditableTableField - Matches backend schema exactly
 * Renders a table with cell-level editability control
 */
const EditableTableField: React.FC<EditableTableFieldProps> = ({
  config,
  value,
  onChange,
  disabled = false,
}) => {
  const [tableConfig, setTableConfig] = useState<EditableTableConfig>(
    value || config
  );
  const [validationErrors, setValidationErrors] = useState<
    CellValidationError[]
  >([]);

  // Only sync on initial mount - don't reset on every value change
  useEffect(() => {
    if (value && !tableConfig) {
      setTableConfig(value);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Validate a single cell
  const validateCell = (cell: TableCell): string | null => {
    if (!cell.editable || !cell.validation) return null;

    const val = cell.value;
    const validation = cell.validation;

    // Required validation
    if (
      validation.required &&
      (val === null || val === undefined || val === "")
    ) {
      return "This field is required";
    }

    // Number validations
    if (
      cell.dataType === "number" &&
      val !== null &&
      val !== undefined &&
      val !== ""
    ) {
      const numVal = Number(val);
      if (isNaN(numVal)) {
        return "Must be a valid number";
      }
      if (validation.min !== undefined && numVal < validation.min) {
        return `Must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && numVal > validation.max) {
        return `Must be at most ${validation.max}`;
      }
    }

    // Text validations
    if (cell.dataType === "text" && val) {
      const strVal = String(val);
      if (
        validation.minLength !== undefined &&
        strVal.length < validation.minLength
      ) {
        return `Must be at least ${validation.minLength} characters`;
      }
      if (
        validation.maxLength !== undefined &&
        strVal.length > validation.maxLength
      ) {
        return `Must be at most ${validation.maxLength} characters`;
      }
      if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(strVal)) {
          return "Invalid format";
        }
      }
    }

    return null;
  };

  // Validate all cells
  const validateTable = (
    config: EditableTableConfig
  ): CellValidationError[] => {
    const errors: CellValidationError[] = [];

    config.rows.forEach((row) => {
      row.cells.forEach((cell, cellIndex) => {
        const error = validateCell(cell);
        if (error) {
          errors.push({
            rowId: row.rowId,
            cellIndex,
            message: error,
          });
        }
      });
    });

    return errors;
  };

  // Update cell value
  const updateCellValue = (rowId: string, cellIndex: number, newValue: string | number | boolean | null) => {
    const newConfig = { ...tableConfig };
    const rowIndex = newConfig.rows.findIndex((r) => r.rowId === rowId);

    if (rowIndex === -1) return;

    newConfig.rows[rowIndex] = {
      ...newConfig.rows[rowIndex],
      cells: [...newConfig.rows[rowIndex].cells],
    };
    newConfig.rows[rowIndex].cells[cellIndex] = {
      ...newConfig.rows[rowIndex].cells[cellIndex],
      value: newValue,
    };

    setTableConfig(newConfig);

    // Validate
    const errors = validateTable(newConfig);
    setValidationErrors(errors);

    // Notify parent
    if (onChange) {
      onChange(newConfig);
    }
  };

  // Add new row
  const addRow = () => {
    if (!tableConfig.settings?.allowAddRows) return;

    const maxRows = tableConfig.settings.maxRows;
    if (maxRows && tableConfig.rows.length >= maxRows) return;

    const newRow: TableRow = {
      rowId: `row_${Date.now()}`,
      cells: tableConfig.columns.map((col) => ({
        value: col.dataType === "checkbox" ? false : "",
        editable: col.editable,
        dataType: col.dataType,
        options: col.dataType === "select" ? [] : undefined,
      })),
    };

    const newConfig = {
      ...tableConfig,
      rows: [...tableConfig.rows, newRow],
    };

    setTableConfig(newConfig);
    if (onChange) {
      onChange(newConfig);
    }
  };

  // Delete row
  const deleteRow = (rowId: string) => {
    if (!tableConfig.settings?.allowDeleteRows) return;

    const minRows = tableConfig.settings.minRows || 0;
    if (tableConfig.rows.length <= minRows) return;

    const newConfig = {
      ...tableConfig,
      rows: tableConfig.rows.filter((r) => r.rowId !== rowId),
    };

    setTableConfig(newConfig);
    if (onChange) {
      onChange(newConfig);
    }
  };

  // Get cell validation error
  const getCellError = (
    rowId: string,
    cellIndex: number
  ): string | undefined => {
    const error = validationErrors.find(
      (e) => e.rowId === rowId && e.cellIndex === cellIndex
    );
    return error?.message;
  };

  // Render cell input
  const renderCellInput = (
    cell: TableCell,
    rowId: string,
    cellIndex: number,
    isReadonly: boolean
  ) => {
    const cellError = getCellError(rowId, cellIndex);
    const isDisabled = disabled || !cell.editable || isReadonly;

    if (!cell.editable || isReadonly) {
      // Non-editable cell - render as text
      let displayValue = cell.value;
      if (cell.dataType === "checkbox") {
        displayValue = cell.value ? "✓" : "";
      } else if (cell.dataType === "select" && cell.options) {
        const option = cell.options.find((o) => o.value === cell.value);
        displayValue = option?.label || cell.value;
      }

      return (
        <div
          style={{
            textAlign: cell.style?.textAlign || "left",
            fontWeight: cell.style?.fontWeight || "normal",
            color: cell.style?.textColor,
          }}
        >
          {displayValue}
        </div>
      );
    }

    // Editable cell - render appropriate input
    const commonProps = {
      disabled: isDisabled,
      className: cellError ? "border-red-500" : "",
    };

    // Helper to get string value for inputs
    const getStringValue = (val: string | number | boolean | null): string => {
      if (val === null || val === undefined) return "";
      if (typeof val === "boolean") return "";
      return String(val);
    };

    switch (cell.dataType) {
      case "text":
        return (
          <div>
            <Input
              type="text"
              value={getStringValue(cell.value)}
              onChange={(e) =>
                updateCellValue(rowId, cellIndex, e.target.value)
              }
              required={cell.validation?.required}
              minLength={cell.validation?.minLength}
              maxLength={cell.validation?.maxLength}
              {...commonProps}
            />
            {cellError && (
              <div className="text-xs text-red-500 mt-1">{cellError}</div>
            )}
          </div>
        );

      case "number":
        return (
          <div>
            <Input
              type="number"
              value={getStringValue(cell.value)}
              onChange={(e) =>
                updateCellValue(rowId, cellIndex, e.target.value)
              }
              required={cell.validation?.required}
              min={cell.validation?.min}
              max={cell.validation?.max}
              {...commonProps}
            />
            {cellError && (
              <div className="text-xs text-red-500 mt-1">{cellError}</div>
            )}
          </div>
        );

      case "date":
        return (
          <div>
            <Input
              type="date"
              value={getStringValue(cell.value)}
              onChange={(e) =>
                updateCellValue(rowId, cellIndex, e.target.value)
              }
              required={cell.validation?.required}
              {...commonProps}
            />
            {cellError && (
              <div className="text-xs text-red-500 mt-1">{cellError}</div>
            )}
          </div>
        );

      case "select":
        return (
          <div>
            <Select
              value={getStringValue(cell.value)}
              onValueChange={(value) =>
                updateCellValue(rowId, cellIndex, value)
              }
              disabled={isDisabled}
            >
              <SelectTrigger className={cellError ? "border-red-500" : ""}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {cell.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {cellError && (
              <div className="text-xs text-red-500 mt-1">{cellError}</div>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={cell.value === true}
              onCheckedChange={(checked) =>
                updateCellValue(rowId, cellIndex, checked)
              }
              disabled={isDisabled}
            />
          </div>
        );

      default:
        return <div>{cell.value}</div>;
    }
  };

  // Table style
  const tableStyle: React.CSSProperties = {
    width: tableConfig.tableStyle?.width || "100%",
    borderCollapse: "collapse",
  };

  if (tableConfig.settings?.showBorders) {
    tableStyle.border = `1px solid ${
      tableConfig.tableStyle?.borderColor || "#e5e7eb"
    }`;
  }

  // Header style
  const headerStyle: React.CSSProperties = {
    backgroundColor: tableConfig.tableStyle?.headerBackgroundColor || "#f3f4f6",
    color: tableConfig.tableStyle?.headerTextColor || "#111827",
    fontWeight: "bold",
    padding: "8px 12px",
    textAlign: "left",
  };

  if (tableConfig.settings?.showBorders) {
    headerStyle.border = `1px solid ${
      tableConfig.tableStyle?.borderColor || "#e5e7eb"
    }`;
  }

  if (tableConfig.settings?.stickyHeader) {
    headerStyle.position = "sticky";
    headerStyle.top = 0;
    headerStyle.zIndex = 10;
  }

  return (
    <div className="w-full overflow-auto">
      <table style={tableStyle}>
        <thead>
          <tr>
            {tableConfig.columns.map((col) => (
              <th
                key={col.columnId}
                style={{ ...headerStyle, width: col.width }}
              >
                {col.header}
              </th>
            ))}
            {tableConfig.settings?.allowDeleteRows && (
              <th style={headerStyle} className="w-16"></th>
            )}
          </tr>
        </thead>
        <tbody>
          {tableConfig.rows.map((row, rowIndex) => {
            const isReadonly = row.readonly || false;
            const isHeader = row.isHeader || false;
            const isFooter = row.isFooter || false;

            const rowStyle: React.CSSProperties = {
              backgroundColor:
                tableConfig.settings?.alternateRowColors && rowIndex % 2 === 1
                  ? "#f9fafb"
                  : undefined,
            };

            if (isHeader) {
              rowStyle.backgroundColor =
                tableConfig.tableStyle?.headerBackgroundColor || "#f3f4f6";
              rowStyle.fontWeight = "bold";
            }

            if (isFooter) {
              rowStyle.fontWeight = "bold";
              rowStyle.backgroundColor = "#f9fafb";
            }

            return (
              <tr key={row.rowId} style={rowStyle}>
                {row.cells.map((cell, cellIndex) => {
                  const cellStyle: React.CSSProperties = {
                    padding: "8px 12px",
                    backgroundColor: cell.style?.backgroundColor,
                    color: cell.style?.textColor,
                    textAlign: cell.style?.textAlign || "left",
                    fontWeight: cell.style?.fontWeight || "normal",
                  };

                  if (tableConfig.settings?.showBorders) {
                    cellStyle.border = `1px solid ${
                      tableConfig.tableStyle?.borderColor || "#e5e7eb"
                    }`;
                  }

                  return (
                    <td key={cellIndex} style={cellStyle}>
                      {renderCellInput(cell, row.rowId, cellIndex, isReadonly)}
                    </td>
                  );
                })}
                {tableConfig.settings?.allowDeleteRows && (
                  <td
                    style={{
                      padding: "8px 12px",
                      border: tableConfig.settings?.showBorders
                        ? `1px solid ${
                            tableConfig.tableStyle?.borderColor || "#e5e7eb"
                          }`
                        : undefined,
                    }}
                  >
                    {!isHeader &&
                      !isFooter &&
                      tableConfig.rows.length >
                        (tableConfig.settings.minRows || 0) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRow(row.rowId)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {tableConfig.settings?.allowAddRows &&
        (!tableConfig.settings.maxRows ||
          tableConfig.rows.length < tableConfig.settings.maxRows) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={disabled}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        )}
    </div>
  );
};

export default EditableTableField;
