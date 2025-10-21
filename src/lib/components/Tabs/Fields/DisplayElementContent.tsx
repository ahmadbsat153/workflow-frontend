"use client";

import { Field, FieldsType } from "@/lib/types/form/fields";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { UseFormReturn } from "react-hook-form";

type DisplayElementContentProps = {
  field: Field;
  form: UseFormReturn<any>;
  loading: boolean;
};

const DisplayElementContent = ({
  field,
  form,
  loading,
}: DisplayElementContentProps) => {
  switch (field.type) {
    case FieldsType.SEPARATOR:
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Separators don't have editable content. Use the Style tab to
            customize appearance.
          </p>
        </div>
      );

    case FieldsType.TITLE:
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="content.text"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Title Text *</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    placeholder="Enter title text"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content.level"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Heading Level</FormLabel>
                <Select
                  value={formField.value?.toString() || "2"}
                  onValueChange={(value) => formField.onChange(Number(value))}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select heading level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">H1 - Largest</SelectItem>
                    <SelectItem value="2">H2</SelectItem>
                    <SelectItem value="3">H3</SelectItem>
                    <SelectItem value="4">H4</SelectItem>
                    <SelectItem value="5">H5</SelectItem>
                    <SelectItem value="6">H6 - Smallest</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case FieldsType.PARAGRAPH:
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="content.text"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Paragraph Text *</FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    placeholder="Enter paragraph text"
                    rows={6}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case FieldsType.SPACER:
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="content.height"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Height (pixels) *</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="number"
                    min={1}
                    max={1000}
                    placeholder="30"
                    disabled={loading}
                    onChange={(e) =>
                      formField.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case FieldsType.IMAGE:
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="content.imageUrl"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Image URL *</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content.imageAlt"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Alt Text</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    placeholder="Describe the image"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preview */}
          {form.watch("content.imageUrl") && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img
                src={form.watch("content.imageUrl")}
                alt={form.watch("content.imageAlt") || "Preview"}
                className="max-w-full h-auto rounded border"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400";
                }}
              />
            </div>
          )}
        </div>
      );

    case FieldsType.ALERT:
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="content.text"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Alert Message *</FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    placeholder="Enter alert message"
                    rows={4}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content.alertType"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>Alert Type</FormLabel>
                <Select
                  value={formField.value || "info"}
                  onValueChange={formField.onChange}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="info">Info (Blue)</SelectItem>
                    <SelectItem value="success">Success (Green)</SelectItem>
                    <SelectItem value="warning">Warning (Yellow)</SelectItem>
                    <SelectItem value="error">Error (Red)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case FieldsType.HTML:
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="content.html"
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>HTML Content *</FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    placeholder="<p>Enter your HTML code</p>"
                    rows={10}
                    disabled={loading}
                    className="font-mono text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preview */}
          {form.watch("content.html") && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div
                className="border rounded p-4"
                dangerouslySetInnerHTML={{
                  __html: form.watch("content.html"),
                }}
              />
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default DisplayElementContent;