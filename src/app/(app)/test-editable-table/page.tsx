"use client";

import React, { useState } from "react";
import EditableTableField from "@/lib/components/Forms/EditableTableField";
import { EditableTableConfig } from "@/lib/types/form/editableTable";
import { Button } from "@/lib/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/ui/card";

/**
 * Example Leave Request Table matching the backend schema exactly
 */
const leaveRequestConfig: EditableTableConfig = {
  columns: [
    {
      columnId: "col_type",
      header: "TYPE OF LEAVE",
      width: "40%",
      dataType: "text",
      editable: false,
    },
    {
      columnId: "col_days",
      header: "No. OF DAYS",
      width: "20%",
      dataType: "number",
      editable: true,
    },
    {
      columnId: "col_comments",
      header: "COMMENTS",
      width: "40%",
      dataType: "text",
      editable: true,
    },
  ],
  rows: [
    {
      rowId: "row_annual",
      cells: [
        {
          value: "Annual",
          editable: false,
          dataType: "text",
        },
        {
          value: "",
          editable: true,
          dataType: "number",
          validation: { min: 0 },
        },
        {
          value: "",
          editable: true,
          dataType: "text",
        },
      ],
    },
    {
      rowId: "row_public",
      cells: [
        {
          value: "Public Holiday",
          editable: false,
          dataType: "text",
        },
        {
          value: "",
          editable: true,
          dataType: "number",
          validation: { min: 0 },
        },
        {
          value: "",
          editable: true,
          dataType: "text",
        },
      ],
    },
    {
      rowId: "row_lsl",
      cells: [
        {
          value: "Long Service Leave (LSL)",
          editable: false,
          dataType: "text",
        },
        {
          value: "",
          editable: true,
          dataType: "number",
          validation: { min: 0 },
        },
        {
          value: "",
          editable: true,
          dataType: "text",
        },
      ],
    },
    {
      rowId: "row_sick",
      cells: [
        {
          value: "Sick (Attach Doctor's Certificate) Y/N",
          editable: false,
          dataType: "text",
        },
        {
          value: "",
          editable: true,
          dataType: "number",
          validation: { min: 0 },
        },
        {
          value: "",
          editable: true,
          dataType: "text",
        },
      ],
    },
    {
      rowId: "row_bereavement",
      cells: [
        {
          value: "Bereavement",
          editable: false,
          dataType: "text",
        },
        {
          value: "",
          editable: true,
          dataType: "number",
          validation: { min: 0 },
        },
        {
          value: "",
          editable: true,
          dataType: "text",
        },
      ],
    },
    {
      rowId: "row_without_pay",
      cells: [
        {
          value: "Without Pay",
          editable: false,
          dataType: "text",
        },
        {
          value: "",
          editable: true,
          dataType: "number",
          validation: { min: 0 },
        },
        {
          value: "",
          editable: true,
          dataType: "text",
        },
      ],
    },
    {
      rowId: "row_other",
      cells: [
        {
          value: "Other (Please state reason)",
          editable: false,
          dataType: "text",
        },
        {
          value: "",
          editable: true,
          dataType: "number",
          validation: { min: 0 },
        },
        {
          value: "",
          editable: true,
          dataType: "text",
        },
      ],
    },
    {
      rowId: "row_total",
      isFooter: true,
      cells: [
        {
          value: "TOTAL",
          editable: false,
          dataType: "text",
          style: {
            fontWeight: "bold",
          },
        },
        {
          value: "",
          editable: false,
          dataType: "number",
          style: {
            fontWeight: "bold",
          },
        },
        {
          value: "",
          editable: false,
          dataType: "text",
        },
      ],
    },
  ],
  settings: {
    showBorders: true,
    alternateRowColors: false,
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
};

export default function TestEditableTablePage() {
  const [tableData, setTableData] = useState<EditableTableConfig>(leaveRequestConfig);

  const handleSubmit = () => {
    console.log("Form submission data:", tableData);
    alert("Form submitted! Check console for data.");
  };

  const handleReset = () => {
    setTableData(leaveRequestConfig);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Leave Request Form - Editable Table Example</CardTitle>
          <CardDescription>
            This demonstrates the editable table field that matches the backend schema exactly.
            Fill in the number of days and comments for each leave type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <EditableTableField
            config={leaveRequestConfig}
            value={tableData}
            onChange={setTableData}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Submission Data Preview:</h3>
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(tableData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
