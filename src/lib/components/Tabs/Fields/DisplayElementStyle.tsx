"use client";

import { Field, FieldsType } from "@/lib/types/form/fields";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/lib/ui/form";
import { Input } from "@/lib/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { UseFormReturn } from "react-hook-form";

type DisplayElementStyleProps = {
  field: Field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  loading: boolean;
};

const DisplayElementStyle = ({
  field,
  form,
  loading,
}: DisplayElementStyleProps) => {
  const showAlignment = [
    FieldsType.TITLE,
    FieldsType.PARAGRAPH,
    FieldsType.IMAGE,
  ].includes(field.type);

  const showBorder = field.type === FieldsType.SEPARATOR;

  const showTypography = [FieldsType.TITLE, FieldsType.PARAGRAPH].includes(
    field.type
  );

  return (
    <div className="space-y-4">
      {/* Alignment */}
      {showAlignment && (
        <FormField
          control={form.control}
          name="style.alignment"
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>Alignment</FormLabel>
              <Select
                value={formField.value || "left"}
                onValueChange={formField.onChange}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Typography */}
      {showTypography && (
        <>
          <FormField
            control={form.control}
            name="style.fontSize"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Font Size</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    placeholder="e.g., 1.5rem, 24px"
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>
                  CSS value (e.g., 1.5rem, 24px, 150%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style.fontWeight"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Font Weight</FormLabel>
                <Select
                  value={formField.value || "normal"}
                  onValueChange={formField.onChange}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="600">Semi-Bold</SelectItem>
                    <SelectItem value="300">Light</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style.color"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...formField}
                      type="color"
                      className="w-20 h-10"
                      disabled={loading}
                    />
                  </FormControl>
                  <Input
                    value={formField.value || "#000000"}
                    onChange={(e) => formField.onChange(e.target.value)}
                    placeholder="#000000"
                    disabled={loading}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {/* Border (for Separator) */}
      {showBorder && (
        <>
          <FormField
            control={form.control}
            name="style.borderStyle"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Border Style</FormLabel>
                <Select
                  value={formField.value || "solid"}
                  onValueChange={formField.onChange}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style.borderWidth"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Border Width</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    placeholder="e.g., 1px, 2px"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style.borderColor"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Border Color</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...formField}
                      type="color"
                      className="w-20 h-10"
                      disabled={loading}
                    />
                  </FormControl>
                  <Input
                    value={formField.value || "#e5e7eb"}
                    onChange={(e) => formField.onChange(e.target.value)}
                    placeholder="#e5e7eb"
                    disabled={loading}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {/* Background Color */}
      <FormField
        control={form.control}
        name="style.backgroundColor"
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>Background Color</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  {...formField}
                  type="color"
                  className="w-20 h-10"
                  disabled={loading}
                />
              </FormControl>
              <Input
                value={formField.value || ""}
                onChange={(e) => formField.onChange(e.target.value)}
                placeholder="transparent"
                disabled={loading}
              />
            </div>
            <FormDescription>Leave empty for transparent</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Spacing */}
      <FormField
        control={form.control}
        name="style.padding"
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>Padding</FormLabel>
            <FormControl>
              <Input
                {...formField}
                placeholder="e.g., 10px, 1rem, 10px 20px"
                disabled={loading}
              />
            </FormControl>
            <FormDescription>
              CSS padding (e.g., 10px, 1rem, 10px 20px)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="style.margin"
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>Margin</FormLabel>
            <FormControl>
              <Input
                {...formField}
                placeholder="e.g., 20px 0, 1rem 0"
                disabled={loading}
              />
            </FormControl>
            <FormDescription>CSS margin (e.g., 20px 0, 1rem 0)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DisplayElementStyle;
