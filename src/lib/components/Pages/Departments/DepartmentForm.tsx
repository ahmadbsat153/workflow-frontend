"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Switch } from "@/lib/ui/switch";
import { Textarea } from "@/lib/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";

import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { DepartmentOption } from "@/lib/types/department/department";

const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .min(2, "Name must be at least 2 characters"),
  code: z
    .string()
    .min(1, "Department code is required")
    .min(2, "Code must be at least 2 characters")
    .regex(/^[A-Z0-9_]+$/, "Code must be uppercase letters, numbers, or underscores"),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  isActive: z.boolean(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

const DepartmentForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      description: "",
      parentId: null,
      isActive: true,
    },
  });

  // Load departments for parent selection
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await API_DEPARTMENT.getActiveDepartments();
        // Filter out current department if editing to prevent circular reference
        const filteredDepts = isEdit && params.id
          ? res.data.filter((dept) => dept._id !== params.id)
          : res.data;
        setDepartments(filteredDepts);
      } catch (error) {
        handleServerError(error as ErrorResponse, (msg) => {
          toast.error(`Failed to load departments: ${msg}`);
        });
      }
    };
    loadDepartments();
  }, [isEdit, params.id]);

  // Load existing department if editing
  useEffect(() => {
    if (isEdit && params.id) {
      const loadDepartment = async () => {
        try {
          const res = await API_DEPARTMENT.getDepartmentById(
            params.id as string
          );
          form.reset({
            name: res.name,
            code: res.code,
            description: res.description || "",
            parentId: res.parentId || null,
            isActive: res.isActive,
          });
        } catch (error) {
          handleServerError(error as ErrorResponse, (msg) => {
            toast.error(msg);
            router.push("/admin/departments");
          });
        } finally {
          setInitialLoading(false);
        }
      };
      loadDepartment();
    } else {
      setInitialLoading(false);
    }
  }, [isEdit, params.id, form, router]);

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      setLoading(true);

      // Convert empty parentId to null
      const submitData = {
        ...values,
        parentId: values.parentId || null,
      };

      if (isEdit && params.id) {
        await API_DEPARTMENT.updateDepartment(
          params.id as string,
          submitData
        );
        toast.success("Department updated successfully");
      } else {
        await API_DEPARTMENT.createDepartment(submitData);
        toast.success("Department created successfully");
      }

      router.push("/admin/departments");
    } catch (error) {
      handleServerError(error as ErrorResponse, (msg) => {
        toast.error(msg);
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Human Resources"
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., HR, IT, SALES"
                  {...field}
                  disabled={loading}
                  onChange={(e) => {
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              </FormControl>
              <FormDescription>
                Uppercase letters, numbers, and underscores only
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the department"
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
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Department (Optional)</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value === "none" ? null : value);
                }}
                value={field.value || "none"}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent department (if any)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                For creating a department hierarchy
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Inactive departments are hidden from selection
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

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/departments")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : isEdit ? (
              "Update Department"
            ) : (
              "Create Department"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepartmentForm;
