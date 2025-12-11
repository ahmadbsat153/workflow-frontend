"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Textarea } from "@/lib/ui/textarea";
import { Checkbox } from "@/lib/ui/checkbox";
import { Switch } from "@/lib/ui/switch";
import { Badge } from "@/lib/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/ui/accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_ROLE } from "@/lib/services/Role/role_service";
import type {
  PermissionGroup,
  Permission,
} from "@/lib/types/role/role";
import { Loader2, MoveLeftIcon, AlertTriangle } from "lucide-react";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";

type RoleFormProps = {
  roleId?: string;
};

const roleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .min(2, "Role name must be at least 2 characters"),
  code: z
    .string()
    .min(1, "Role code is required")
    .min(2, "Role code must be at least 2 characters")
    .regex(/^[A-Z_]+$/, "Code must be uppercase letters and underscores only"),
  description: z.string().min(1, "Description is required"),
  permissions: z.array(z.string()),
  is_active: z.boolean(),
});

type ModuleCheckboxProps = {
  checked: boolean;
  indeterminate: boolean;
  onCheckedChange: (checked: boolean) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const ModuleCheckbox = ({
  checked,
  indeterminate,
  onCheckedChange,
  onClick,
}: ModuleCheckboxProps) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      const input = checkboxRef.current.querySelector('input[type="checkbox"]');
      if (input) {
        (input as HTMLInputElement).indeterminate = indeterminate;
      }
    }
  }, [indeterminate]);

  return (
    <Checkbox
      ref={checkboxRef}
      checked={checked}
      onCheckedChange={onCheckedChange}
      onClick={onClick}
    />
  );
};

const RoleForm = ({ roleId }: RoleFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup | null>(
    null
  );
  const isEditing = !!roleId;

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      permissions: [],
      is_active: true,
    },
  });

  const watchedPermissions = form.watch("permissions");

  const fetchPermissionsAndRole = useCallback(async () => {
    try {
      setFetchingData(true);
      const permissionsData = await API_ROLE.getAvailablePermissions(true);
      setPermissionGroups(permissionsData);

      if (roleId) {
        const roleData = await API_ROLE.getRoleById(roleId);
        form.reset({
          name: roleData.name,
          code: roleData.code,
          description: roleData.description,
          permissions: Array.isArray(roleData.permissions)
            ? roleData.permissions.map((p) => typeof p === 'string' ? p : p.key)
            : [],
          is_active: roleData.isActive,
        });
      }
    } catch (error) {
      console.error(error);
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setFetchingData(false);
    }
  }, [roleId, form]);

  useEffect(() => {
    fetchPermissionsAndRole();
  }, [fetchPermissionsAndRole]);

  const onSubmit = async (values: z.infer<typeof roleSchema>) => {
    try {
      setLoading(true);

      if (isEditing && roleId) {
        await API_ROLE.updateRole(roleId, values);
        toast.success("Role updated successfully");
      } else {
        await API_ROLE.createRole(values);
        toast.success("Role created successfully");
      }

      router.push("/admin/roles");
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionKey: string, checked: boolean) => {
    const currentPermissions = form.getValues("permissions");
    if (checked) {
      form.setValue("permissions", [...currentPermissions, permissionKey]);
    } else {
      form.setValue(
        "permissions",
        currentPermissions.filter((key) => key !== permissionKey)
      );
    }
  };

  const handleModuleToggle = (modulePermissions: string[], checked: boolean) => {
    const currentPermissions = form.getValues("permissions");
    if (checked) {
      const newPermissions = [...new Set([...currentPermissions, ...modulePermissions])];
      form.setValue("permissions", newPermissions);
    } else {
      form.setValue(
        "permissions",
        currentPermissions.filter((key) => !modulePermissions.includes(key))
      );
    }
  };

  const isModuleChecked = (modulePermissions: string[]) => {
    return modulePermissions.every((key) => watchedPermissions.includes(key));
  };

  const isModuleIndeterminate = (modulePermissions: string[]) => {
    const hasAny = modulePermissions.some((key) => watchedPermissions.includes(key));
    const hasAll = modulePermissions.every((key) => watchedPermissions.includes(key));
    return hasAny && !hasAll;
  };

  const handleGoBack = () => {
    router.back();
  };

  if (fetchingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Button
          onClick={handleGoBack}
          className="bg-gray-50 text-default hover:bg-primary/20"
          variant="outline"
        >
          <MoveLeftIcon className="size-4" />
          Back
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
              <CardDescription>Basic details about the role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Project Manager" {...field} />
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
                      <FormLabel>Role Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., PROJECT_MANAGER"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormDescription>
                        Uppercase letters and underscores only
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the role and its responsibilities"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Role</FormLabel>
                      <FormDescription>
                        Allow this role to be assigned to users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Select the permissions for this role. Click on a module to select/deselect
                all its permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {permissionGroups && (
                        <Accordion type="multiple" className="w-full">
                          {Object.entries(permissionGroups).map(([moduleName, permissions]) => {
                            const modulePermissionKeys = permissions.map((p) => p.key);
                            return (
                              <AccordionItem key={moduleName} value={moduleName}>
                                <AccordionTrigger className="hover:no-underline">
                                  <div className="flex items-center gap-3">
                                    <ModuleCheckbox
                                      checked={isModuleChecked(modulePermissionKeys)}
                                      indeterminate={isModuleIndeterminate(
                                        modulePermissionKeys
                                      )}
                                      onCheckedChange={(checked) =>
                                        handleModuleToggle(
                                          modulePermissionKeys,
                                          checked === true
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="font-semibold">{moduleName}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {permissions.length}
                                    </Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3 pl-8 pt-2">
                                    {permissions.map((permission: Permission) => (
                                      <div
                                        key={permission.key}
                                        className="flex items-start gap-3"
                                      >
                                        <Checkbox
                                          id={permission.key}
                                          checked={field.value.includes(permission.key)}
                                          onCheckedChange={(checked) =>
                                            handlePermissionToggle(
                                              permission.key,
                                              checked === true
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={permission.key}
                                          className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                              {permission.label}
                                            </span>
                                            {permission.dangerous && (
                                              <Badge
                                                variant="destructive"
                                                className="text-xs"
                                              >
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                Dangerous
                                              </Badge>
                                            )}
                                          </div>
                                          {permission.description && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                              {permission.description}
                                            </div>
                                          )}
                                          <div className="text-xs text-muted-foreground mt-1 font-mono">
                                            {permission.key}
                                          </div>
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoBack}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RoleForm;
