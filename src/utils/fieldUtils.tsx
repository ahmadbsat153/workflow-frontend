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

export const renderFieldPreview = (field: Field) => {
  switch (field.type) {
    case FieldsType.TEXT:
    case FieldsType.EMAIL:
    case FieldsType.NUMBER:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400">
          {field.placeholder || `Enter ${field.type}...`}
        </div>
      );
    case FieldsType.TEXT_AREA:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400 min-h-[100px]">
          {field.placeholder || "Enter text..."}
        </div>
      );
    case FieldsType.CHECKBOX:
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border rounded bg-gray-50" />
          <span className="text-gray-600">{field.label}</span>
        </div>
      );
    case FieldsType.RADIO:
      return (
        <div className="space-y-2">
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <div className="w-4 h-4 border rounded-full bg-gray-50" />
              <span className="text-gray-600">{option.label}</span>
            </div>
          ))}
        </div>
      );
    case FieldsType.SELECT:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400 flex justify-between items-center">
          <span>{field.placeholder || "Select an option..."}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      );
    case FieldsType.DATE:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400 flex justify-between items-center">
          <span>{field.placeholder || "Select date..."}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-400">
          {field.placeholder || "Input field"}
        </div>
      );
  }
};

export const renderFormFieldSubmission = (
  field: Field,
  control: Control<any>,
  error?: FieldError
) => {
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
                          key={option._id || option.value}
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
                    key={option._id || option.value}
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
