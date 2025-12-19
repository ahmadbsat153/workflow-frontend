"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";

import { z } from "zod";
import { Input } from "@/lib/ui/input";
import React, { useEffect } from "react";
import { Button } from "@/lib/ui/button";
import { Switch } from "@/lib/ui/switch";
import { useForm } from "react-hook-form";
import { Textarea } from "@/lib/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionConfigField } from "@/lib/types/actions/action";
import { FieldTemplate } from "@/lib/types/form/form";
import { TemplateInput } from "./TemplateInput";
import { UserFieldInput } from "./UserFieldInput";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import { InfoIcon } from "lucide-react";

type DynamicConfigFormProps = {
  fields: ActionConfigField[];
  initialConfig?: Record<string, any>;
  onSubmit: (config: Record<string, any>) => void;
  onCancel?: () => void;
  nodeId?: string;
  availableTemplates?: FieldTemplate[];
};

const buildDynamicSchema = (fields: ActionConfigField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "text":
      case "email":
      case "textarea":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = z.string().min(1, `${field.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      case "number":
        fieldSchema = z.coerce.number();
        if (field.required) {
          fieldSchema = fieldSchema;
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      case "boolean":
        fieldSchema = z.boolean().default(false);
        break;

      case "select":
        fieldSchema = z.string();

        if (field.required) {
          fieldSchema = z.string().min(1, `${field.label} is required`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      case "attachment":
        fieldSchema = z.any();
        if (field.required) {
          fieldSchema = z
            .any()
            .refine(
              (val) => val && (val instanceof FileList ? val.length > 0 : true),
              {
                message: `${field.label} is required`,
              }
            );
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      case "user":
        fieldSchema = z.object({
          mode: z.enum([
            "direct_email",
            "department",
            "position_in_department",
            "position_from_form",
            "position_any_dept",
            "position_in_submitter_dept",
            "branch",
            "branch_from_form",
          ]),
          email: z.string().optional(),
          emails: z.array(z.string()).optional(),
          departmentId: z.string().optional(),
          positionId: z.string().optional(),
          formFieldName: z.string().optional(),
          branchId: z.string().optional(),
        });

        if (field.required) {
          fieldSchema = fieldSchema.refine(
            (val: any) => {
              // Validate based on mode
              if (val.mode === "direct_email") {
                // Support both new emails array and legacy email field
                return (val.emails && val.emails.length > 0) || !!val.email;
              }
              if (val.mode === "department") return !!val.departmentId;
              if (val.mode === "position_in_department")
                return !!val.departmentId && !!val.positionId;
              if (val.mode === "position_from_form") return !!val.formFieldName;
              if (val.mode === "position_any_dept") return !!val.positionId;
              if (val.mode === "position_in_submitter_dept")
                return !!val.positionId;
              if (val.mode === "branch") return !!val.branchId;
              if (val.mode === "branch_from_form") return !!val.formFieldName;
              return false;
            },
            { message: `${field.label} configuration is incomplete` }
          );
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;

      default:
        fieldSchema = z.any();
    }

    shape[field.name] = fieldSchema;
  });

  return z.object(shape);
};

export const DynamicConfigForm = ({
  fields,
  initialConfig = {},
  onSubmit,
  onCancel,
  nodeId,
  availableTemplates = [],
}: DynamicConfigFormProps) => {
  const schema = buildDynamicSchema(fields);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialConfig as FormValues,
  });

  useEffect(() => {
    form.reset(initialConfig as FormValues);
  }, [nodeId, initialConfig, form]);

  const handleSubmit = (data: FormValues) => {
    onSubmit(data as Record<string, any>);
  };

  if (fields.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No configuration required for this action
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 overflow-y-scroll"
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && (
                    <span className="text-destructive">*</span>
                  )}
                  {field.supportsTemplate && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <InfoIcon className="size-5 text-blue-500 ml-[-20px]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-secondary">
                          Supports template variables like {`{{fieldName}}`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </FormLabel>
                <FormControl>
                  {field.type === "textarea" ? (
                    field.supportsTemplate ? (
                      <TemplateInput
                        type="textarea"
                        placeholder={field.placeholder}
                        value={formField.value as string | number | undefined}
                        onChange={formField.onChange}
                        onBlur={formField.onBlur}
                        name={formField.name}
                        templates={availableTemplates}
                        rows={4}
                      />
                    ) : (
                      <Textarea
                        placeholder={field.placeholder}
                        name={formField.name}
                        onChange={formField.onChange}
                        onBlur={formField.onBlur}
                        value={
                          formField.value as
                            | string
                            | number
                            | readonly string[]
                            | undefined
                        }
                        rows={4}
                      />
                    )
                  ) : field.type === "boolean" ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formField.value as boolean}
                        onCheckedChange={formField.onChange}
                      />
                      <span className="text-sm text-muted-foreground">
                        {field.actionDescription}
                      </span>
                    </div>
                  ) : field.type === "select" && field.options ? (
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value as string}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={field.placeholder || "Select..."}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "attachment" ? (
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          formField.onChange(files);
                        }}
                        onBlur={formField.onBlur}
                        className="py-0 cursor-pointer"
                      />
                      {field.placeholder && (
                        <p className="text-xs text-gray-500">
                          {field.placeholder}
                        </p>
                      )}
                    </div>
                  ) : field.type === "user" ? (
                    <UserFieldInput
                      value={formField.value as any}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      availableTemplates={availableTemplates}
                      placeholder={field.placeholder}
                    />
                  ) : field.supportsTemplate ? (
                    <TemplateInput
                      type={field.type as "text" | "email"}
                      placeholder={field.placeholder}
                      value={formField.value as string | number | undefined}
                      onChange={formField.onChange}
                      onBlur={formField.onBlur}
                      name={formField.name}
                      templates={availableTemplates}
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...formField}
                      value={formField.value as string | number}
                    />
                  )}
                </FormControl>
                {field.actionDescription && field.type !== "boolean" && (
                  <FormDescription>{field.actionDescription}</FormDescription>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Save Configuration</Button>
        </div>
      </form>
    </Form>
  );
};
