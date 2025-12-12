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
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { DepartmentOption } from "@/lib/types/department/department";

const positionSchema = z.object({
  name: z
    .string()
    .min(1, "Position name is required")
    .min(2, "Name must be at least 2 characters"),
  code: z
    .string()
    .min(1, "Position code is required")
    .min(2, "Code must be at least 2 characters")
    .regex(
      /^[A-Z0-9_]+$/,
      "Code must be uppercase letters, numbers, or underscores"
    ),
  description: z.string().optional(),
  departmentId: z.string().optional().nullable(),
  level: z.number().min(0, "Level must be 0 or greater").optional(),
  isActive: z.boolean(),
});

type PositionFormValues = z.infer<typeof positionSchema>;

const PositionForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const form = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      description: "",
      departmentId: "",
      level: 0,
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

  // Load existing position if editing
  useEffect(() => {
    if (isEdit && params.id) {
      const loadPosition = async () => {
        try {
          const res = await API_POSITION.getPositionById(params.id as string);
          form.reset({
            name: res.name,
            code: res.code,
            description: res.description || "",
            departmentId: res?.departmentId?._id,
            level: res.level || 0,
            isActive: res.isActive,
          });
        } catch (error) {
          handleServerError(error as ErrorResponse, (msg) => {
            toast.error(msg);
            router.push("/admin/positions");
          });
        } finally {
          setInitialLoading(false);
        }
      };
      loadPosition();
    } else {
      setInitialLoading(false);
    }
  }, [isEdit, params.id, form, router]);

  const onSubmit = async (values: PositionFormValues) => {
    try {
      setLoading(true);

      if (isEdit && params.id) {
        await API_POSITION.updatePosition(params.id as string, values);
        toast.success("Position updated successfully");
      } else {
        await API_POSITION.createPosition(values);
        toast.success("Position created successfully");
      }

      router.push("/admin/positions");
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
              <FormLabel>Position Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., HR Manager"
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
              <FormLabel>Position Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., MANAGER, DIRECTOR, CEO"
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
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ? field.value : undefined}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  placeholder="Brief description of the position"
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
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hierarchy Level (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 10 for Director, 5 for Manager"
                  {...field}
                  disabled={loading}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : Number(value));
                  }}
                />
              </FormControl>
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
                  Inactive positions are hidden from selection
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
            onClick={() => router.push("/admin/positions")}
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
              "Update Position"
            ) : (
              "Create Position"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PositionForm;
