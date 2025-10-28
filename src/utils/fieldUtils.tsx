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
import {
  Calendar,
  CheckCircle,
  CircleCheckBigIcon,
  SquareCheckBigIcon,
  ToggleRightIcon,
  XCircle,
} from "lucide-react";
import { formatDates, formatDatesWithYear } from "./common";
import { Badge } from "@/lib/ui/badge";
import { isDisplayElement, isInputField } from "@/lib/constants/formFields";
import { Switch } from "@/lib/ui/switch";
import { Label } from "@/lib/ui/label";

export const renderFieldPreview = (field: Field) => {
  //TODO: Fix background color issue in display elements
  // possibly the color is not saving correctly
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
                backgroundColor: field.style?.backgroundColor || "transparent",
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
                textAlign: (field.style?.alignment as any) || "left",
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
              backgroundColor: field.style?.backgroundColor || "#f9fafb",
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
            style={{ textAlign: (field.style?.alignment as any) || "center" }}
          >
            <img
              src={field.content?.imageUrl || "https://placehold.co/600x400"}
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

        const alertType =
          (field.content?.alertType as keyof typeof alertStyles) || "info";
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
    case FieldsType.TEXT_AREA:
    case FieldsType.SWITCH:

    default:
      return <></>;
  }
};

// Renders a form field for submission based on its type
// Used in form submission forms
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
                label={
                  <>
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </>
                }
                placeholder={field.placeholder}
                value={formField.value || ""}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                type={field.type}
                errorMessage={error?.message as string}
              />
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
                required={field.required}
                width={field.style?.width}
                placeholder={field.placeholder}
                value={formField.value || ""}
                onChange={formField.onChange}
                onBlur={formField.onBlur}
                errorMessage={error?.message as string}
              />
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
              <label className="text-sm font-medium mb-2 block">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <Textarea
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
          rules={{
            required: field.required,
          }}
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
                  value={formField.value || undefined}
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
              <label className="text-sm font-medium mb-2 block">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="flex flex-col gap-2">
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`${field.name}-${option.value}`}
                      value={option.value}
                      checked={
                        Array.isArray(formField.value) &&
                        formField.value.includes(option.value)
                      }
                      onChange={(e) => {
                        const currentValues = Array.isArray(formField.value)
                          ? formField.value
                          : [];

                        if (e.target.checked) {
                          formField.onChange([...currentValues, option.value]);
                        } else {
                          formField.onChange(
                            currentValues.filter((val) => val !== option.value)
                          );
                        }
                      }}
                      className="w-4 h-4 cursor-pointer"
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
                className="w-full  p-2 border rounded-md text-sm"
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

    case FieldsType.SWITCH:
      return (
        <Controller
          name={field.name}
          control={control}
          // defaultValue={
          //   field.defaultValue === "true" ||
          //   field.defaultValue === true ||
          //   false
          // }
          // rules={{ required: field.required }}
          render={({ field: formField, fieldState: { error } }) => (
            <div className="space-y-2">
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <Label
                  htmlFor={field.name}
                  className="cursor-pointer text-sm font-medium"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Switch
                  id={field.name}
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                />
              </div>
              {field.placeholder && (
                <p className="text-sm text-gray-500">{field.placeholder}</p>
              )}
              {error && (
                <p className="text-red-500 text-sm">
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

// Renders the submitted value of a field based on its type
// Used in form submission review or detail views
export const renderSubmittedFieldValue = (field: Field, value: any) => {
  if (isInputField(field.type)) {
    if (value === undefined || value === null || value === "") {
      return (
        <div className="flex items-center gap-2 text-gray-400 italic py-2">
          <span></span>
        </div>
      );
    }
  }

  if (isDisplayElement(field.type)) {
    return renderFieldPreview(field);
  }

  switch (field.type) {
    case FieldsType.TEXT:
      return (
        <div className="py-2  ">
          <span className="text-secondary">{value}</span>
        </div>
      );

    case FieldsType.EMAIL:
      return (
        <div className="py-2 flex items-center gap-2">
          <a href={`mailto:${value}`} className=" hover:underline">
            {value}
          </a>
        </div>
      );

    case FieldsType.NUMBER:
      return (
        <div className="py-2 ">
          <span className="font-mono ">{value}</span>
        </div>
      );

    case FieldsType.DATE:
      return (
        <div className="py-2  flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pumpkin" />
          <span className="">{formatDatesWithYear(value)}</span>
        </div>
      );

    case FieldsType.TEXT_AREA:
      return (
        <div className="py-3">
          <p className="whitespace-pre-wrap leading-relaxed">{value}</p>
        </div>
      );

    case FieldsType.SELECT:
      const selectedOption = field.options?.find((opt) => opt.value === value);
      return (
        <div className="inline-flex items-center gap-2 py-2 ">
          <svg
            className="w-4 h-4 text-pumpkin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <span className="text-secondary">
            {selectedOption?.label || value}
          </span>
        </div>
      );

    case FieldsType.RADIO:
      const selectedRadioOption = field.options?.find(
        (opt) => opt.value === value
      );
      return (
        <div className="inline-flex items-center gap-2 py-2  ">
          <CircleCheckBigIcon className="w-4 h-4 text-pumpkin" />
          <span className="">{selectedRadioOption?.label || value}</span>
        </div>
      );

    case FieldsType.CHECKBOX:
      // Handle array of values (multiple checkboxes)
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((val) => {
              const option = field.options?.find((opt) => opt.value === val);
              return (
                <div
                  key={val}
                  className="inline-flex items-center gap-2 py-1.5 "
                >
                  <SquareCheckBigIcon className="w-4 h-4 text-pumpkin" />
                  <span className="">{option?.label || val}</span>
                </div>
              );
            })}
          </div>
        );
      }
      // Handle single boolean value
      return (
        <div
          className={`inline-flex items-center gap-2 py-2  rounded-md border ${
            value
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          {value ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-900 font-medium">Yes</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">No</span>
            </>
          )}
        </div>
      );

    case FieldsType.SWITCH:
      return (
        <div className={`inline-flex items-center gap-2 py-2`}>
          <ToggleRightIcon className="w-4 h-4 text-pumpkin" />
          {value ? field.label : field.label}
        </div>
      );

    default:
      return (
        <div className="py-2  bg-gray-50 rounded-md border border-gray-200">
          <span className="text-gray-900">{value}</span>
        </div>
      );
  }
};
