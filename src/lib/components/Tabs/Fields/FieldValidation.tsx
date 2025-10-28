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
import { Input } from "@/lib/ui/input";
import { getValidationFieldsForType } from "@/utils/Form/ValidationFeildsConfig";
import { UseFormReturn } from "react-hook-form";

type Props = {
  field: Field;
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

          {validationFields.map((validationField) => (
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
                          validationField.type === FieldsType.NUMBER
                            ? e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                            : e.target.value;
                        formField.onChange(value);
                      }}
                      onBlur={formField.onBlur}
                      name={formField.name}
                      // ref={formField.ref}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldValidation;
