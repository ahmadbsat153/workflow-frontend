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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                    <span className="text-destructive ml-1">*</span>
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
                {field.supportsTemplate && (
                  <FormDescription className="text-xs text-blue-600">
                    💡 Supports template variables like {`{{fieldName}}`}
                  </FormDescription>
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
