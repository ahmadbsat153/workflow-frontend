"use client";

import { Field } from "@/lib/types/form/fields";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/lib/ui/form";
import { Switch } from "@/lib/ui/switch";
import { UseFormReturn } from "react-hook-form";

type Props = {
  field: Field;
  form: UseFormReturn<any>;
  loading: boolean | undefined;
};

const FieldDisplay = ({ form, field, loading }: Props) => {
  console.log(field);

  return (
    <div className="flex-1 space-y-4">
      <h3 className="text-lg font-semibold">Display Settings</h3>
      <p className="text-sm text-muted-foreground">
        Control where and how this field appears in your application
      </p>
      {/* Show in Table */}
      <FormField
        control={form.control}
        name="display.showInTable"
        render={({ field }) => {
          console.log(field);
          return (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show in Table</FormLabel>
                <FormDescription>
                  Display this field in table/list views
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
          );
        }}
      />{" "}
      <FormField
        control={form.control}
        name="display.showInForm"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Show in Form</FormLabel>
              <FormDescription>
                Display this field when creating or editing records
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
      {/* Show in Detail */}
      <FormField
        control={form.control}
        name="display.showInDetail"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Show in Detail</FormLabel>
              <FormDescription>
                Display this field in detail/preview views
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
      {/* Sensitive Info */}
      <FormField
        control={form.control}
        name="display.sensitiveInfo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Sensitive Information</FormLabel>
              <FormDescription>
                Mark this field as containing sensitive data (e.g., salary,
                passwords)
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
    </div>
  );
};

export default FieldDisplay;
