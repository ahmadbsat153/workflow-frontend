"use client";

import { Field, FieldsType } from "@/lib/types/form/fields";
import {
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
import { Input } from "@/lib/ui/input";
import { Switch } from "@/lib/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { submitterInfoPropertyOptions } from "@/lib/constants/formFields";

type Props = {
  field: Field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  loading: boolean | undefined;
};

const FieldProperties = ({ form, field, loading }: Props) => {
  return (
    <div className="flex-1 space-y-4">
      <h3 className="text-lg font-semibold">Field Settings</h3>

      {/* Submitter Info property selector */}
      {field.type === FieldsType.SUBMITTER_INFO && (
        <FormField
          control={form.control}
          name="submitterInfoConfig.property"
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>User Property</FormLabel>
              <Select
                onValueChange={formField.onChange}
                value={formField.value || "fullName"}
                disabled={loading}
              >
                <FormControl className="!w-full">
                  <SelectTrigger className="w-full">
                    <SelectValue
                      className="w-full"
                      placeholder="Select property to extract"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="w-full">
                  {submitterInfoPropertyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select which user property to display in this field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {/* Basic Fields */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="hidden">
            <FormLabel>Field Name</FormLabel>
            <FormControl>
              <Input placeholder="field_name" {...field} disabled={loading} />
            </FormControl>
            <FormDescription>Unique identifier for this field</FormDescription>
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
              <Input placeholder="Enter label" {...field} disabled={loading} />
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
              <FormDescription>Make this field mandatory</FormDescription>
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

      {/* Autofill option for organizational fields */}
      {(field.type === FieldsType.DEPARTMENT ||
        field.type === FieldsType.POSITION ||
        field.type === FieldsType.BRANCH) && (
        <FormField
          control={form.control}
          name="autofill"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Autofill from User Profile
                </FormLabel>
                <FormDescription>
                  {`Automatically fill this field with the user's from their
                  profile`}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default FieldProperties;
