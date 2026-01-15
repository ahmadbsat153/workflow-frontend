"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import { Input } from "@/lib/ui/input";
import { Field } from "@/lib/types/form/fields";
import { FileTypeMultiSelect } from "./FileTypeMultiSelect";
import { UseFormReturn } from "react-hook-form";
import { getValidationFieldsForType } from "@/utils/Form/ValidationFeildsConfig";

type Props = {
  field: Field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  loading: boolean;
};

const FieldValidation = ({ field, form, loading }: Props) => {
  const validationFields = getValidationFieldsForType(field.type);

  return (
    <div className="flex-1 space-y-4">
      {validationFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Validation Rules</h3>

          {validationFields.map((validationField) => {
            // Handle multi-select for allowedFileTypes
            if (validationField.name === "validation.allowedFileTypes") {
              return (
                <FormField
                  key={validationField.name}
                  control={form.control}
                  name={validationField.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{validationField.label}</FormLabel>
                      <FormControl>
                        <FileTypeMultiSelect
                          selected={formField.value || []}
                          onChange={formField.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                      {validationField.description && (
                        <FormDescription>
                          {validationField.description}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }

            // Handle regular input fields
            return (
              <FormField
                key={validationField.name}
                control={form.control}
                name={validationField.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{validationField.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={validationField.type}
                        placeholder={validationField.placeholder}
                        value={formField.value ?? ""}
                        onChange={(e) => {
                          const value =
                            validationField.type === "number"
                              ? e.target.value === ""
                                ? undefined
                                : Number(e.target.value)
                              : e.target.value;
                          formField.onChange(value);
                        }}
                        onBlur={formField.onBlur}
                        name={formField.name}
                        disabled={loading}
                      />
                    </FormControl>
                    {validationField.description && (
                      <FormDescription>
                        {validationField.description}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FieldValidation;
