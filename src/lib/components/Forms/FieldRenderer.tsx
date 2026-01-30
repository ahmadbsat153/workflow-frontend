"use client";

import React from "react";
import { Field, FieldsType, CountryCode } from "@/lib/types/form/fields";
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
import { EditableTableConfig } from "@/lib/types/form/editableTable";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Field value is intentionally broad as this component handles all field types
// Each case in the switch handles the specific type appropriately
type FieldValue = string | number | boolean | string[] | FileList | EditableTableConfig | null | undefined;

type FieldRendererProps = {
  field: Field;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  disabled?: boolean;
};

// Helper to safely convert value to string for input fields
const toStringValue = (val: FieldValue): string => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return "";
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
  const stringValue = toStringValue(value);

  console.log(field.type, "field type in renderer");
  switch (field.type) {
    case FieldsType.TEXT:
      return (
        <Input
          type="text"
          value={stringValue}
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
          value={stringValue}
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
          value={stringValue}
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
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          disabled={disabled}
        />
      );

    case FieldsType.PHONE:
      console.log("Rendering phone input with country:", field.phoneSettings?.country);
      return (
        // <PhoneInput
        //   international
        //   countryCallingCodeEditable={false}
        //   defaultCountry={field.phoneSettings?.country as CountryCode || "AU"}
        //   value={stringValue}
        //   onChange={(val) => onChange(val || "")}
        //   disabled={disabled}
        //   placeholder={field.placeholder}
        //   className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        // />
        <div>
          A phone number
        </div>
      );

    case FieldsType.TEXT_AREA:
      return (
        <Textarea
          value={stringValue}
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
          value={stringValue}
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
          multiple={field.validation?.maxFiles ? field.validation.maxFiles > 1 : undefined}
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
          value={value as EditableTableConfig | undefined}
          onChange={onChange as (config: EditableTableConfig) => void}
          disabled={disabled}
        />
      );

    // Display elements - read-only
    case FieldsType.TITLE: {
      const level = field.content?.level || 2;
      const headingStyle: React.CSSProperties = {
        fontSize: field.style?.fontSize,
        fontWeight: field.style?.fontWeight,
        color: field.style?.color,
        textAlign: field.style?.alignment,
        margin: field.style?.margin,
      };
      const text = field.content?.text;

      if (level === 1) return <h1 style={headingStyle}>{text}</h1>;
      if (level === 3) return <h3 style={headingStyle}>{text}</h3>;
      if (level === 4) return <h4 style={headingStyle}>{text}</h4>;
      if (level === 5) return <h5 style={headingStyle}>{text}</h5>;
      if (level === 6) return <h6 style={headingStyle}>{text}</h6>;
      return <h2 style={headingStyle}>{text}</h2>;
    }

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
          value={stringValue}
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

    case FieldsType.SUBMITTER_INFO:
      // This field is auto-filled from user profile, so it's read-only
      return (
        <Input
          type="text"
          value={stringValue}
          readOnly
          disabled
          className="bg-muted"
        />
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
