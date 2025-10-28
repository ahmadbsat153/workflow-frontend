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
import { Button } from "@/lib/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type Props = {
  field: Field;
  form: UseFormReturn<any>;
  loading: boolean;
};

const FieldOptions = ({ form, field, loading }: Props) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  // Use field array for managing options
  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });
  const handleAddOption = () => {
    const newOption: FormFieldOption = {
      label: "",
      value: "",
    };
    append(newOption);
    // Automatically expand the newly added option
    setExpandedIndex(optionFields.length);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Options</h3>
          <p className="text-sm text-muted-foreground">
            Add options for users to choose from
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddOption}
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>

      {optionFields.length === 0 && (
        <div className="text-center py-8 border rounded-lg border-dashed">
          <p className="text-sm text-muted-foreground">
            No options added yet. Click "Add Option" to get started.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {optionFields.map((item, index) => {
          const isExpanded = expandedIndex === index;
          const labelValue = form.watch(`options.${index}.label`);
          const valueValue = form.watch(`options.${index}.value`);

          return (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              {/* Collapsed Header */}
              <div
                className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {labelValue || `Option ${index + 1}`}
                  </p>
                  {!isExpanded && valueValue && (
                    <p className="text-xs text-muted-foreground truncate">
                      Value: {valueValue}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(index);
                      if (expandedIndex === index) {
                        setExpandedIndex(null);
                      }
                    }}
                    disabled={loading || optionFields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-3 space-y-3 border-t">
                  <FormField
                    control={form.control}
                    name={`options.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Label</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Display text (e.g., 'United States')"
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
                    name={`options.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Value</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Internal value (e.g., 'us')"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {optionFields.length < 2 && optionFields.length > 0 && (
        <p className="text-sm text-pumpkin">
          At least 2 options are recommended for a meaningful selection
        </p>
      )}
    </div>
  );
};

export default FieldOptions;
