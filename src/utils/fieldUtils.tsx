import React from "react";
import Image from "next/image";
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
import {
  Field,
  FieldsType,
  SubmitterInfoProperty,
} from "@/lib/types/form/fields";
import { Control, Controller, FieldError, FieldValues } from "react-hook-form";
import {
  Calendar,
  CheckCircle,
  CircleCheckBigIcon,
  SquareCheckBigIcon,
  ToggleRightIcon,
  XCircle,
  FileIcon,
} from "lucide-react";
import { formatDatesWithYear } from "./common";
import { Badge } from "@/lib/ui/badge";
import { isDisplayElement, isInputField } from "@/lib/constants/formFields";
import { Switch } from "@/lib/ui/switch";
import { Label } from "@/lib/ui/label";
import { useAuth } from "@/lib/context/AuthContext";
import EditableTableField from "@/lib/components/Forms/EditableTableField";
import { EditableTableConfig } from "@/lib/types/form/editableTable";

export const renderFieldPreview = (field: Field) => {
  //TODO: Fix background color issue in display elements
  // possibly the color is not saving correctly

  // Show autofill badge for organizational fields
  if (
    field.autofill &&
    (field.type === FieldsType.DEPARTMENT ||
      field.type === FieldsType.POSITION ||
      field.type === FieldsType.BRANCH)
  ) {
    return (
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-sm text-gray-700">
            {field.label} - Will be auto-filled from user profile
          </span>
        </div>
      </div>
    );
  }

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
                textAlign:
                  (field.style
                    ?.alignment as React.CSSProperties["textAlign"]) || "left",
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
            style={{
              textAlign:
                (field.style?.alignment as React.CSSProperties["textAlign"]) ||
                "center",
            }}
          >
            <Image
              src={field.content?.imageUrl || "https://placehold.co/600x400"}
              alt={field.content?.imageAlt || ""}
              width={600}
              height={400}
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "inline-block",
              }}
              unoptimized
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

// Type for organizational data items
interface OrganizationalItem {
  _id: string;
  name: string;
  code: string;
}

// Props interface for FormFieldSubmission component
interface FormFieldSubmissionProps {
  field: Field;
  control: Control<FieldValues>;
  error?: FieldError;
}

// Renders a form field for submission based on its type
// Used in form submission forms
export const FormFieldSubmission: React.FC<FormFieldSubmissionProps> = ({
  field,
  control,
  error,
}) => {
  const { user } = useAuth();

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
                            currentValues.filter((val) => val !== option.value),
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
          render={({
            field: formField,
            fieldState: { error: switchError },
          }) => (
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
              {switchError && (
                <p className="text-red-500 text-sm">
                  {switchError.message as string}
                </p>
              )}
            </div>
          )}
        />
      );

    case FieldsType.DEPARTMENT:
    case FieldsType.POSITION:
    case FieldsType.BRANCH:
      return (
        <OrganizationalFieldController
          field={field}
          control={control}
          error={error}
          user={user}
        />
      );
    case FieldsType.FILE:
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
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple={
                      field.validation?.maxFiles
                        ? field.validation.maxFiles > 1
                        : true
                    }
                    accept={field.validation?.allowedFileTypes?.join(",")}
                    onChange={(e) => {
                      const files = e.target.files;
                      formField.onChange(files);
                    }}
                    onBlur={formField.onBlur}
                    className="py-0 cursor-pointer"
                  />
                </div>
                {field.placeholder && (
                  <p className="text-xs text-gray-500">{field.placeholder}</p>
                )}
                {field.validation?.maxFileSize && (
                  <p className="text-xs text-gray-500">
                    Max file size:
                    {Math.round(field.validation.maxFileSize / 1024 / 1024)}MB
                  </p>
                )}
                {field.validation?.allowedFileTypes &&
                  field.validation.allowedFileTypes.length > 0 && (
                    <p className="text-xs text-gray-500">
                      Allowed types:
                      {field.validation.allowedFileTypes.join(", ")}
                    </p>
                  )}
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

    case FieldsType.TABLE:
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => {
            if (!field.tableConfig) {
              return (
                <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
                  <p className="font-semibold">Table Not Configured</p>
                  <p className="text-sm">
                    Please configure the table in the form builder.
                  </p>
                </div>
              );
            }

            return (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <EditableTableField
                  config={field.tableConfig}
                  value={formField.value}
                  onChange={formField.onChange}
                  disabled={false}
                />
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

    case FieldsType.SUBMITTER_INFO:
      return (
        <SubmitterInfoFieldController
          field={field}
          control={control}
          error={error}
          user={user}
        />
      );
    default:
      return null;
  }
};

// Helper to get user's value for a SubmitterInfoProperty
const getUserPropertyValue = (
  user: ReturnType<typeof useAuth>["user"],
  property: SubmitterInfoProperty,
): string | null => {
  if (!user?.user) return null;
  const u = user.user;

  switch (property) {
    case "firstname":
      return u.firstname || null;
    case "lastname":
      return u.lastname || null;
    case "fullName":
      return u.firstname && u.lastname ? `${u.firstname} ${u.lastname}` : null;
    case "email":
      return u.email || null;
    case "phone":
      return u.phone || null;
    case "payrollNo":
      return u.businessInformation?.payrollNo || null;
    case "businessUnit":
      return u.businessInformation?.businessUnit || null;
    case "businessUnitAddress":
      return u.businessInformation?.businessUnitAddress || null;
    case "paymentMethod":
      return u.businessInformation?.paymentMethod || null;
    case "department":
      return typeof u.departmentId === "object" && u.departmentId?._id
        ? u.departmentId._id
        : null;
    case "position":
      return typeof u.positionId === "object" && u.positionId?._id
        ? u.positionId._id
        : null;
    case "branch":
      return typeof u.branchId === "object" && u.branchId?._id
        ? u.branchId._id
        : null;
    case "manager":
      return null; // Not implemented yet
    default:
      return null;
  }
};

// Helper to get display value for user property (for auto-filled display)
const getUserPropertyDisplayValue = (
  user: ReturnType<typeof useAuth>["user"],
  property: SubmitterInfoProperty,
): string | null => {
  if (!user?.user) return null;
  const u = user.user;

  switch (property) {
    case "firstname":
      return u.firstname || null;
    case "lastname":
      return u.lastname || null;
    case "fullName":
      return u.firstname && u.lastname ? `${u.firstname} ${u.lastname}` : null;
    case "email":
      return u.email || null;
    case "phone":
      return u.phone || null;
    case "payrollNo":
      return u.businessInformation?.payrollNo || null;
    case "businessUnit":
      return u.businessInformation?.businessUnit || null;
    case "businessUnitAddress":
      return u.businessInformation?.businessUnitAddress || null;
    case "paymentMethod":
      return u.businessInformation?.paymentMethod === "weekly"
        ? "Weekly"
        : u.businessInformation?.paymentMethod === "monthly"
          ? "Monthly"
          : null;
    case "department":
      return typeof u.departmentId === "object" && u.departmentId?.name
        ? `${u.departmentId.name} (${u.departmentId.code})`
        : null;
    case "position":
      return typeof u.positionId === "object" && u.positionId?.name
        ? `${u.positionId.name} (${u.positionId.code})`
        : null;
    case "branch":
      return typeof u.branchId === "object" && u.branchId?.name
        ? `${u.branchId.name} (${u.branchId.code})`
        : null;
    case "manager":
      return null; // Not implemented yet
    default:
      return null;
  }
};

// Property labels for display - exported for use in UserForm
export const submitterInfoPropertyLabels: Record<
  SubmitterInfoProperty,
  string
> = {
  firstname: "First Name",
  lastname: "Last Name",
  fullName: "Full Name",
  email: "Email",
  phone: "Phone",
  payrollNo: "Payroll Number",
  businessUnit: "Business Unit",
  businessUnitAddress: "Business Unit Address",
  paymentMethod: "Payment Method",
  department: "Department",
  position: "Position",
  branch: "Branch",
  manager: "Manager",
};

// Field configuration for each SubmitterInfoProperty - shared between UserForm and FormFieldSubmission
export type SubmitterInfoFieldConfig = {
  type: "text" | "email" | "select" | "org-select";
  placeholder: string;
  options?: { value: string; label: string }[];
  orgType?: "department" | "position" | "branch";
};

export const submitterInfoFieldConfigs: Record<
  SubmitterInfoProperty,
  SubmitterInfoFieldConfig
> = {
  firstname: {
    type: "text",
    placeholder: "Enter first name",
  },
  lastname: {
    type: "text",
    placeholder: "Enter last name",
  },
  fullName: {
    type: "text",
    placeholder: "Enter full name",
  },
  email: {
    type: "email",
    placeholder: "Enter email address",
  },
  phone: {
    type: "text",
    placeholder: "Enter phone number",
  },
  payrollNo: {
    type: "text",
    placeholder: "Enter payroll number",
  },
  businessUnit: {
    type: "text",
    placeholder: "Enter business unit",
  },
  businessUnitAddress: {
    type: "text",
    placeholder: "Enter business unit address",
  },
  paymentMethod: {
    type: "select",
    placeholder: "Select payment method",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
    ],
  },
  department: {
    type: "org-select",
    placeholder: "Select department",
    orgType: "department",
  },
  position: {
    type: "org-select",
    placeholder: "Select position",
    orgType: "position",
  },
  branch: {
    type: "org-select",
    placeholder: "Select branch",
    orgType: "branch",
  },
  manager: {
    type: "text", // Placeholder until manager field is implemented
    placeholder: "Manager not implemented",
  },
};

// Shared render function props
interface RenderSubmitterInfoFieldProps {
  property: SubmitterInfoProperty;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  label?: string;
  // For org-select fields
  options?: { value: string; label: string }[];
  loading?: boolean;
}

// Shared render function that can be used by both UserForm and FormFieldSubmission
export const renderSubmitterInfoInput = ({
  property,
  value,
  onChange,
  onBlur,
  disabled,
  error,
  required,
  label,
  options,
  loading,
}: RenderSubmitterInfoFieldProps): React.ReactNode => {
  const config = submitterInfoFieldConfigs[property];
  const fieldLabel = label || submitterInfoPropertyLabels[property];

  // Render select for static options (paymentMethod)
  if (config.type === "select" && config.options) {
    return (
      <div className="w-full">
        <label className="text-sm font-medium mb-2 block">
          {fieldLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Select
          onValueChange={onChange}
          value={value || ""}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={config.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {config.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Render select for organizational fields (department, position, branch)
  if (config.type === "org-select") {
    return (
      <div className="w-full">
        <label className="text-sm font-medium mb-2 block">
          {fieldLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Select
          onValueChange={onChange}
          value={value || ""}
          disabled={disabled || loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loading ? "Loading..." : config.placeholder}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              {!loading && (!options || options.length === 0) && (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  No options available
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  // Render email or text input
  return (
    <div>
      <Input
        type={config.type === "email" ? "email" : "text"}
        name={property}
        label={
          <>
            {fieldLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </>
        }
        placeholder={config.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        errorMessage={error}
      />
    </div>
  );
};

// Get field config for a property - useful for UserForm to maintain consistency
export const getSubmitterInfoFieldConfig = (
  property: SubmitterInfoProperty,
) => {
  return {
    config: submitterInfoFieldConfigs[property],
    label: submitterInfoPropertyLabels[property],
  };
};

// Hook to load organizational options for a property
export const useOrgOptions = (property: SubmitterInfoProperty) => {
  const [options, setOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const config = submitterInfoFieldConfigs[property];
    if (config.type !== "org-select" || !config.orgType) return;

    const loadOptions = async () => {
      try {
        setLoading(true);
        let data: OrganizationalItem[] = [];

        if (config.orgType === "department") {
          const { API_DEPARTMENT } =
            await import("@/lib/services/Department/department_service");
          const response = await API_DEPARTMENT.getActiveDepartments();
          data = response.data;
        } else if (config.orgType === "position") {
          const { API_POSITION } =
            await import("@/lib/services/Position/position_service");
          const response = await API_POSITION.getActivePositions();
          data = response.data;
        } else if (config.orgType === "branch") {
          const { API_BRANCH } =
            await import("@/lib/services/Branch/branch_service");
          const response = await API_BRANCH.getActiveBranches();
          data = response.data;
        }

        const mappedOptions = data.map((item) => ({
          value: item._id,
          label: `${item.name} (${item.code})`,
        }));
        setOptions(mappedOptions);
      } catch (err) {
        console.error(`Error loading ${property} options:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [property]);

  return { options, loading };
};

// Props for SubmitterInfoFieldController
interface SubmitterInfoFieldControllerProps {
  field: Field;
  control: Control<FieldValues>;
  error?: FieldError;
  user: ReturnType<typeof useAuth>["user"];
}

// Controller component for SubmitterInfo fields
const SubmitterInfoFieldController: React.FC<
  SubmitterInfoFieldControllerProps
> = ({ field, control, error, user }) => {
  const property = field.submitterInfoConfig?.property || "fullName";
  const userValue = getUserPropertyValue(user, property);
  const displayValue = getUserPropertyDisplayValue(user, property);
  const propertyLabel = submitterInfoPropertyLabels[property];
  const config = submitterInfoFieldConfigs[property];

  // Use the shared hook for org options - only loads if property is org-select type
  const { options, loading } = useOrgOptions(property);

  // If user has the value, show auto-filled display
  if (userValue && displayValue) {
    return (
      <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500 text-white text-xs">Auto-filled</Badge>
          <span className="text-sm text-gray-700">
            {field.label || propertyLabel}: {displayValue}
          </span>
        </div>
      </div>
    );
  }

  // User doesn't have value - use shared render function via Controller
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField }) => (
        <>
          {renderSubmitterInfoInput({
            property,
            value: formField.value || "",
            onChange: formField.onChange,
            onBlur: formField.onBlur,
            error: error?.message,
            required: field.required,
            label: field.label || propertyLabel,
            options: config.type === "org-select" ? options : config.options,
            loading,
          })}
        </>
      )}
    />
  );
};

// Separate component for organizational fields to properly use hooks
interface OrganizationalFieldControllerProps {
  field: Field;
  control: Control<FieldValues>;
  error?: FieldError;
  user: ReturnType<typeof useAuth>["user"];
}

const OrganizationalFieldController: React.FC<
  OrganizationalFieldControllerProps
> = ({ field, control, error, user }) => {
  const [options, setOptions] = React.useState<
    Array<{ value: string; label: string }>
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [userHasValue, setUserHasValue] = React.useState(false);

  const fieldType = field.type;

  // Load current user for autofill check
  React.useEffect(() => {
    if (user) {
      const submittingUser = user.user;
      // Check if user has this organizational field
      if (fieldType === FieldsType.DEPARTMENT && submittingUser.departmentId) {
        setUserHasValue(true);
      } else if (
        fieldType === FieldsType.POSITION &&
        submittingUser.positionId
      ) {
        setUserHasValue(true);
      } else if (fieldType === FieldsType.BRANCH && submittingUser.branchId) {
        setUserHasValue(true);
      }
    }
  }, [user, fieldType]);

  React.useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        let data: OrganizationalItem[] = [];

        if (fieldType === FieldsType.DEPARTMENT) {
          const { API_DEPARTMENT } =
            await import("@/lib/services/Department/department_service");
          const response = await API_DEPARTMENT.getActiveDepartments();
          data = response.data;
        } else if (fieldType === FieldsType.POSITION) {
          const { API_POSITION } =
            await import("@/lib/services/Position/position_service");
          const response = await API_POSITION.getActivePositions();
          data = response.data;
        } else if (fieldType === FieldsType.BRANCH) {
          const { API_BRANCH } =
            await import("@/lib/services/Branch/branch_service");
          const response = await API_BRANCH.getActiveBranches();
          data = response.data;
        }

        const mappedOptions = data.map((item) => ({
          value: item._id,
          label: `${item.name} (${item.code})`,
        }));

        setOptions(mappedOptions);
      } catch (err) {
        console.error(`Error loading ${fieldType} options:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [fieldType]);

  // If autofill is enabled and user has value, hide the field (backend will handle it)
  if (field.autofill && userHasValue) {
    return (
      <div className="w-full p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500 text-white text-xs">Auto-filled</Badge>
          <span className="text-sm text-gray-700">
            {field.label} will be automatically filled from your profile
          </span>
        </div>
      </div>
    );
  }

  // If autofill is enabled but user doesn't have value, show field as required
  const isRequired = field.autofill && !userHasValue ? true : field.required;
  const helperText =
    field.autofill && !userHasValue
      ? `Please select your ${field.label?.toLowerCase()} (not set in your profile)`
      : null;

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: formField }) => (
        <div className="w-full">
          <label className="text-sm font-medium mb-2 block">
            {field.label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          {helperText && (
            <p className="text-sm text-amber-600 mb-2">{helperText}</p>
          )}
          <Select
            onValueChange={formField.onChange}
            value={formField.value || ""}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  loading
                    ? "Loading..."
                    : field.placeholder || `Select ${field.label}...`
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
                {!loading && options.length === 0 && (
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    No {field.label?.toLowerCase()}s available
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {error && (
            <p className="text-red-500 text-sm mt-1">
              {error.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
};

// Legacy function wrapper for backwards compatibility
export const renderFormFieldSubmission = (
  field: Field,
  control: Control<FieldValues>,
  error?: FieldError,
) => {
  return <FormFieldSubmission field={field} control={control} error={error} />;
};

// Type for submitted field values
export type SubmittedFieldValue =
  | string
  | number
  | boolean
  | string[]
  | { name: string; code: string }
  | File
  | File[]
  | Record<string, unknown>[]
  | EditableTableConfig
  | null
  | undefined;

// Type guard for organizational field values (department, position, branch)
function isOrgFieldValue(val: unknown): val is { name: string; code: string } {
  return (
    typeof val === "object" &&
    val !== null &&
    "name" in val &&
    "code" in val &&
    typeof (val as { name: string }).name === "string" &&
    typeof (val as { code: string }).code === "string"
  );
}

// Type guard for EditableTableConfig
function isEditableTableConfig(val: unknown): val is EditableTableConfig {
  return (
    typeof val === "object" &&
    val !== null &&
    "columns" in val &&
    "rows" in val &&
    Array.isArray((val as EditableTableConfig).columns) &&
    Array.isArray((val as EditableTableConfig).rows)
  );
}

// Helper to convert value to string for display
function valueToString(val: SubmittedFieldValue): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) return val.map((v) => String(v)).join(", ");
  if (isOrgFieldValue(val)) return `${val.name} (${val.code})`;
  return String(val);
}

// Renders the submitted value of a field based on its type
// Used in form submission review or detail views
export const renderSubmittedFieldValue = (
  field: Field,
  value: SubmittedFieldValue,
) => {
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
          <span className="text-secondary">{valueToString(value)}</span>
        </div>
      );

    case FieldsType.EMAIL:
      return (
        <div className="py-2 flex items-center gap-2">
          <a
            href={`mailto:${valueToString(value)}`}
            className=" hover:underline"
          >
            {valueToString(value)}
          </a>
        </div>
      );

    case FieldsType.NUMBER:
      return (
        <div className="py-2 ">
          <span className="font-mono ">{valueToString(value)}</span>
        </div>
      );

    case FieldsType.DATE:
      return (
        <div className="py-2  flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pumpkin" />
          <span className="">
            {formatDatesWithYear(
              typeof value === "string" ? value : String(value ?? ""),
            )}
          </span>
        </div>
      );

    case FieldsType.TEXT_AREA:
      return (
        <div className="py-3">
          <p className="whitespace-pre-wrap leading-relaxed">
            {valueToString(value)}
          </p>
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
            {selectedOption?.label || valueToString(value)}
          </span>
        </div>
      );

    case FieldsType.RADIO:
      const selectedRadioOption = field.options?.find(
        (opt) => opt.value === value,
      );
      return (
        <div className="inline-flex items-center gap-2 py-2  ">
          <CircleCheckBigIcon className="w-4 h-4 text-pumpkin" />
          <span className="">
            {selectedRadioOption?.label || valueToString(value)}
          </span>
        </div>
      );

    case FieldsType.CHECKBOX:
      // Handle array of values (multiple checkboxes)
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((val, idx) => {
              const valStr = typeof val === "string" ? val : String(val);
              const option = field.options?.find((opt) => opt.value === val);
              return (
                <div
                  key={valStr || idx}
                  className="inline-flex items-center gap-2 py-1.5 "
                >
                  <SquareCheckBigIcon className="w-4 h-4 text-pumpkin" />
                  <span className="">{option?.label || valStr}</span>
                </div>
              );
            })}
          </div>
        );
      }
      // Handle single boolean value
      return (
        <div
          className={`inline-flex items-center gap-2 py-2  rounded-md border `}
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

    case FieldsType.DEPARTMENT:
    case FieldsType.POSITION:
    case FieldsType.BRANCH:
      // Display organizational field value with icon
      if (value && isOrgFieldValue(value)) {
        // If populated with full object
        return (
          <Badge variant="ghost" className="text-sm">
            {value.name} ({value.code})
          </Badge>
        );
      } else if (value) {
        // If just the ID is stored
        return (
          <Badge variant="ghost" className="text-sm">
            {valueToString(value)}
          </Badge>
        );
      }
      return null;

    case FieldsType.FILE:
      // Handle array of file URLs or file objects
      if (Array.isArray(value)) {
        const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST;
        return (
          <div className="flex flex-wrap gap-2">
            {value.map((file, index) => {
              let fileName: string;
              let fileUrl: string;

              if (typeof file === "string") {
                fileName = file.split("/").pop() || "file";
                fileUrl = file;
              } else if (file instanceof File) {
                fileName = file.name;
                fileUrl = URL.createObjectURL(file);
              } else if (typeof file === "object" && file !== null) {
                // Handle Record<string, unknown> type
                const fileObj = file as Record<string, unknown>;
                fileName = String(fileObj.name || "file");
                fileUrl = String(fileObj.url || "");
              } else {
                fileName = "file";
                fileUrl = "";
              }

              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 py-2 px-3 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <FileIcon className="w-4 h-4 text-pumpkin" />
                  <a
                    href={BACKEND_HOST + fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {fileName}
                  </a>
                </div>
              );
            })}
          </div>
        );
      }
      // Handle single file
      if (typeof value === "string") {
        const fileName = value.split("/").pop() || "file";
        return (
          <div className="inline-flex items-center gap-2 py-2 px-3 bg-gray-50 border border-gray-200 rounded-md">
            <FileIcon className="w-4 h-4 text-pumpkin" />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              {fileName}
            </a>
          </div>
        );
      }
      if (value instanceof File) {
        const fileName = value.name;
        const fileUrl = URL.createObjectURL(value);
        return (
          <div className="inline-flex items-center gap-2 py-2 px-3 bg-gray-50 border border-gray-200 rounded-md">
            <FileIcon className="w-4 h-4 text-pumpkin" />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              {fileName}
            </a>
          </div>
        );
      }
      return null;

    case FieldsType.TABLE:
      // Display submitted table data in a read-only view
      if (!value || !field.tableConfig || !isEditableTableConfig(value)) {
        return (
          <div className="py-2 text-gray-400 italic">No data submitted</div>
        );
      }

      return (
        <div className="py-2">
          <EditableTableField
            config={value}
            value={value}
            onChange={() => {}}
            disabled={true}
          />
        </div>
      );

    case FieldsType.SUBMITTER_INFO:
      return (
        <div className="py-2  ">
          <span className="text-secondary">{valueToString(value)}</span>
        </div>
      );
    default:
      return (
        <div className="py-2">
          <span className="text-gray-900">{valueToString(value)}</span>
        </div>
      );
  }
};
