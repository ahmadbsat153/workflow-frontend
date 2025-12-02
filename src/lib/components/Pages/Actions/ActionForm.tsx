"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/lib/ui/input";
import { Switch } from "@/lib/ui/switch";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Textarea } from "@/lib/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { API_ACTION } from "@/lib/services/Actions/action_service";
import { Action, ActionConfigField } from "@/lib/types/actions/action";

import {
  actionSchema,
  type ActionFormValues,
} from "@/utils/Validation/actionValidationSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { Button } from "@/lib/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import { URLs } from "@/lib/constants/urls";

type ActionFormProps = {
  action_id?: string;
  onCancel?: () => void;
};

export const ActionForm = ({ action_id, onCancel }: ActionFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [initialData, setInitialData] = useState<Action | null>(null);

  // Determine if we're in edit mode
  const isEditMode = !!action_id;

  // Fetch action data if action_id is provided
  useEffect(() => {
    const fetchAction = async () => {
      if (!action_id) return;

      try {
        setIsFetching(true);
        const action = await API_ACTION.getActionById(action_id);

        if (action) {
          setInitialData(action);
          // Reset form with fetched data
          form.reset({
            actionName: action.actionName,
            displayName: action.displayName,
            actionDescription: action.actionDescription,
            category: action.category,
            icon: action.icon,
            configSchema: action.configSchema,
            isActive: action.isActive,
          });
          if (action.configSchema && action.configSchema.fields.length > 0) {
            setConfigFields(action.configSchema.fields);
          }
        } else {
          toast.error("Action not found");
          router.push(URLs.admin.actions.index);
        }
      } catch (error) {
        console.error("Error fetching action:", error);
        toast.error("Failed to load action");
        router.push(URLs.admin.actions.index);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAction();
  }, [action_id]);

  const onSubmit = async (data: ActionFormValues) => {
    try {
      setIsLoading(true);

      if (isEditMode && action_id) {
        // Update existing action
        await API_ACTION.updateAction(action_id, data);
        toast.success("Action updated successfully!");
      } else {
        // Create new action
        await API_ACTION.createAction(data);
        toast.success("Action created successfully!");
      }

      router.push(URLs.admin.actions.index);

      router.refresh(); // Refresh server components
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} action:`,
        error
      );
      toast.error(`Failed to ${isEditMode ? "update" : "create"} action`);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize configFields state
  const [configFields, setConfigFields] = useState<ActionConfigField[]>([]);

  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      actionName: "",
      displayName: "",
      actionDescription: "",
      category: "data" as const,
      icon: "zap",
      isActive: true,
      configSchema: {
        fields: [],
      },
    },
  });

  const handleFormSubmit = async (data: ActionFormValues) => {
    // Ensure defaults for optional fields before submitting
    const submissionData: ActionFormValues = {
      ...data,
      icon: data.icon || "zap",
      isActive: data.isActive ?? true,
      configSchema: {
        fields: data.configSchema.fields.map((field) => ({
          ...field,
          supportsTemplate: field.supportsTemplate ?? false,
        })),
      },
    };
    await onSubmit(submissionData);
  };

  const addConfigField = () => {
    const newField: ActionConfigField = {
      name: "",
      label: "",
      type: "text",
      required: false,
      supportsTemplate: false,
    };

    const updatedFields = [...configFields, newField];
    setConfigFields(updatedFields);
    form.setValue("configSchema.fields", updatedFields);
  };

  const removeConfigField = (index: number) => {
    const updated = configFields.filter((_, i) => i !== index);
    setConfigFields(updated);
    form.setValue("configSchema.fields", updated);
  };

  // Show loading state while fetching
  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading action...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 pb-5"
      >
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="actionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="send-email"
                    {...field}
                    disabled={isEditMode} // Disable in edit mode
                  />
                </FormControl>
                <FormDescription>
                  Unique identifier (lowercase, hyphens only)
                  {isEditMode && " - Cannot be changed"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Send Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actionDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what this action does..."
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="data">Data</SelectItem>
                      <SelectItem value="approval">Approval</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="logic">Logic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mail"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Lucide icon name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Inactive actions won't be available in workflows
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Config Schema Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Configuration Fields</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addConfigField}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          {configFields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
              No configuration fields yet. Click "Add Field" to create one.
            </div>
          ) : (
            configFields.map((_, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Field {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeConfigField(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`configSchema.fields.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field Name</FormLabel>
                        <FormControl>
                          <Input placeholder="recipientEmail" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`configSchema.fields.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Recipient Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`configSchema.fields.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="attachment">Attachment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`configSchema.fields.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Required</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`configSchema.fields.${index}.supportsTemplate`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value ?? false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          Supports Template
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading || isFetching}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Action" : "Create Action"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
