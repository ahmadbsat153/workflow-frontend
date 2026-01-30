"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/lib/ui/select";
import React from "react";
import { Input } from "@/lib/ui/input";
import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ConditionData } from "@/lib/types/workflow/workflow";
import { SearchableSelect, SelectOption, SelectOptionGroup } from "@/lib/components/Common/SearchableSelect";

interface ConditionBuilderProps {
  conditions: ConditionData[];
  onChange: (conditions: ConditionData[]) => void;
  conditionLogic?: "AND" | "OR";
  onLogicChange?: (logic: "AND" | "OR") => void;
  availableFields?: SelectOption[] | SelectOptionGroup[];
}

const OPERATORS = [
  { value: "eq", label: "Equals" },
  { value: "neq", label: "Not Equals" },
  { value: "gt", label: "Greater Than" },
  { value: "gte", label: "Greater or Equal" },
  { value: "lt", label: "Less Than" },
  { value: "lte", label: "Less or Equal" },
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Not Contains" },
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
  { value: "isEmpty", label: "Is Empty" },
  { value: "isNotEmpty", label: "Is Not Empty" },
];

// Helper to check if options array has items (works for both flat and grouped)
const hasOptions = (options: SelectOption[] | SelectOptionGroup[]): boolean => {
  if (options.length === 0) return false;
  // Check if it's grouped options
  if ("options" in options[0]) {
    return (options as SelectOptionGroup[]).some((group) => group.options.length > 0);
  }
  return true;
};

export const ConditionBuilder = ({
  conditions,
  onChange,
  conditionLogic = "AND",
  onLogicChange,
  availableFields = [],
}: ConditionBuilderProps) => {
  const addCondition = () => {
    const newCondition: ConditionData = {
      field: "",
      operator: "eq",
      value: "",
    };
    onChange([...conditions, newCondition]);
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (
    index: number,
    field: keyof ConditionData,
    value: string
  ) => {
    const updated = conditions.map((condition, i) =>
      i === index ? { ...condition, [field]: value } : condition
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Logic Selector */}
      {conditions.length > 1 && onLogicChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Match:</span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={conditionLogic === "AND" ? "default" : "outline"}
              size="sm"
              onClick={() => onLogicChange("AND")}
            >
              AND
            </Button>
            <Button
              type="button"
              variant={conditionLogic === "OR" ? "default" : "outline"}
              size="sm"
              onClick={() => onLogicChange("OR")}
            >
              OR
            </Button>
          </div>
        </div>
      )}

      {/* Conditions List */}
      {conditions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="text-sm">No conditions defined</p>
          <p className="text-xs mt-1">Add a condition to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 bg-accent/50">
              {/* Condition Number */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  Condition {index + 1}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCondition(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              {/* Field Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Field</label>
                {hasOptions(availableFields) ? (
                  <SearchableSelect
                    options={availableFields}
                    value={condition.field}
                    onChange={(value) => updateCondition(index, "field", value)}
                    placeholder="Select field"
                    searchPlaceholder="Search fields..."
                    emptyMessage="No fields found"
                  />
                ) : (
                  <Input
                    placeholder="e.g., department"
                    value={condition.field}
                    onChange={(e) => updateCondition(index, "field", e.target.value)}
                  />
                )}
              </div>

              {/* Operator Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Operator</label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, "operator", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Value Input (hide for isEmpty/isNotEmpty) */}
              {!["isEmpty", "isNotEmpty"].includes(condition.operator) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    placeholder="e.g., IT"
                    value={condition.value as string}
                    onChange={(e) => updateCondition(index, "value", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Use {`{{fieldName}}`} for dynamic values
                  </p>
                </div>
              )}

              {/* Logic connector between conditions */}
              {index < conditions.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <Badge variant="secondary">{conditionLogic}</Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Condition Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addCondition}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Condition
      </Button>
    </div>
  );
};