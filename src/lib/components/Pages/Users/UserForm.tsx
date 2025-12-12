"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/lib/ui/button";
import { Input } from "@/lib/ui/input";
import { Switch } from "@/lib/ui/switch";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_USER } from "@/lib/services/User/user_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { API_AUTH } from "@/lib/services/auth_service";
import type { Role } from "@/lib/types/role/role";
import type { DepartmentOption } from "@/lib/types/department/department";
import type { PositionOption } from "@/lib/types/position/position";
import type { BranchOption } from "@/lib/types/branch/branch";
import { Loader2, MoveLeftIcon } from "lucide-react";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import type { ADUser } from "@/lib/types/user/user";

type UserFormProps = {
  userId?: string;
};

const userSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().optional(),
    role: z.string().nullable().optional(),
    departmentId: z.string().nullable().optional(),
    positionId: z.string().nullable().optional(),
    branchId: z.string().nullable().optional(),
    is_super_admin: z.boolean(),
    is_active: z.boolean(),
    is_archived: z.boolean(),
    sendInvitation: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Password is required only if sendInvitation is false/undefined
      if (!data.sendInvitation) {
        return data.password && data.password.length >= 6;
      }
      return true;
    },
    {
      message: "Password must be at least 6 characters",
      path: ["password"],
    }
  );

const UserForm = ({ userId }: UserFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [positions, setPositions] = useState<PositionOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const isEditing = !!userId;
  const [isFromAD, setIsFromAD] = useState(false);
  const [adJobTitle, setAdJobTitle] = useState<string | null>(null);
  const [shouldCreatePosition, setShouldCreatePosition] = useState(false);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      role: null,
      departmentId: null,
      positionId: null,
      branchId: null,
      is_super_admin: false,
      is_active: true,
      is_archived: false,
      sendInvitation: false,
    },
  });

  const fetchDropdownData = useCallback(async () => {
    try {
      const [
        rolesData,
        departmentsResponse,
        positionsResponse,
        branchesResponse,
      ] = await Promise.all([
        API_ROLE.getActiveRoles(),
        API_DEPARTMENT.getActiveDepartments(),
        API_POSITION.getActivePositions(),
        API_BRANCH.getActiveBranches(),
      ]);

      setRoles(rolesData);
      setDepartments(departmentsResponse.data);
      setPositions(positionsResponse.data);
      setBranches(branchesResponse.data);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    }
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    try {
      setFetchingData(true);
      const userData = await API_USER.getUserById(userId);

      // Extract role ID from role object { id, code, name }
      const roleValue = userData.role?.id || null;

      form.reset({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        password: undefined, // Don't populate password on edit
        role: roleValue,
        departmentId:
          typeof userData.departmentId === "string"
            ? userData.departmentId
            : userData.departmentId?._id || null,
        positionId:
          typeof userData.positionId === "string"
            ? userData.positionId
            : userData.positionId?._id || null,
        branchId:
          typeof userData.branchId === "string"
            ? userData.branchId
            : userData.branchId?._id || null,
        is_super_admin: userData.is_super_admin || false,
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        is_archived: userData.is_archived || false,
      });
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setFetchingData(false);
    }
  }, [userId, form]);

  useEffect(() => {
    const loadADUserData = async () => {
      const adUserParam = searchParams.get("adUser");
      if (adUserParam && !userId) {
        try {
          const adUser: ADUser = JSON.parse(decodeURIComponent(adUserParam));
          setIsFromAD(true);

          // Store AD job title for display
          if (adUser.jobTitle) setAdJobTitle(adUser.jobTitle);

          // First fetch dropdown data to get positions
          await fetchDropdownData();

          // Try to match AD jobTitle with existing positions
          let matchedPositionId = null;

          if (adUser.jobTitle && positions.length > 0) {
            const normalizedJobTitle = adUser.jobTitle.toLowerCase().trim();
            // Only do exact match to avoid false positives
            const matchedPosition = positions.find(
              (pos) => pos.name.toLowerCase().trim() === normalizedJobTitle
            );

            if (matchedPosition) {
              matchedPositionId = matchedPosition._id;
              toast.success(
                `Position "${matchedPosition.name}" matched from AD job title`
              );
            } else {
              setShouldCreatePosition(true);
              toast.info(
                `Job title "${adUser.jobTitle}" from AD - will be created as new position on submit`
              );
            }
          } else if (adUser.jobTitle) {
            // If no positions loaded yet, mark for creation
            setShouldCreatePosition(true);
            toast.info(
              `Job title "${adUser.jobTitle}" from AD - will be created as new position on submit`
            );
          }

          // Pre-fill form with AD user data
          form.reset({
            firstname: adUser.givenName || "",
            lastname: adUser.surname || "",
            email: adUser.mail || adUser.userPrincipalName || "",
            phone: adUser.mobilePhone || adUser.businessPhones?.[0] || "",
            password: "", // User will need to set a password
            role: null,
            departmentId: null,
            positionId: matchedPositionId,
            branchId: null,
            is_super_admin: false,
            is_active:
              adUser.accountEnabled !== undefined
                ? adUser.accountEnabled
                : true,
            is_archived: false,
            sendInvitation: true, // Default to invitation for AD users
          });

          toast.info("User data loaded from Active Directory");
        } catch (error) {
          toast.error("Failed to load AD user data");
        }
      } else if (userId) {
        await fetchDropdownData();
        fetchUserData();
      } else {
        fetchDropdownData();
      }
    };

    loadADUserData();
  }, [userId, searchParams]);

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      setLoading(true);

      // Remove password from update if not provided
      const submitData = { ...values };
      if (isEditing && !submitData.password) {
        delete submitData.password;
      }

      // Handle creating position from AD if needed
      console.log("Position creation check:", {
        isFromAD,
        shouldCreatePosition,
        adJobTitle,
        hasPositionId: !!submitData.positionId,
        positionId: submitData.positionId,
      });

      if (
        isFromAD &&
        shouldCreatePosition &&
        adJobTitle &&
        !submitData.positionId
      ) {
        try {
          // Generate a code from the job title (e.g., "Senior Developer" -> "SENDEV")
          const posCode = adJobTitle
            .split(" ")
            .map((word) => word.substring(0, 3))
            .join("")
            .toUpperCase()
            .substring(0, 10);

          console.log("Creating position with:", {
            name: adJobTitle,
            code: posCode,
          });

          const createResponse = await API_POSITION.createPosition({
            name: adJobTitle,
            code: posCode,
            description: `Imported from Active Directory`,
            isActive: true,
          });

          console.log("Position created, response:", createResponse);

          // Check if the response includes the created position data with ID
          if (
            createResponse &&
            typeof createResponse === "object" &&
            "data" in createResponse
          ) {
            const responseData = createResponse as any;
            if (responseData.data && responseData.data._id) {
              // Use the ID directly from the response
              submitData.positionId = responseData.data._id;
              toast.success(
                `Position "${adJobTitle}" created and assigned successfully`
              );
              console.log("Position ID from response:", responseData.data._id);
            } else {
              toast.warning(
                `Position "${adJobTitle}" created but ID not returned. Please select it manually.`
              );
              console.warn(
                "Position created but no ID in response:",
                createResponse
              );
            }
          } else {
            toast.warning(
              `Position "${adJobTitle}" created but response format unexpected.`
            );
            console.warn("Unexpected response format:", createResponse);
          }
        } catch (error) {
          toast.error(`Failed to create position: ${adJobTitle}`);
          console.error("Position creation error:", error);
        }
      } else {
        console.log("not from AD");
      }

      // Handle user creation with invitation or direct creation
      if (isEditing && userId) {
        await API_USER.updateUserById(userId, submitData);
        toast.success("User updated successfully");
      } else {
        // Remove sendInvitation from submitData before sending to backend
        const { sendInvitation, ...userDataWithoutInvite } = submitData;
        // Create the user first
        await API_USER.createUser(userDataWithoutInvite);

        // If user was created successfully and invitation is enabled, send the email
        if (submitData.sendInvitation) {
          try {
            const invitationData = {
              firstname: submitData.firstname,
              lastname: submitData.lastname,
              email: submitData.email,
              roleCode: submitData.role, // Optional, defaults to TEAM_MEMBER
              departmentId: submitData.departmentId, // Optional
              branchId: submitData.branchId, // Optional
              positionId: submitData.positionId,
            };

            await API_AUTH.platform_invite(invitationData);
            toast.success("User created successfully! Invitation email sent.");
          } catch (inviteError) {
            // User was created but invitation failed
            toast.warning(
              "User created, but failed to send invitation email. "
            );
            console.error("Invitation email error:", inviteError);
          }
        } else {
          toast.success("User created successfully");
        }
      }

      router.push("/admin/users");
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleGoBack}
          className="bg-gray-50 text-default hover:bg-primary/20"
          variant="outline"
        >
          <MoveLeftIcon className="size-4" />
          Back
        </Button>
        {isFromAD && (
          <div className="text-sm text-muted-foreground bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            Data loaded from Active Directory
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {isFromAD
                  ? "Review and complete user details from Active Directory"
                  : "Basic user details and contact information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
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
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isEditing && (
                <>
                  <FormField
                    control={form.control}
                    name="sendInvitation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-blue-50 border-blue-200">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Send Invitation Email
                          </FormLabel>
                          <FormDescription className="text-xs">
                            {field.value
                              ? "User will receive an email to set their own password"
                              : "You must set a password for this user"}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => {
                      const sendInvitation = form.watch("sendInvitation");
                      return (
                        <FormItem>
                          <FormLabel>
                            Password {!sendInvitation && "*"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={
                                sendInvitation
                                  ? "Not required - user will set their own"
                                  : "Enter password"
                              }
                              disabled={sendInvitation}
                              {...field}
                            />
                          </FormControl>
                          {sendInvitation ? (
                            <FormDescription className="text-green-600">
                              Password not required. User will set their
                              password via invitation email.
                            </FormDescription>
                          ) : (
                            <FormDescription>
                              Minimum 6 characters required
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role & Organization</CardTitle>
              <CardDescription>
                Assign role and organizational details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role._id} value={role._id}>
                              {role.name}
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
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept._id} value={dept._id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="positionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Position{" "}
                        {isFromAD && adJobTitle && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (AD: {adJobTitle})
                          </span>
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isFromAD && adJobTitle
                                  ? `Select position for: ${adJobTitle}`
                                  : "Select a position"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positions.map((pos) => (
                            <SelectItem key={pos._id} value={pos._id}>
                              {pos.name}
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
                  name="branchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch._id} value={branch._id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Configure user account status and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="is_super_admin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Super Admin</FormLabel>
                      <FormDescription>
                        Grant super admin privileges to this user
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Turn this user active or inactive
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_archived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Archived</FormLabel>
                      <FormDescription>
                        Archive this user account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
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
              {isEditing ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
