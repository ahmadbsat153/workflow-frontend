"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { handleServerError } from "@/lib/api/_axios";
import { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/ui/sheet";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Switch } from "@/lib/ui/switch";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { UserAuthenticated } from "@/lib/types/user/user";
import { API_USER } from "@/lib/services/User/user_service";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { DepartmentOption } from "@/lib/types/department/department";
import { PositionOption } from "@/lib/types/position/position";
import { BranchOption } from "@/lib/types/branch/branch";
import { Role } from "@/lib/types/role/role";
import { Loader2 } from "lucide-react";

type UserSheetProps = {
  children: ReactNode;
  user: UserAuthenticated;
  callback?: () => void;
};

const UserSheet = ({ children, user, callback }: UserSheetProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [positions, setPositions] = useState<PositionOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);

  const update_schema = z.object({
    firstname: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastname: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Email is required"),
    is_super_admin: z.boolean(),
    roleId: z.string().nullable().optional(),
    departmentId: z.string().nullable().optional(),
    positionId: z.string().nullable().optional(),
    branchId: z.string().nullable().optional(),
  });

  const form = useForm<z.infer<typeof update_schema>>({
    resolver: zodResolver(update_schema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      is_super_admin: false,
      roleId: null,
      departmentId: null,
      positionId: null,
      branchId: null,
    },
  });

  const {
    formState: { errors, isDirty },
    watch,
  } = form;

  // Watch department changes to filter positions
  const selectedDepartmentId = watch("departmentId");

  // Load organizational data
  useEffect(() => {
    const loadOrganizationalData = async () => {
      try {
        const [deptRes, branchRes, rolesRes] = await Promise.all([
          API_DEPARTMENT.getActiveDepartments(),
          API_BRANCH.getActiveBranches(),
          API_ROLE.getActiveRoles(),
        ]);
        setDepartments(deptRes.data);
        setBranches(branchRes.data);
        setRoles(rolesRes);
      } catch (error) {
        handleServerError(error, (msg) => {
          toast.error(`Failed to load organizational data: ${msg}`);
        });
      }
    };
    if (open) {
      loadOrganizationalData();
    }
  }, [open]);

  // Load positions when department changes
  useEffect(() => {
    const loadPositions = async (departmentId: string) => {
      try {
        setLoadingPositions(true);
        const res = await API_POSITION.getActivePositions(
          `?departmentId=${departmentId}`
        );
        setPositions(res.data);
      } catch (error) {
        handleServerError(error, (msg) => {
          toast.error(`Failed to load positions: ${msg}`);
        });
      } finally {
        setLoadingPositions(false);
      }
    };

    if (selectedDepartmentId && selectedDepartmentId !== "none") {
      loadPositions(selectedDepartmentId);
    } else {
      setPositions([]);
      // Clear position if department is cleared
      if (form.getValues("positionId")) {
        form.setValue("positionId", null);
      }
    }
  }, [selectedDepartmentId, form]);

  const getUser = async () => {
    if (!user || !open) {
      return;
    }

    try {
      setLoading(true);

      const res = await API_USER.getUserById(user._id);

      form.reset({
        firstname: res.firstname || "",
        lastname: res.lastname || "",
        email: res.email || "",
        is_super_admin: res.is_super_admin || false,
        roleId: res.role?.id || null,
        departmentId: res.departmentId?._id || null,
        positionId: res.positionId?._id || null,
        branchId: res.branchId?._id || null,
      });
    } catch (error) {
      handleServerError(error, (msg) => {
        toast.error(msg);
      });
    } finally {
      setLoading(false);
      setSuccess(false);
    }
  };

  const updateUser = async (data: z.infer<typeof update_schema>) => {
    if (!user) return;

    try {
      setLoading(true);

      await API_USER.updateUserById(user._id, data);

      toast.success("User updated successfully");

      if (callback) {
        callback();
      }
      setSuccess(true);
    } catch (error) {
      handleServerError(error, (msg) => {
        toast.error(msg);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [open, getUser]);

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          form.reset();
          setSuccess(false);
        }
        setOpen(val);
      }}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="gap-1 w-full">
          <SheetTitle>Update User</SheetTitle>
          <SheetDescription className="text-muted-foreground text-base">
            Update user details and settings from here
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(updateUser)}
              className="space-y-6"
            >
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading user data...</span>
                </div>
              )}

              {!loading && (
                <>
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
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
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role & Access */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">Role & Access</h3>

                    <FormField
                      control={form.control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role (Optional)</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value === "none" ? null : value);
                            }}
                            value={field.value || "none"}
                            disabled={loading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {roles.map((role) => (
                                <SelectItem key={role._id} value={role._id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Assign a role to grant specific permissions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Organizational Information */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">
                      Organizational Information
                    </h3>

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
                                <SelectValue placeholder="Select department" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="positionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position (Optional)</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value === "none" ? null : value);
                            }}
                            value={field.value || "none"}
                            disabled={
                              loading ||
                              !selectedDepartmentId ||
                              selectedDepartmentId === "none" ||
                              loadingPositions
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !selectedDepartmentId ||
                                    selectedDepartmentId === "none"
                                      ? "Select department first"
                                      : loadingPositions
                                      ? "Loading positions..."
                                      : "Select position"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {positions.map((pos) => (
                                <SelectItem key={pos._id} value={pos._id}>
                                  {pos.name} ({pos.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select a department first to see available positions
                          </FormDescription>
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
                                <SelectValue placeholder="Select branch" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="is_super_admin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Super Admin
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Grant super admin privileges to this user
                          </div>
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
                </>
              )}
            </form>
          </Form>
        </div>

        <SheetFooter className="flex gap-2 sm:space-x-0 w-full">
          <SheetClose asChild>
            <Button variant="outline" className="w-full" disabled={loading}>
              Cancel
            </Button>
          </SheetClose>

          <Button
            type="button"
            onClick={form.handleSubmit(updateUser)}
            variant="default"
            className={`w-full font-semibold ${
              success ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            disabled={
              !isDirty || Object.keys(errors).length > 0 || loading || success
            }
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : success ? (
              "Updated!"
            ) : (
              "Update User"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
