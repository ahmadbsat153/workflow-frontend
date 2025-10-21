import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";

import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Field, FieldsType } from "@/lib/types/form/fields";
import { Control, Controller, FieldError } from "react-hook-form";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { formatDates } from "./common";
import { Badge } from "@/lib/ui/badge";
import { isDisplayElement } from "@/lib/constants/formFields";

export const renderFieldPreview = (field: Field) => {
  if (isDisplayElement(field.type)) {
    switch (field.type) {
      case FieldsType.SEPARATOR:
        return (
          <div className="px-4 py-2">
            <hr
              style={{
                borderStyle: field.style?.borderStyle || "solid",
                borderWidth: field.style?.borderWidth || "1px",
                borderColor: field.style?.borderColor || "#e5e7eb",
                margin: field.style?.margin || "0",
              }}
            />
          </div>
        );

      case FieldsType.TITLE:
        const level = field.content?.level || 2;
        const titleStyle = {
          fontSize: field.style?.fontSize || "1.5rem",
          fontWeight: field.style?.fontWeight || "bold",
          color: field.style?.color || "#1f2937",
          textAlign:
            (field.style?.alignment as
              | "left"
              | "center"
              | "right"
              | undefined) || "left",
          margin: field.style?.margin || "0",
        };
        const titleText = field.content?.text || "Section Title";

        return (
          <div className="px-4 py-2">
            {level === 1 && <h1 style={titleStyle}>{titleText}</h1>}
            {level === 2 && <h2 style={titleStyle}>{titleText}</h2>}
            {level === 3 && <h3 style={titleStyle}>{titleText}</h3>}
            {level === 4 && <h4 style={titleStyle}>{titleText}</h4>}
            {level === 5 && <h5 style={titleStyle}>{titleText}</h5>}
            {level === 6 && <h6 style={titleStyle}>{titleText}</h6>}
          </div>
        );
      case FieldsType.PARAGRAPH:
        return (
          <div className="px-4 py-2">
            <p
              style={{
                fontSize: field.style?.fontSize || "1rem",
                color: field.style?.color || "#6b7280",
                textAlign: field.style?.alignment || "left",
                margin: field.style?.margin || "0",
              }}
            >
              {field.content?.text || "Add your description text here..."}
            </p>
          </div>
        );

      case FieldsType.SPACER:
        return (
          <div
            style={{
              height: `${field.content?.height || 30}px`,
              backgroundColor: "#f9fafb",
              border: "1px dashed #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              color: "#9ca3af",
            }}
          >
            Spacer ({field.content?.height || 30}px)
          </div>
        );

      case FieldsType.IMAGE:
        return (
          <div
            className="px-4 py-2"
            style={{ textAlign: field.style?.alignment || "center" }}
          >
            <img
              src={
                field.content?.imageUrl || "https://placehold.co/600x400"
              }
              alt={field.content?.imageAlt || ""}
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "inline-block",
              }}
            />
          </div>
        );

      case FieldsType.ALERT:
        const alertStyles = {
          info: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
          success: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
          warning: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
          error: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
        };

        const alertType = field.content?.alertType || "info";
        const styles = alertStyles[alertType];

        return (
          <div className="px-4 py-2">
            <div
              style={{
                backgroundColor: styles.bg,
                color: styles.text,
                border: `1px solid ${styles.border}`,
                borderRadius: "0.375rem",
                padding: "12px 16px",
                margin: field.style?.margin || "0",
              }}
            >
              {field.content?.text || "This is an alert message"}
            </div>
          </div>
        );

      case FieldsType.HTML:
        return (
          <div className="px-4 py-2">
            <div
              dangerouslySetInnerHTML={{
                __html: field.content?.html || "<p>Custom HTML</p>",
              }}
              style={{
                border: "1px dashed #d1d5db",
                padding: "8px",
                borderRadius: "0.375rem",
              }}
            />
          </div>
        );
    }
  }

  switch (field.type) {
    case FieldsType.TEXT:
    case FieldsType.EMAIL:
    case FieldsType.NUMBER:
    case FieldsType.CHECKBOX:
    case FieldsType.RADIO:
    case FieldsType.SELECT:
    case FieldsType.DATE:
    default:
      return <></>;
  }
};

export const renderFormFieldSubmission = (
  field: Field,
  control: Control<any>,
  error?: FieldError
) => {
  if (isDisplayElement(field.type)) {
    return renderFieldPreview(field);
  }

  switch (field.type) {
    case FieldsType.TEXT:
    case FieldsType.EMAIL:
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => (
            <div>
              <Input
                width={field.style?.width}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                value={formField.value || ""}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                type={field.type}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error.message as string}
                </p>
              )}
            </div>
          )}
        />
      );

    case FieldsType.NUMBER:
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => (
            <div>
              <Input
                type="number"
                label={field.label}
                width={field.style?.width}
                placeholder={field.placeholder}
                value={formField.value || ""}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error.message as string}
                </p>
              )}
            </div>
          )}
        />
      );

    case FieldsType.TEXT_AREA:
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => (
            <div>
              <Textarea
                label={field.label}
                placeholder={field.placeholder}
                value={formField.value || ""}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error.message as string}
                </p>
              )}
            </div>
          )}
        />
      );
    case FieldsType.SELECT:
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => {
            return (
              <div className="w-full">
                <label className="text-sm font-medium mb-2 block">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <Select
                  value={formField.value || undefined} // Changed from "" to undefined
                  onValueChange={formField.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={field.placeholder || "Select an option"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {field.options?.map((option) => (
                        <SelectItem
                          key={option.value || option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {error && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.message as string}
                  </p>
                )}
              </div>
            );
          }}
        />
      );

    case FieldsType.RADIO:
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => (
            <div>
              <label className="text-sm font-medium mb-2 block">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div
                    key={option.value || option.value}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      id={`${field.name}-${option.value}`}
                      value={option.value}
                      checked={formField.value === option.value}
                      onChange={(e) => formField.onChange(e.target.value)}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor={`${field.name}-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error.message as string}
                </p>
              )}
            </div>
          )}
        />
      );

    case FieldsType.CHECKBOX:
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => (
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={field.name}
                  checked={formField.value || false}
                  onChange={(e) => formField.onChange(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor={field.name} className="text-sm cursor-pointer">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error.message as string}
                </p>
              )}
            </div>
          )}
        />
      );

    case FieldsType.DATE:
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => (
            <div>
              <label className="text-sm font-medium mb-2 block">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                value={formField.value || ""}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  width: field.style?.width ? `${field.style.width}%` : "100%",
                }}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">
                  {error.message as string}
                </p>
              )}
            </div>
          )}
        />
      );

    default:
      return null;
  }
};

export const renderFieldSubmission = (field: Field, value: any) => {
  if (value === undefined || value === null || value === "") {
    return <span className="text-gray-400 italic">Not provided</span>;
  }

  switch (field.type) {
    case FieldsType.CHECKBOX:
      return value ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Yes</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-400">
          <XCircle className="w-4 h-4" />
          <span>No</span>
        </div>
      );

    case FieldsType.DATE:
      return (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{formatDates(value as string)}</span>
        </div>
      );

    case FieldsType.SELECT:
    case FieldsType.RADIO:
      const selectedOption = field.options?.find((opt) => opt.value === value);
      return (
        <Badge variant="secondary" className="text-sm">
          {selectedOption?.label || value}
        </Badge>
      );

    case FieldsType.TEXT_AREA:
      return (
        <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">
          {value}
        </div>
      );

    case FieldsType.EMAIL:
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      );

    case FieldsType.NUMBER:
      return <span className="font-mono">{value}</span>;

    default:
      return <span>{value}</span>;
  }
};
