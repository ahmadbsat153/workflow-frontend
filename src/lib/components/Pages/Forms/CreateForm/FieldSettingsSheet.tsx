"use client";

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
import { Form } from "@/lib/ui/form";
import { Button } from "@/lib/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldsType } from "@/lib/types/form/fields";
import { EyeIcon, ListIcon, Settings2, SquareCheckBigIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs";
import FieldProperties from "@/lib/components/Tabs/Fields/FieldProperties";
import { buildFieldSettingsSchema } from "@/utils/Validation/fieldValidationSchema";
import FieldValidation from "@/lib/components/Tabs/Fields/FieldValidation";
import FieldOptions from "@/lib/components/Tabs/Fields/FieldOptions";
import FieldDisplay from "@/lib/components/Tabs/Fields/FieldDisplay";

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

  const schema = buildFieldSettingsSchema(field);
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
        minLength: field.validation?.minLength,
        maxLength: field.validation?.maxLength,
        min: field.validation?.min,
        max: field.validation?.max,
        pattern: field.validation?.pattern,
      },
      display: {
        showInTable: field.display?.showInTable ?? true, 
        showInForm: field.display?.showInForm ?? true, 
        showInDetail: field.display?.showInDetail ?? true,
        sensitiveInfo: field.display?.sensitiveInfo ?? false,
      },
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
      display: values.display,
    };

    if (onUpdate) {
      onUpdate(updatedField);
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            {/* Fixed Header */}
            <SheetHeader className="gap-1 px-6 pt-6 pb-4 border-b shrink-0">
              <SheetTitle>{field.label} Settings</SheetTitle>
              <SheetDescription className="text-muted-foreground text-base">
                Configure field properties and validation rules
              </SheetDescription>
            </SheetHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6">
              <Tabs defaultValue="setting" className="mt-5">
                <TabsList className="sticky top-0 z-10">
                  <TabsTrigger value="setting" className="cursor-pointer">
                    <Settings2 className="!size-4" />
                    settings
                  </TabsTrigger>
                  <TabsTrigger value="validation" className="cursor-pointer">
                    <SquareCheckBigIcon className="!size-4" />
                    validation
                  </TabsTrigger>
                  {(field.type === FieldsType.SELECT ||
                    field.type === FieldsType.CHECKBOX ||
                    field.type === FieldsType.RADIO) && (
                    <TabsTrigger value="options" className="cursor-pointer">
                      <ListIcon className="!size-4" />
                      options
                    </TabsTrigger>
                  )}

                  <TabsTrigger value="display" className="cursor-pointer">
                    <EyeIcon className="!size-4" />
                    display
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="setting">
                  <div className="py-4">
                    <FieldProperties
                      field={field}
                      form={form}
                      loading={loading}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="validation">
                  <div className="py-4">
                    <FieldValidation
                      field={field}
                      form={form}
                      loading={loading}
                    />
                  </div>
                </TabsContent>

                {(field.type === FieldsType.SELECT ||
                  field.type === FieldsType.CHECKBOX ||
                  field.type === FieldsType.RADIO) && (
                  <TabsContent value="options">
                    <FieldOptions field={field} form={form} loading={loading} />
                  </TabsContent>
                )}

                <TabsContent value="display">
                  <div className="py-4">
                    <FieldDisplay field={field} form={form} loading={loading} />
                  </div>
                </TabsContent>
              </Tabs>
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
