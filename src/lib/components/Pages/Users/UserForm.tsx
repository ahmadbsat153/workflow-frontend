"use client";

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

import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/lib/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { Switch } from "@/lib/ui/switch";
import { useForm } from "react-hook-form";
import { URLs } from "@/lib/constants/urls";
import type { Role } from "@/lib/types/role/role";
import { ErrorResponse, SuccessResponse } from "@/lib/types/common";
import type { ADUser } from "@/lib/types/user/user";
import { handleServerError } from "@/lib/api/_axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_AUTH } from "@/lib/services/auth_service";
import { useEffect, useState, useCallback, Suspense } from "react";
import { API_USER } from "@/lib/services/User/user_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { useRouter, useSearchParams } from "next/navigation";
import type { BranchOption } from "@/lib/types/branch/branch";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import type { PositionOption } from "@/lib/types/position/position";
import { API_POSITION } from "@/lib/services/Position/position_service";
import type { DepartmentOption } from "@/lib/types/department/department";
import FixedHeaderFooterLayout from "../../Layout/FixedHeaderFooterLayout";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import DotsLoader from "../../Loader/DotsLoader";
import { getSubmitterInfoFieldConfig } from "@/utils/fieldUtils";

type UserFormProps = {
  userId?: string;
  title: string;
  description: string;
};

const userSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().optional(),
    role: z.string().min(1, "Role is required"),
    departmentId: z.string().min(1, "Department is required"),
    positionId: z.string().nullable().optional(),
    branchId: z.string().min(1, "Branch is required"),
    is_super_admin: z.boolean(),
    is_active: z.boolean(),
    is_archived: z.boolean(),
    sendInvitation: z.boolean().optional(),
    // Business Information
    businessInformation: z.object({
      payrollNo: z.string().optional(),
      businessUnit: z.string().optional(),
      businessUnitAddress: z.string().optional(),
      paymentMethod: z.enum(["weekly", "monthly"]).nullable().optional(),
    }).optional(),
  })
  .refine(
    (data) => {
      // Password is required only when creating a new user (sendInvitation exists) AND sendInvitation is false
      // When editing (sendInvitation is undefined), password is always optional
      if (data.sendInvitation === false) {
        // Creating user without invitation - password required
        return data.password && data.password.length >= 6;
      }
      // Editing user OR creating with invitation - password optional
      return true;
    },
    {
      message: "Password must be at least 6 characters",
      path: ["password"],
    }
  );

const UserForm = ({ userId, title, description }: UserFormProps) => {
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
    mode: "onChange", // Enable validation on change
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      departmentId: "",
      positionId: null,
      branchId: "",
      is_super_admin: false,
      is_active: true,
      is_archived: false,
      sendInvitation: false,
      businessInformation: {
        payrollNo: "",
        businessUnit: "",
        businessUnitAddress: "",
        paymentMethod: null,
      },
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

      const resetData = {
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        password: undefined, // Don't populate password on edit
        role: roleValue || "",
        departmentId:
          typeof userData.departmentId === "string"
            ? userData.departmentId
            : userData.departmentId?._id || "",
        positionId:
          typeof userData.positionId === "string"
            ? userData.positionId
            : userData.positionId?._id || null,
        branchId:
          typeof userData.branchId === "string"
            ? userData.branchId
            : userData.branchId?._id || "",
        is_super_admin: userData.is_super_admin || false,
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        is_archived: userData.is_archived || false,
        businessInformation: {
          payrollNo: userData.businessInformation?.payrollNo || "",
          businessUnit: userData.businessInformation?.businessUnit || "",
          businessUnitAddress: userData.businessInformation?.businessUnitAddress || "",
          paymentMethod: userData.businessInformation?.paymentMethod || null,
        },
      };

      form.reset(resetData);

      // Trigger validation after reset to ensure form is valid
      setTimeout(() => {
        form.trigger();
      }, 100);
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
        } catch (error) {
          const err_result = error as ErrorResponse;
          handleServerError(err_result, (err_msg) => {
            toast.error(err_msg || "Failed to load AD user data");
          });
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

  // Separate effect for position matching - runs after positions are loaded
  useEffect(() => {
    const adUserParam = searchParams.get("adUser");
    if (
      adUserParam &&
      !userId &&
      isFromAD &&
      positions.length > 0 &&
      adJobTitle
    ) {
      try {
        const adUser: ADUser = JSON.parse(decodeURIComponent(adUserParam));

        // Try to match AD jobTitle with existing positions (case-insensitive)
        let matchedPositionId = null;
        const normalizedJobTitle = adJobTitle.toLowerCase().trim();

        const matchedPosition = positions.find(
          (pos) => pos.name.toLowerCase().trim() === normalizedJobTitle
        );

        if (matchedPosition) {
          matchedPositionId = matchedPosition._id;
          setShouldCreatePosition(false);
        } else {
          setShouldCreatePosition(true);
        }

        // Pre-fill form with AD user data
        form.reset({
          firstname: adUser.givenName || "",
          lastname: adUser.surname || "",
          email: adUser.mail || adUser.userPrincipalName || "",
          phone: adUser.mobilePhone || adUser.businessPhones?.[0] || "",
          password: "", // User will need to set a password
          role: "",
          departmentId: "",
          positionId: matchedPositionId,
          branchId: "",
          is_super_admin: false,
          is_active:
            adUser.accountEnabled !== undefined ? adUser.accountEnabled : true,
          is_archived: false,
          sendInvitation: true, // Default to invitation for AD users
        });
      } catch (error) {
        console.error("Error matching position:", error);
      }
    }
  }, [positions, isFromAD, adJobTitle]);

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      setLoading(true);

      // Remove password from update if not provided
      const submitData = { ...values };
      if (isEditing && !submitData.password) {
        delete submitData.password;
      }
      if (
        isFromAD &&
        shouldCreatePosition &&
        adJobTitle &&
        !submitData.positionId
      ) {
        try {
          // Generate a unique code from the job title with timestamp to avoid conflicts
          const baseCode = adJobTitle
            .split(" ")
            .map((word) => word.substring(0, 3))
            .join("")
            .toUpperCase()
            .substring(0, 7);

          // Add timestamp suffix to ensure uniqueness
          const posCode = `${baseCode}_${Date.now().toString().slice(-3)}`;

          const createResponse = await API_POSITION.createPosition({
            name: adJobTitle,
            code: posCode,
            description: `Imported from Active Directory`,
            isActive: true,
          });

          // Check if the response includes the created position data with ID
          if (
            createResponse &&
            typeof createResponse === "object" &&
            "data" in createResponse
          ) {
            const responseData = createResponse as SuccessResponse & {
              data: { _id: string };
            };
            if (responseData.data && responseData.data._id) {
              // Use the ID directly from the response
              submitData.positionId = responseData.data._id;
            } else {
              toast.warning(`Please select position manually.`);
            }
          }
        } catch (error) {
          // Position creation failed - might already exist or other error
          toast.warning(
            `Could not auto-create position. Please select manually.`
          );
          console.error("Position creation error:", error);
          // Don't block user creation, just let them select position manually
        }
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
            // Find the role code from the role ID
            let roleCode = null;
            if (submitData.role) {
              const selectedRole = roles.find((r) => r._id === submitData.role);
              roleCode = selectedRole?.code || null;
            }

            const invitationData = {
              firstname: submitData.firstname,
              lastname: submitData.lastname,
              email: submitData.email,
              roleCode: roleCode, // Use role code, not role ID
              departmentId: submitData.departmentId, // Optional
              branchId: submitData.branchId, // Optional
              positionId: submitData.positionId,
            };

            await API_AUTH.platform_invite(invitationData);
            toast.success("User created successfully! Invitation email sent.");
          } catch (inviteError) {
            // User was created but invitation failed
            toast.warning("User created, but failed to send invitation email.");
            console.error("Invitation email error:", inviteError);
          }
        } else {
          toast.success("User created successfully");
        }
      }

      router.push(URLs.admin.users.index);
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
    <FixedHeaderFooterLayout
      title={title}
      description={description}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoBack}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button type="submit" form="user-form" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update User" : "Create User"}
          </Button>
        </div>
      }
      maxWidth="3xl"
      maxHeight="90vh"
    >
      <div className="space-y-6 max-w-4xl">
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={(e) => {
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-6"
          >
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
                        <FormLabel>{getSubmitterInfoFieldConfig("firstname").label} *</FormLabel>
                        <FormControl>
                          <Input placeholder={getSubmitterInfoFieldConfig("firstname").config.placeholder} {...field} />
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
                        <FormLabel>{getSubmitterInfoFieldConfig("lastname").label} *</FormLabel>
                        <FormControl>
                          <Input placeholder={getSubmitterInfoFieldConfig("lastname").config.placeholder} {...field} />
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
                        <FormLabel>{getSubmitterInfoFieldConfig("email").label} *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={getSubmitterInfoFieldConfig("email").config.placeholder}
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
                        <FormLabel>{getSubmitterInfoFieldConfig("phone").label}</FormLabel>
                        <FormControl>
                          <Input placeholder={getSubmitterInfoFieldConfig("phone").config.placeholder} {...field} />
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
                        <FormLabel>Role *</FormLabel>
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
                        <FormLabel>Department *</FormLabel>
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
                        <FormLabel>Branch *</FormLabel>
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
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Payroll and business unit details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="businessInformation.payrollNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getSubmitterInfoFieldConfig("payrollNo").label}</FormLabel>
                        <FormControl>
                          <Input placeholder={getSubmitterInfoFieldConfig("payrollNo").config.placeholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessInformation.paymentMethod"
                    render={({ field }) => {
                      const paymentConfig = getSubmitterInfoFieldConfig("paymentMethod");
                      return (
                        <FormItem>
                          <FormLabel>{paymentConfig.label}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={paymentConfig.config.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentConfig.config.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="businessInformation.businessUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getSubmitterInfoFieldConfig("businessUnit").label}</FormLabel>
                      <FormControl>
                        <Input placeholder={getSubmitterInfoFieldConfig("businessUnit").config.placeholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessInformation.businessUnitAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getSubmitterInfoFieldConfig("businessUnitAddress").label}</FormLabel>
                      <FormControl>
                        <Input placeholder={getSubmitterInfoFieldConfig("businessUnitAddress").config.placeholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
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
          </form>
        </Form>
      </div>
    </FixedHeaderFooterLayout>
  );
};

export default function CreateUserPage({
  userId,
  title,
  description,
}: UserFormProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center">
          <DotsLoader />
        </div>
      }
    >
      <UserForm
        userId={userId}
        title={title}
        description={description}
      />
    </Suspense>
  );
}
