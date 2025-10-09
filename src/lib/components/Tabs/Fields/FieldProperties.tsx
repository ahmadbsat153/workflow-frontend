"use client";

import { Field, FieldsType, FormFieldOption } from "@/lib/types/form/fields";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import { Input } from "@/lib/ui/input";
import { Switch } from "@/lib/ui/switch";
import { Button } from "@/lib/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type Props = {
  field: Field;
  form: UseFormReturn<any>;
  loading: boolean | undefined;
};

const FieldProperties = ({ form, field, loading }: Props) => {
  return (
    <div className="flex-1 space-y-4">
      <h3 className="text-lg font-semibold">Field Settings</h3>
      {/* Basic Fields */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
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
    </div>
  );
};

export default FieldProperties;
