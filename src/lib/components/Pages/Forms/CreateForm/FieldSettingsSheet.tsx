"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/ui/sheet";
import {
  EyeIcon,
  ListIcon,
  Settings2,
  SquareCheckBigIcon,
  PaletteIcon,
  TypeIcon,
} from "lucide-react";

import {
  isDisplayElement,
  getFieldTypeLabel,
} from "@/lib/constants/formFields";

import { z } from "zod";
import { useState } from "react";
import { Form } from "@/lib/ui/form";
import { Button } from "@/lib/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldsType } from "@/lib/types/form/fields";
import TableConfig from "@/lib/components/Tabs/Fields/TableConfig";
import FieldOptions from "@/lib/components/Tabs/Fields/FieldOptions";
import FieldDisplay from "@/lib/components/Tabs/Fields/FieldDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import FieldProperties from "@/lib/components/Tabs/Fields/FieldProperties";
import FieldValidation from "@/lib/components/Tabs/Fields/FieldValidation";
import DisplayElementStyle from "@/lib/components/Tabs/Fields/DisplayElementStyle";
import { buildFieldSettingsSchema } from "@/utils/Validation/fieldValidationSchema";
import DisplayElementContent from "@/lib/components/Tabs/Fields/DisplayElementContent";

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

  const isDisplay = isDisplayElement(field.type);
  const schema = buildFieldSettingsSchema(field);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: isDisplay
      ? ({
          name: field.name,
          content: {
            text: field.content?.text || "",
            html: field.content?.html || "",
            imageUrl: field.content?.imageUrl || "",
            imageAlt: field.content?.imageAlt || "",
            level: field.content?.level || 2,
            height: field.content?.height || 30,
            alertType: field.content?.alertType || "info",
          },
          style: {
            fontSize: field.style?.fontSize || "",
            fontWeight: field.style?.fontWeight || "",
            color: field.style?.color || "",
            backgroundColor: field.style?.backgroundColor || "",
            alignment: field.style?.alignment || "left",
            padding: field.style?.padding || "",
            margin: field.style?.margin || "",
            borderStyle: field.style?.borderStyle || "solid",
            borderWidth: field.style?.borderWidth || "1px",
            borderColor: field.style?.borderColor || "#e5e7eb",
          },
        } as FormValues)
      : ({
          name: field.name,
          label: field.label,
          placeholder: field.placeholder || "",
          required: field.required,
          defaultValue: field.defaultValue,
          autofill: field.autofill,
          validation: {
            minLength: field.validation?.minLength,
            maxLength: field.validation?.maxLength,
            min: field.validation?.min,
            max: field.validation?.max,
            pattern: field.validation?.pattern,
            minSelections: field.validation?.minSelections,
            maxSelections: field.validation?.maxSelections,
            minFiles: field.validation?.minFiles,
            maxFiles: field.validation?.maxFiles,
            maxFileSize: field.validation?.maxFileSize,
            allowedFileTypes: field.validation?.allowedFileTypes,
          },
          display: {
            showInTable: field.display?.showInTable ?? true,
            showInForm: field.display?.showInForm ?? true,
            showInDetail: field.display?.showInDetail ?? true,
            sensitiveInfo: field.display?.sensitiveInfo ?? false,
          },
          options: field.options || [],
          tableConfig: field.tableConfig,
        } as FormValues),
  });

  const onSubmit = (values: FormValues) => {
    setLoading(true);

    let updatedField: Field;

    if (isDisplay) {
      // For display elements
      const displayValues = values as {
        name: string;
        content?: object;
        style?: object;
      };

      updatedField = {
        ...field,
        name: displayValues.name,
        content: {
          ...field.content,
          ...displayValues.content,
        },
        style: {
          ...field.style,
          ...displayValues.style,
        },
      };
    } else {
      // For input fields
      const inputValues = values as Field;

      updatedField = {
        ...field,
        name: inputValues.name,
        label: inputValues.label,
        placeholder: inputValues.placeholder,
        required: inputValues.required,
        defaultValue: inputValues.defaultValue,
        validation: inputValues.validation || {},
        options: inputValues.options || field.options,
        display: inputValues.display,
        autofill: inputValues.autofill,
        tableConfig: inputValues.tableConfig,
      };
    }

    if (onUpdate) {
      onUpdate(updatedField);
    }

    setLoading(false);
    setOpen(false);
  };

  // Get display title
  const getSheetTitle = () => {
    if (isDisplay) {
      return `${getFieldTypeLabel(field.type)} Settings`;
    }
    return `${field.label} Settings`;
  };

  // Get sheet description
  const getSheetDescription = () => {
    if (isDisplay) {
      return "Configure content and styling for this display element";
    }
    return "Configure field properties and validation rules";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl flex flex-col p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            {/* Fixed Header */}
            <SheetHeader className="gap-1 px-6 pt-6 pb-4 border-b shrink-0">
              <SheetTitle>{getSheetTitle()}</SheetTitle>
              <SheetDescription className="text-muted-foreground text-base">
                {getSheetDescription()}
              </SheetDescription>
            </SheetHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6">
              {isDisplay ? (
                // Display Element Tabs
                <Tabs defaultValue="content" className="mt-5">
                  <TabsList className="sticky top-0 z-10">
                    <TabsTrigger value="content" className="cursor-pointer">
                      <TypeIcon className="!size-4" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="style" className="cursor-pointer">
                      <PaletteIcon className="!size-4" />
                      Style
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content">
                    <div className="py-4">
                      <DisplayElementContent
                        field={field}
                        form={form}
                        loading={loading}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="style">
                    <div className="py-4">
                      <DisplayElementStyle
                        field={field}
                        form={form}
                        loading={loading}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              ) : field.type === FieldsType.TABLE ? (
                <Tabs
                  defaultValue={
                    field.type === FieldsType.TABLE ? "table" : "setting"
                  }
                  className=""
                >
                  <TabsContent value="table">
                    <div className="py-4">
                      <TableConfig
                        field={field}
                        form={form}
                        loading={loading}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="setting">
                    <div className="py-4">
                      <FieldProperties
                        field={field}
                        form={form}
                        loading={loading}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                // Input Field Tabs
                <Tabs defaultValue={"setting"} className="mt-5">
                  <TabsList className="sticky top-0 z-10">
                    <TabsTrigger value="setting" className="cursor-pointer">
                      <Settings2 className="!size-4" />
                      Settings
                    </TabsTrigger>

                    {!(
                      field.type === FieldsType.SELECT ||
                      field.type === FieldsType.RADIO ||
                      field.type === FieldsType.SWITCH
                    ) && (
                      <TabsTrigger
                        value="validation"
                        className="cursor-pointer"
                      >
                        <SquareCheckBigIcon className="!size-4" />
                        Validation
                      </TabsTrigger>
                    )}
                    {(field.type === FieldsType.SELECT ||
                      field.type === FieldsType.CHECKBOX ||
                      field.type === FieldsType.RADIO) && (
                      <TabsTrigger value="options" className="cursor-pointer">
                        <ListIcon className="!size-4" />
                        Options
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="display" className="cursor-pointer">
                      <EyeIcon className="!size-4" />
                      Display
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="table">
                    <div className="py-4">
                      <TableConfig
                        field={field}
                        form={form}
                        loading={loading}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="setting">
                    <div className="py-4">
                      <FieldProperties
                        field={field}
                        form={form}
                        loading={loading}
                      />
                    </div>
                  </TabsContent>

                  {!(
                    field.type === FieldsType.SELECT ||
                    field.type === FieldsType.RADIO ||
                    field.type === FieldsType.SWITCH
                  ) && (
                    <TabsContent value="validation">
                      <div className="py-4">
                        <FieldValidation
                          field={field}
                          form={form}
                          loading={loading}
                        />
                      </div>
                    </TabsContent>
                  )}

                  {(field.type === FieldsType.SELECT ||
                    field.type === FieldsType.CHECKBOX ||
                    field.type === FieldsType.RADIO) && (
                    <TabsContent value="options">
                      <FieldOptions
                        field={field}
                        form={form}
                        loading={loading}
                      />
                    </TabsContent>
                  )}

                  <TabsContent value="display">
                    <div className="py-4">
                      <FieldDisplay
                        field={field}
                        form={form}
                        loading={loading}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>

            {/* Fixed Footer */}
            <div className="px-6 py-4 border-t bg-background shrink-0">
              <div className="flex justify-end gap-2">
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
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default FieldSettingsSheet;
