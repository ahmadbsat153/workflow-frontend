"use client";

import { Field } from "@/lib/types/form/fields";
import {
  EditableTableConfig,
  TableColumn,
  TableRow,
  TableCell,
} from "@/lib/types/form/editableTable";

import { Input } from "@/lib/ui/input";
import { Button } from "@/lib/ui/button";
import { UseFormReturn } from "react-hook-form";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  Columns,
  Rows,
  Settings2,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { Switch } from "@/lib/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import EditableTableField from "@/lib/components/Forms/EditableTableField";

type Props = {
  field: Field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  loading: boolean;
};

// Predefined templates for quick setup
const TABLE_TEMPLATES = {
  leave_request: {
    name: "Leave Request",
    config: {
      columns: [
        {
          columnId: "col_type",
          header: "TYPE OF LEAVE",
          width: "40%",
          dataType: "text" as const,
          editable: false,
        },
        {
          columnId: "col_days",
          header: "No. OF DAYS",
          width: "20%",
          dataType: "number" as const,
          editable: true,
        },
        {
          columnId: "col_comments",
          header: "COMMENTS",
          width: "40%",
          dataType: "text" as const,
          editable: true,
        },
      ],
      rows: [
        {
          rowId: "row_annual",
          cells: [
            { value: "Annual", editable: false, dataType: "text" as const },
            {
              value: "",
              editable: true,
              dataType: "number" as const,
              validation: { min: 0 },
            },
            { value: "", editable: true, dataType: "text" as const },
          ],
        },
        {
          rowId: "row_sick",
          cells: [
            { value: "Sick Leave", editable: false, dataType: "text" as const },
            {
              value: "",
              editable: true,
              dataType: "number" as const,
              validation: { min: 0 },
            },
            { value: "", editable: true, dataType: "text" as const },
          ],
        },
      ],
      settings: {
        showBorders: true,
        stickyHeader: true,
        allowAddRows: false,
        allowDeleteRows: false,
      },
      tableStyle: {
        width: "100%",
        borderColor: "#000000",
        headerBackgroundColor: "#f0f0f0",
        headerTextColor: "#333333",
      },
    } as EditableTableConfig,
  },
  expense_report: {
    name: "Expense Report",
    config: {
      columns: [
        {
          columnId: "col_date",
          header: "Date",
          width: "20%",
          dataType: "date" as const,
          editable: true,
        },
        {
          columnId: "col_desc",
          header: "Description",
          width: "40%",
          dataType: "text" as const,
          editable: true,
        },
        {
          columnId: "col_amount",
          header: "Amount",
          width: "20%",
          dataType: "number" as const,
          editable: true,
        },
        {
          columnId: "col_category",
          header: "Category",
          width: "20%",
          dataType: "select" as const,
          editable: true,
        },
      ],
      rows: [
        {
          rowId: "row_1",
          cells: [
            {
              value: "",
              editable: true,
              dataType: "date" as const,
              validation: { required: true },
            },
            {
              value: "",
              editable: true,
              dataType: "text" as const,
              validation: { required: true },
            },
            {
              value: "",
              editable: true,
              dataType: "number" as const,
              validation: { required: true, min: 0 },
            },
            {
              value: "",
              editable: true,
              dataType: "select" as const,
              options: [
                { label: "Travel", value: "travel" },
                { label: "Meals", value: "meals" },
                { label: "Office", value: "office" },
              ],
              validation: { required: true },
            },
          ],
        },
      ],
      settings: {
        showBorders: true,
        allowAddRows: true,
        allowDeleteRows: true,
        maxRows: 50,
      },
      tableStyle: {
        width: "100%",
        borderColor: "#e5e7eb",
        headerBackgroundColor: "#f9fafb",
        headerTextColor: "#111827",
      },
    } as EditableTableConfig,
  },
  task_checklist: {
    name: "Task Checklist",
    config: {
      columns: [
        {
          columnId: "col_task",
          header: "Task",
          width: "70%",
          dataType: "text" as const,
          editable: true,
        },
        {
          columnId: "col_done",
          header: "Done",
          width: "30%",
          dataType: "checkbox" as const,
          editable: true,
        },
      ],
      rows: [
        {
          rowId: "row_1",
          cells: [
            {
              value: "",
              editable: true,
              dataType: "text" as const,
              validation: { required: true },
            },
            { value: false, editable: true, dataType: "checkbox" as const },
          ],
        },
      ],
      settings: {
        showBorders: true,
        allowAddRows: true,
        allowDeleteRows: true,
        minRows: 1,
        maxRows: 20,
      },
      tableStyle: {
        width: "100%",
        borderColor: "#d1d5db",
        headerBackgroundColor: "#f3f4f6",
        headerTextColor: "#374151",
      },
    } as EditableTableConfig,
  },
  custom: {
    name: "Custom Table",
    config: {
      columns: [
        {
          columnId: "col_1",
          header: "Column 1",
          width: "50%",
          dataType: "text" as const,
          editable: true,
        },
        {
          columnId: "col_2",
          header: "Column 2",
          width: "50%",
          dataType: "text" as const,
          editable: true,
        },
      ],
      rows: [
        {
          rowId: "row_1",
          cells: [
            { value: "", editable: true, dataType: "text" as const },
            { value: "", editable: true, dataType: "text" as const },
          ],
        },
      ],
      settings: {
        showBorders: true,
        allowAddRows: false,
        allowDeleteRows: false,
      },
      tableStyle: {
        width: "100%",
      },
    } as EditableTableConfig,
  },
};

const TableConfig = ({ form, field, loading }: Props) => {
  const [activeTab, setActiveTab] = useState("template");
  const [tableConfig, setTableConfig] = useState<EditableTableConfig>(
    field.tableConfig || TABLE_TEMPLATES.custom.config
  );
  const [expandedColumn, setExpandedColumn] = useState<number | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  // Sync tableConfig to form when it changes (debounced to avoid re-renders on every keystroke)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      form.setValue("tableConfig", tableConfig, { shouldDirty: true });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [tableConfig, form]);

  const handleTemplateSelect = (templateKey: string) => {
    const template =
      TABLE_TEMPLATES[templateKey as keyof typeof TABLE_TEMPLATES];
    if (template) {
      setTableConfig(template.config);
      setActiveTab("columns");
    }
  };

  // Column Management
  const addColumn = () => {
    const newColumnId = `col_${Date.now()}`;
    const newColumn: TableColumn = {
      columnId: newColumnId,
      header: `Column ${tableConfig.columns.length + 1}`,
      width: "auto",
      dataType: "text",
      editable: true,
    };

    const newCell: TableCell = {
      value: "",
      editable: true,
      dataType: "text",
    };

    setTableConfig({
      ...tableConfig,
      columns: [...tableConfig.columns, newColumn],
      rows: tableConfig.rows.map((row) => ({
        ...row,
        cells: [...row.cells, { ...newCell }],
      })),
    });
  };

  const removeColumn = (index: number) => {
    if (tableConfig.columns.length <= 1) return;

    setTableConfig({
      ...tableConfig,
      columns: tableConfig.columns.filter((_, i) => i !== index),
      rows: tableConfig.rows.map((row) => ({
        ...row,
        cells: row.cells.filter((_, i) => i !== index),
      })),
    });
  };

  const updateColumn = (index: number, updates: Partial<TableColumn>) => {
    const updatedColumns = [...tableConfig.columns];
    updatedColumns[index] = { ...updatedColumns[index], ...updates };

    // If dataType changed, update all cells in this column
    if (updates.dataType) {
      const newDataType = updates.dataType;
      const updatedRows = tableConfig.rows.map((row) => {
        const updatedCells = [...row.cells];
        updatedCells[index] = {
          ...updatedCells[index],
          dataType: newDataType,
          value: newDataType === "checkbox" ? false : "",
        };
        return { ...row, cells: updatedCells };
      });

      setTableConfig({
        ...tableConfig,
        columns: updatedColumns,
        rows: updatedRows,
      });
    } else {
      setTableConfig({
        ...tableConfig,
        columns: updatedColumns,
      });
    }
  };

  // Row Management
  const addRow = () => {
    const newRowId = `row_${Date.now()}`;
    const newCells: TableCell[] = tableConfig.columns.map((col) => ({
      value: col.dataType === "checkbox" ? false : "",
      editable: col.editable,
      dataType: col.dataType,
    }));

    const newRow: TableRow = {
      rowId: newRowId,
      cells: newCells,
    };

    setTableConfig({
      ...tableConfig,
      rows: [...tableConfig.rows, newRow],
    });
  };

  const removeRow = (index: number) => {
    if (tableConfig.rows.length <= 1) return;

    setTableConfig({
      ...tableConfig,
      rows: tableConfig.rows.filter((_, i) => i !== index),
    });
  };

  const updateRow = (rowIndex: number, updates: Partial<TableRow>) => {
    const updatedRows = [...tableConfig.rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updates };

    setTableConfig({
      ...tableConfig,
      rows: updatedRows,
    });
  };

  const updateCell = (
    rowIndex: number,
    cellIndex: number,
    updates: Partial<TableCell>
  ) => {
    const updatedRows = [...tableConfig.rows];
    const updatedCells = [...updatedRows[rowIndex].cells];
    updatedCells[cellIndex] = { ...updatedCells[cellIndex], ...updates };
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], cells: updatedCells };

    setTableConfig({
      ...tableConfig,
      rows: updatedRows,
    });
  };

  // Settings Management
  const updateSettings = (
    updates: Partial<EditableTableConfig["settings"]>
  ) => {
    setTableConfig({
      ...tableConfig,
      settings: { ...tableConfig.settings, ...updates },
    });
  };

  const updateTableStyle = (
    updates: Partial<EditableTableConfig["tableStyle"]>
  ) => {
    setTableConfig({
      ...tableConfig,
      tableStyle: { ...tableConfig.tableStyle, ...updates },
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="template">
            <TableIcon className="h-4 w-4 mr-2" />
            Template
          </TabsTrigger>
          <TabsTrigger value="columns">
            <Columns className="h-4 w-4 mr-2" />
            Columns
          </TabsTrigger>
          <TabsTrigger value="rows">
            <Rows className="h-4 w-4 mr-2" />
            Rows
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings2 className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Template Selection */}
        <TabsContent value="template" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Choose a Template</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start with a pre-configured template or create a custom table
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(TABLE_TEMPLATES).map(([key, template]) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                className="justify-start h-auto p-4 w-full"
                onClick={() => handleTemplateSelect(key)}
              >
                <div className="text-left">
                  <div className="font-semibold">{template.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {template.config.columns.length} columns ×{" "}
                    {template.config.rows.length} rows
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>

        {/* Column Configuration */}
        <TabsContent value="columns" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Columns</h3>
              <p className="text-sm text-muted-foreground">
                Configure table columns and their properties
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addColumn}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
          </div>

          <div className="space-y-2">
            {tableConfig.columns.map((column, index) => {
              const isExpanded = expandedColumn === index;

              return (
                <div
                  key={column.columnId}
                  className="border rounded-lg overflow-hidden"
                >
                  {/* Column Header */}
                  <div
                    className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted"
                    onClick={() => setExpandedColumn(isExpanded ? null : index)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {column.header || `Column ${index + 1}`}
                      </p>
                      {!isExpanded && (
                        <p className="text-xs text-muted-foreground">
                          {column.dataType} •{" "}
                          {column.editable ? "Editable" : "Read-only"}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeColumn(index);
                        }}
                        disabled={loading || tableConfig.columns.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Column Details */}
                  {isExpanded && (
                    <div className="p-3 space-y-3 border-t">
                      <div>
                        <label className="text-xs font-medium">
                          Column Header
                        </label>
                        <Input
                          value={column.header}
                          onChange={(e) =>
                            updateColumn(index, { header: e.target.value })
                          }
                          placeholder="Column name"
                          disabled={loading}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">Width</label>
                        <Input
                          value={column.width || ""}
                          onChange={(e) =>
                            updateColumn(index, { width: e.target.value })
                          }
                          placeholder="e.g., 50%, 200px, auto"
                          disabled={loading}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">Data Type</label>
                        <Select
                          value={column.dataType}
                          onValueChange={(value) =>
                            updateColumn(index, {
                              dataType: value as TableColumn["dataType"],
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">
                          Editable by default
                        </label>
                        <Switch
                          checked={column.editable}
                          onCheckedChange={(checked) =>
                            updateColumn(index, { editable: checked })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Row Configuration */}
        <TabsContent value="rows" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Rows</h3>
              <p className="text-sm text-muted-foreground">
                Configure table rows and cell properties
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRow}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </div>

          <div className="space-y-2">
            {tableConfig.rows.map((row, rowIndex) => {
              const isExpanded = expandedRow === rowIndex;

              return (
                <div
                  key={row.rowId}
                  className="border rounded-lg overflow-hidden"
                >
                  {/* Row Header */}
                  <div
                    className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted"
                    onClick={() => setExpandedRow(isExpanded ? null : rowIndex)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Row {rowIndex + 1}</p>
                      {!isExpanded && (
                        <p className="text-xs text-muted-foreground">
                          {row.isHeader
                            ? "Header"
                            : row.isFooter
                            ? "Footer"
                            : row.readonly
                            ? "Read-only"
                            : "Editable"}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRow(rowIndex);
                        }}
                        disabled={loading || tableConfig.rows.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Row Details */}
                  {isExpanded && (
                    <div className="p-3 space-y-3 border-t">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">
                          Header Row
                        </label>
                        <Switch
                          checked={row.isHeader || false}
                          onCheckedChange={(checked) =>
                            updateRow(rowIndex, { isHeader: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">
                          Footer Row
                        </label>
                        <Switch
                          checked={row.isFooter || false}
                          onCheckedChange={(checked) =>
                            updateRow(rowIndex, { isFooter: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">
                          Read-only Row
                        </label>
                        <Switch
                          checked={row.readonly || false}
                          onCheckedChange={(checked) =>
                            updateRow(rowIndex, { readonly: checked })
                          }
                        />
                      </div>

                      <div className="pt-2 border-t">
                        <label className="text-xs font-medium mb-2 block">
                          Cell Configuration
                        </label>
                        <div className="space-y-2">
                          {row.cells.map((cell, cellIndex) => (
                            <div
                              key={cellIndex}
                              className="p-2 bg-muted/30 rounded space-y-2"
                            >
                              <div className="text-xs font-medium">
                                {tableConfig.columns[cellIndex]?.header ||
                                  `Cell ${cellIndex + 1}`}
                              </div>

                              <div>
                                <label className="text-xs text-muted-foreground">
                                  Default Value
                                </label>
                                <Input
                                  value={
                                    typeof cell.value === "boolean"
                                      ? String(cell.value)
                                      : cell.value ?? ""
                                  }
                                  onChange={(e) =>
                                    updateCell(rowIndex, cellIndex, {
                                      value: e.target.value,
                                    })
                                  }
                                  placeholder="Cell value"
                                  disabled={loading}
                                  className="mt-1"
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <label className="text-xs text-muted-foreground">
                                  Editable
                                </label>
                                <Switch
                                  checked={cell.editable}
                                  onCheckedChange={(checked) =>
                                    updateCell(rowIndex, cellIndex, {
                                      editable: checked,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Table Settings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure table behavior and styling
            </p>
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-medium">Behavior</h4>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Allow Add Rows</label>
                <p className="text-xs text-muted-foreground">
                  Users can add new rows
                </p>
              </div>
              <Switch
                checked={tableConfig.settings?.allowAddRows || false}
                onCheckedChange={(checked) =>
                  updateSettings({ allowAddRows: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Allow Delete Rows</label>
                <p className="text-xs text-muted-foreground">
                  Users can delete rows
                </p>
              </div>
              <Switch
                checked={tableConfig.settings?.allowDeleteRows || false}
                onCheckedChange={(checked) =>
                  updateSettings({ allowDeleteRows: checked })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Min Rows</label>
              <Input
                type="number"
                value={tableConfig.settings?.minRows || ""}
                onChange={(e) =>
                  updateSettings({
                    minRows: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="No minimum"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Max Rows</label>
              <Input
                type="number"
                value={tableConfig.settings?.maxRows || ""}
                onChange={(e) =>
                  updateSettings({
                    maxRows: parseInt(e.target.value) || undefined,
                  })
                }
                placeholder="No maximum"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-medium">Appearance</h4>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Show Borders</label>
                <p className="text-xs text-muted-foreground">
                  Display table borders
                </p>
              </div>
              <Switch
                checked={tableConfig.settings?.showBorders !== false}
                onCheckedChange={(checked) =>
                  updateSettings({ showBorders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">
                  Alternate Row Colors
                </label>
                <p className="text-xs text-muted-foreground">Zebra striping</p>
              </div>
              <Switch
                checked={tableConfig.settings?.alternateRowColors || false}
                onCheckedChange={(checked) =>
                  updateSettings({ alternateRowColors: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Sticky Header</label>
                <p className="text-xs text-muted-foreground">
                  Header stays visible on scroll
                </p>
              </div>
              <Switch
                checked={tableConfig.settings?.stickyHeader || false}
                onCheckedChange={(checked) =>
                  updateSettings({ stickyHeader: checked })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Border Color</label>
              <Input
                type="color"
                value={tableConfig.tableStyle?.borderColor || "#000000"}
                onChange={(e) =>
                  updateTableStyle({ borderColor: e.target.value })
                }
                className="mt-1 h-10"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Header Background</label>
              <Input
                type="color"
                value={
                  tableConfig.tableStyle?.headerBackgroundColor || "#f0f0f0"
                }
                onChange={(e) =>
                  updateTableStyle({ headerBackgroundColor: e.target.value })
                }
                className="mt-1 h-10"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Header Text Color</label>
              <Input
                type="color"
                value={tableConfig.tableStyle?.headerTextColor || "#333333"}
                onChange={(e) =>
                  updateTableStyle({ headerTextColor: e.target.value })
                }
                className="mt-1 h-10"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <div className="mt-6 border-t pt-6">
        <h3 className="text-sm font-semibold mb-3">Preview</h3>
        <p className="text-xs text-muted-foreground mb-3">
          This is how the table will appear to users filling out the form
        </p>
        <div className="border rounded-lg p-4 bg-muted/20">
          <EditableTableField
            config={tableConfig}
            value={tableConfig}
            onChange={() => {}} // Preview is read-only, don't update on changes
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default TableConfig;
