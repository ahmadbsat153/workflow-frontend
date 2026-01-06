"use client";

import React from "react";
import { Field, FieldsType } from "@/lib/types/form/fields";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Switch } from "@/lib/ui/switch";
import { Checkbox } from "@/lib/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { Label } from "@/lib/ui/label";
import EditableTableField from "./EditableTableField";

type FieldRendererProps = {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
};

/**
 * FieldRenderer - Universal component for rendering all form field types
 * Includes support for the editable table field type
 */
const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  disabled = false,
}) => {
  switch (field.type) {
    case FieldsType.TEXT:
      return (
        <Input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={disabled}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
        />
      );

    case FieldsType.EMAIL:
      return (
        <Input
          type="email"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={disabled}
        />
      );

    case FieldsType.NUMBER:
      return (
        <Input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={disabled}
          min={field.validation?.min}
          max={field.validation?.max}
        />
      );

    case FieldsType.DATE:
      return (
        <Input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          disabled={disabled}
        />
      );

    case FieldsType.TEXT_AREA:
      return (
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={disabled}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
          rows={5}
        />
      );

    case FieldsType.SELECT:
      return (
        <Select
          value={value || ""}
          onValueChange={onChange}
          disabled={disabled}
          required={field.required}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || "Select an option..."} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case FieldsType.RADIO:
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${field.name}-${option.value}`}
                name={field.name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={field.required}
                className="h-4 w-4"
              />
              <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      );

    case FieldsType.CHECKBOX:
      if (field.options && field.options.length > 0) {
        // Multiple checkboxes
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, option.value]);
                    } else {
                      onChange(selectedValues.filter((v: string) => v !== option.value));
                    }
                  }}
                  disabled={disabled}
                />
                <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      } else {
        // Single checkbox
        return (
          <Checkbox
            checked={value === true || value === "true"}
            onCheckedChange={onChange}
            disabled={disabled}
          />
        );
      }

    case FieldsType.SWITCH:
      return (
        <Switch
          checked={value === true || value === "true"}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      );

    case FieldsType.FILE:
      return (
        <Input
          type="file"
          onChange={(e) => onChange(e.target.files)}
          required={field.required}
          disabled={disabled}
          accept={field.validation?.allowedFileTypes?.join(",")}
          multiple={field.validation?.maxFiles && field.validation.maxFiles > 1}
        />
      );

    case FieldsType.TABLE:
      if (!field.tableConfig) {
        return (
          <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
            <p className="font-semibold">Table Not Configured</p>
            <p className="text-sm">Please configure the table in the form builder.</p>
          </div>
        );
      }
      return (
        <EditableTableField
          config={field.tableConfig}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );

    // Display elements - read-only
    case FieldsType.TITLE:
      const level = field.content?.level || 2;
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag
          style={{
            fontSize: field.style?.fontSize,
            fontWeight: field.style?.fontWeight,
            color: field.style?.color,
            textAlign: field.style?.alignment,
            margin: field.style?.margin,
          }}
        >
          {field.content?.text}
        </HeadingTag>
      );

    case FieldsType.PARAGRAPH:
      return (
        <p
          style={{
            fontSize: field.style?.fontSize,
            color: field.style?.color,
            textAlign: field.style?.alignment,
            margin: field.style?.margin,
          }}
        >
          {field.content?.text}
        </p>
      );

    case FieldsType.SEPARATOR:
      return (
        <hr
          style={{
            borderStyle: field.style?.borderStyle,
            borderWidth: field.style?.borderWidth,
            borderColor: field.style?.borderColor,
            margin: field.style?.margin,
          }}
        />
      );

    case FieldsType.SPACER:
      return <div style={{ height: `${field.content?.height || 30}px` }} />;

    case FieldsType.IMAGE:
      return (
        <div style={{ textAlign: field.style?.alignment, margin: field.style?.margin }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={field.content?.imageUrl}
            alt={field.content?.imageAlt || ""}
            style={{ maxWidth: "100%" }}
          />
        </div>
      );

    case FieldsType.ALERT:
      const alertStyles = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        error: "bg-red-50 border-red-200 text-red-800",
      };
      const alertType = field.content?.alertType || "info";
      return (
        <div
          className={`p-4 border rounded ${alertStyles[alertType]}`}
          style={{ margin: field.style?.margin }}
        >
          {field.content?.text}
        </div>
      );

    case FieldsType.HTML:
      return (
        <div
          style={{ margin: field.style?.margin }}
          dangerouslySetInnerHTML={{ __html: field.content?.html || "" }}
        />
      );

    // Organizational fields
    case FieldsType.DEPARTMENT:
    case FieldsType.POSITION:
    case FieldsType.BRANCH:
      return (
        <Select
          value={value || ""}
          onValueChange={onChange}
          disabled={disabled}
          required={field.required}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    default:
      return (
        <div className="p-4 border border-gray-300 bg-gray-50 rounded text-gray-700">
          <p>Unsupported field type: {field.type}</p>
        </div>
      );
  }
};

export default FieldRenderer;
