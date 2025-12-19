"use client";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";

import { Input } from "@/lib/ui/input";
import { Button } from "@/lib/ui/button";
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

import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { DepartmentOption } from "@/lib/types/department/department";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import {
  BranchFormValues,
  branchSchema,
} from "@/utils/Validation/branchValidationScehma";
import { URLs } from "@/lib/constants/urls";

const BranchForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      description: "",
      departmentId: null,
      location: {
        address: "",
        city: "",
        state: "",
        country: "",
      },
      contactInfo: {
        phone: "",
        email: "",
      },
      managerId: null,
      isActive: true,
    },
  });

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await API_DEPARTMENT.getActiveDepartments();
        setDepartments(res.data);
      } catch (error) {
        handleServerError(error as ErrorResponse, (msg) => {
          toast.error(`Failed to load departments: ${msg}`);
        });
      }
    };
    loadDepartments();
  }, []);

  // Load existing branch if editing
  useEffect(() => {
    if (isEdit && params.id) {
      const loadBranch = async () => {
        try {
          const res = await API_BRANCH.getBranchById(params.id as string);
          form.reset({
            name: res.name,
            code: res.code,
            description: res.description || "",
            departmentId: res.departmentId || null,
            location: {
              address: res.location?.address || "",
              city: res.location?.city || "",
              state: res.location?.state || "",
              country: res.location?.country || "",
            },
            contactInfo: {
              phone: res.contactInfo?.phone || "",
              email: res.contactInfo?.email || "",
            },
            managerId: res.managerId || null,
            isActive: res.isActive,
          });
        } catch (error) {
          handleServerError(error as ErrorResponse, (msg) => {
            toast.error(msg);
            router.push(URLs.admin.branches.index);
          });
        } finally {
          setInitialLoading(false);
        }
      };
      loadBranch();
    } else {
      setInitialLoading(false);
    }
  }, [isEdit, params.id, form, router]);

  const onSubmit = async (values: BranchFormValues) => {
    try {
      setLoading(true);

      // Clean up empty coordinates
      const submitData = {
        ...values,
        departmentId: values.departmentId || null,
        managerId: values.managerId || null,
        location: {
          ...values.location,
        },
      };

      if (isEdit && params.id) {
        await API_BRANCH.updateBranch(params.id as string, submitData);
        toast.success("Branch updated successfully");
      } else {
        await API_BRANCH.createBranch(submitData);
        toast.success("Branch created successfully");
      }

      router.push(URLs.admin.branches.index);
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
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Main Office"
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
                <FormLabel>Branch Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., MAIN, NSW, QLD"
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of the branch"
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
            name="departmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department (Optional)</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value === "none" ? null : value);
                  }}
                  value={field.value || "none"}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department (if any)" />
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
                  Associate this branch with a department
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location Information</h3>

          <FormField
            control={form.control}
            name="location.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 123 Main Street"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., New York"
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
              name="location.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., NY"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., USA"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>

          <FormField
            control={form.control}
            name="contactInfo.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., +1 (555) 123-4567"
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
            name="contactInfo.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g., branch@company.com"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Inactive branches are hidden from selection
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
            onClick={() => router.push(URLs.admin.branches.index)}
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
              "Update Branch"
            ) : (
              "Create Branch"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BranchForm;
