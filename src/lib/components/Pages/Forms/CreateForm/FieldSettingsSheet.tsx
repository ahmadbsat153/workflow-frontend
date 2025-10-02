"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/lib/ui/form";
// import { Textarea } from "@/lib/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/ui/sheet";

import { z } from "zod";
import { useState } from "react";
import { Input } from "@/lib/ui/input";
import { Button } from "@/lib/ui/button";
import { Switch } from "@/lib/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldsType } from "@/lib/types/form/fields";

type FieldSettingsSheetProps = {
  field: Field;
  children: React.ReactNode;
  onUpdate?: (updatedField: Field) => void;
};

const FieldSettingsSheet = ({
  field,
  children,
  onUpdate,
}: FieldSettingsSheetProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic schema based on field type
  const getFieldSchema = () => {
    const baseSchema = {
      name: z.string().min(1, "Field name is required"),
      label: z.string().min(1, "Label is required"),
      placeholder: z.string().optional(),
      required: z.boolean(),
      defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
    };

    const validationSchema: Record<string, z.ZodTypeAny> = {};

    // Add validation fields based on field type
    switch (field.type) {
      case FieldsType.TEXT:
      case FieldsType.TEXT_AREA:
      case FieldsType.EMAIL:
        validationSchema.minLength = z
          .string()
          .transform((val) => (val === "" ? undefined : Number(val)))
          .optional();
        validationSchema.maxLength = z
          .string()
          .transform((val) => (val === "" ? undefined : Number(val)))
          .optional();
        if (field.type === FieldsType.EMAIL) {
          validationSchema.pattern = z.string().optional();
        }
        break;

      case FieldsType.NUMBER:
        validationSchema.min = z
          .string()
          .transform((val) => (val === "" ? undefined : Number(val)))
          .optional();
        validationSchema.max = z
          .string()
          .transform((val) => (val === "" ? undefined : Number(val)))
          .optional();
        break;

      case FieldsType.SELECT:
      case FieldsType.RADIO:
        validationSchema.options = z
          .array(z.string())
          .min(1, "At least one option is required");
        break;
    }

    return z.object({
      ...baseSchema,
      validation: z.object(validationSchema).optional(),
      ...(validationSchema.options ? { options: validationSchema.options } : {}),
    });
  };

  const schema = getFieldSchema();
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: field.name,
      label: field.label,
      placeholder: field.placeholder || "",
      required: field.required,
      defaultValue: field.defaultValue,
      validation: {
        minLength: field.validation?.minLength?.toString() || "",
        maxLength: field.validation?.maxLength?.toString() || "",
        min: field.validation?.min?.toString() || "",
        max: field.validation?.max?.toString() || "",
        pattern: field.validation?.pattern || "",
      } as any,
      options: field.options || [],
    } as FormValues,
  });

  const onSubmit = (values: FormValues) => {
    setLoading(true);
    
    const updatedField: Field = {
      ...field,
      name: values.name,
      label: values.label,
      placeholder: values.placeholder,
      required: values.required,
      defaultValue: values.defaultValue,
      validation: values.validation || {},
      options: (values as any).options || field.options,
    };

    console.log("Updated Field:", JSON.stringify(updatedField, null, 2));
    
    if (onUpdate) {
      onUpdate(updatedField);
    }
    
    setLoading(false);
    setOpen(false);
  };

  // Dynamic options management for SELECT and RADIO
  const [optionInput, setOptionInput] = useState("");

  const addOption = () => {
    if (optionInput.trim()) {
      const currentOptions = form.getValues("options" as any) || [];
      form.setValue("options" as any, [...currentOptions, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = form.getValues("options" as any) || [];
    form.setValue(
      "options" as any,
      currentOptions.filter((_: string, i: number) => i !== index)
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="gap-1 w-full">
          <SheetTitle>{field.label} Settings</SheetTitle>
          <SheetDescription className="text-muted-foreground text-base">
            Configure field properties and validation rules
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Fields */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="field_name"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this field
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter label"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter placeholder text"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Required Field</FormLabel>
                      <FormDescription>
                        Make this field mandatory
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Validation Rules */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Validation Rules</h3>

                {/* Text/TextArea/Email validations */}
                {(field.type === FieldsType.TEXT ||
                  field.type === FieldsType.TEXT_AREA ||
                  field.type === FieldsType.EMAIL) && (
                  <>
                    <FormField
                      control={form.control}
                      name="validation.minLength"
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Minimum Length</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              value={formField.value as string}
                              onChange={formField.onChange}
                              onBlur={formField.onBlur}
                              name={formField.name}
                              ref={formField.ref}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="validation.maxLength"
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Maximum Length</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100"
                              value={formField.value as string}
                              onChange={formField.onChange}
                              onBlur={formField.onBlur}
                              name={formField.name}
                              ref={formField.ref}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Email pattern validation */}
                {field.type === FieldsType.EMAIL && (
                  <FormField
                    control={form.control}
                    name="validation.pattern"
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>Pattern (Regex)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="^[^@]+@[^@]+\.[^@]+$"
                            value={formField.value as string}
                            onChange={formField.onChange}
                            onBlur={formField.onBlur}
                            name={formField.name}
                            ref={formField.ref}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription>
                          Regular expression for validation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Number validations */}
                {field.type === FieldsType.NUMBER && (
                  <>
                    <FormField
                      control={form.control}
                      name="validation.min"
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Minimum Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              value={formField.value as string}
                              onChange={formField.onChange}
                              onBlur={formField.onBlur}
                              name={formField.name}
                              ref={formField.ref}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="validation.max"
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>Maximum Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="999"
                              value={formField.value as string}
                              onChange={formField.onChange}
                              onBlur={formField.onBlur}
                              name={formField.name}
                              ref={formField.ref}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Options for SELECT and RADIO */}
                {/* {(field.type === FieldsType.SELECT ||
                  field.type === FieldsType.RADIO) && (
                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options</FormLabel>
                        <div className="space-y-2">
                          {field.value?.map((option: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 border rounded"
                            >
                              <span className="flex-1">{option}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(index)}
                                disabled={loading}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add new option"
                              value={optionInput}
                              onChange={(e) => setOptionInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addOption();
                                }
                              }}
                              disabled={loading}
                            />
                            <Button
                              type="button"
                              onClick={addOption}
                              disabled={loading}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )} */}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FieldSettingsSheet;