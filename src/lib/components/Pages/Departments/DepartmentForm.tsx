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
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { BranchOption } from "@/lib/types/branch/branch";
import { URLs } from "@/lib/constants/urls";
import FixedHeaderFooterLayout from "../../Layout/FixedHeaderFooterLayout";

type DepartmentFormProps = {
  isEdit?: boolean;
  title: string;
  description: string;
};

const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .min(2, "Name must be at least 2 characters"),
  code: z
    .string()
    .min(1, "Department code is required")
    .min(2, "Code must be at least 2 characters")
    .regex(
      /^[A-Z0-9_]+$/,
      "Code must be uppercase letters, numbers, or underscores"
    ),
  description: z.string().optional(),
  branchId: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

const DepartmentForm = ({
  isEdit = false,
  title,
  description,
}: DepartmentFormProps) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [branches, setBranches] = useState<BranchOption[]>([]);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      description: "",
      branchId: null,
      isActive: true,
    },
  });

  // Load branches for branch selection
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await API_BRANCH.getActiveBranches();
        setBranches(res.data);
      } catch (error) {
        handleServerError(error as ErrorResponse, (msg) => {
          toast.error(`Failed to load branches: ${msg}`);
        });
      }
    };
    loadBranches();
  }, []);

  // Load existing department if editing
  useEffect(() => {
    if (isEdit && params.id) {
      const loadDepartment = async () => {
        try {
          const res = await API_DEPARTMENT.getDepartmentById(
            params.id as string
          );
          const branchIdValue =
            typeof res.branchId === "object" && res.branchId?._id
              ? res.branchId._id
              : typeof res.branchId === "string"
                ? res.branchId
                : null;
          form.reset({
            name: res.name,
            code: res.code,
            description: res.description || "",
            branchId: branchIdValue,
            isActive: res.isActive,
          });
        } catch (error) {
          handleServerError(error as ErrorResponse, (msg) => {
            toast.error(msg);
            router.push(URLs.admin.departments.index);
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

      // Convert empty branchId to null
      const submitData = {
        ...values,
        branchId: values.branchId || null,
      };

      if (isEdit && params.id) {
        await API_DEPARTMENT.updateDepartment(params.id as string, submitData);
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
    <FixedHeaderFooterLayout
      title={title}
      description={description}
      footer={
        <div className="flex gap-2 w-full justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(URLs.admin.departments.index)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" form="department-form" disabled={loading}>
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
      }
      maxWidth="3xl"
      maxHeight="90vh"
    >
      <Form {...form}>
        <form
          id="department-form"
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
            name="branchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch (Optional)</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value === "none" ? null : value);
                  }}
                  value={field.value || "none"}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch (if any)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name} ({branch.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Associate this department with a branch
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
        </form>
      </Form>
    </FixedHeaderFooterLayout>
  );
};

export default DepartmentForm;
