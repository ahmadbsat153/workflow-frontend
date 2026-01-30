"use client";

import { useMemo } from "react";
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
import {
  submitterInfoPropertyOptions,
  dateFormatOptions,
  countryCodeOptions,
} from "@/lib/constants/formFields";
import { SearchableSelect } from "@/lib/components/Common/SearchableSelect";

type Props = {
  field: Field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  loading: boolean | undefined;
};

const FieldProperties = ({ form, field, loading }: Props) => {
  // Flatten grouped country options for SearchableSelect
  const flatCountryOptions = useMemo(() => {
    return countryCodeOptions.flatMap((group) =>
      group.countries.map((country) => ({
        label: `${country.label} (${country.dialCode})`,
        value: country.value,
        description: group.group,
      }))
    );
  }, []);

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

      {/* Date Settings */}
      {field.type === FieldsType.DATE && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold">Date Settings</h4>
          <FormField
            control={form.control}
            name="dateSettings.format"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Date Format</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  value={formField.value || "YYYY-MM-DD"}
                  disabled={loading}
                >
                  <FormControl className="!w-full">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dateFormatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose how the date will be displayed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Phone Settings */}
      {field.type === FieldsType.PHONE && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold">Phone Settings</h4>
          <FormField
            control={form.control}
            name="phoneSettings.country"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Default Country</FormLabel>
                <FormControl>
                  <SearchableSelect
                    options={flatCountryOptions}
                    value={formField.value || "AU"}
                    onChange={formField.onChange}
                    placeholder="Select country"
                    searchPlaceholder="Search countries..."
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>
                  Default country code for phone input
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneSettings.allowAnyCountry"
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow Any Country</FormLabel>
                  <FormDescription>
                    Allow users to select any country code
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={formField.value ?? true}
                    onCheckedChange={formField.onChange}
                    disabled={loading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default FieldProperties;
