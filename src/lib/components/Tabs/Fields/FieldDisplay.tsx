"use client";

import { useEffect, useState } from "react";
import { Field } from "@/lib/types/form/fields";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/lib/ui/form";
import { Switch } from "@/lib/ui/switch";
import { Button } from "@/lib/ui/button";
import { UseFormReturn, useWatch } from "react-hook-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/lib/ui/collapsible";
import {
  MultiSelect,
  MultiSelectOption,
} from "@/lib/components/Common/MultiSelect";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { API_USER } from "@/lib/services/User/user_service";
import { Role } from "@/lib/types/role/role";
import { DepartmentOption } from "@/lib/types/department/department";
import { PositionOption } from "@/lib/types/position/position";
import { BranchOption } from "@/lib/types/branch/branch";
import { User } from "@/lib/types/user/user";
import {
  ChevronDown,
  Users,
  Building2,
  MapPin,
  Briefcase,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";

type Props = {
  field?: Field;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  loading: boolean | undefined;
};

const FieldDisplay = ({ form, loading }: Props) => {
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [hasLoadedOptions, setHasLoadedOptions] = useState(false);

  // Options state
  const [roleOptions, setRoleOptions] = useState<MultiSelectOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<
    MultiSelectOption[]
  >([]);
  const [positionOptions, setPositionOptions] = useState<MultiSelectOption[]>(
    []
  );
  const [branchOptions, setBranchOptions] = useState<MultiSelectOption[]>([]);
  const [userOptions, setUserOptions] = useState<MultiSelectOption[]>([]);

  // Watch sensitiveInfo to conditionally show access section
  const sensitiveInfo = useWatch({
    control: form.control,
    name: "display.sensitiveInfo",
  });

  // Fetch options when sensitiveInfo is enabled and section is opened
  useEffect(() => {
    if (sensitiveInfo && isAccessOpen && !hasLoadedOptions) {
      fetchOptions();
    }
  }, [sensitiveInfo, isAccessOpen, hasLoadedOptions]);

  const fetchOptions = async () => {
    setIsLoadingOptions(true);
    try {
      const [rolesData, deptData, posData, branchData, usersData] =
        await Promise.all([
          API_ROLE.getActiveRoles(),
          API_DEPARTMENT.getActiveDepartments(),
          API_POSITION.getActivePositions(),
          API_BRANCH.getActiveBranches(),
          API_USER.getAllUsers("?limit=10000"),
        ]);

      setRoleOptions(
        rolesData.map((role: Role) => ({
          label: role.name,
          value: role._id,
          description: role.code,
        }))
      );

      setDepartmentOptions(
        deptData.data.map((dept: DepartmentOption) => ({
          label: dept.name,
          value: dept._id,
          description: dept.code,
        }))
      );

      setPositionOptions(
        posData.data.map((pos: PositionOption) => ({
          label: pos.name,
          value: pos._id,
          description: pos.code,
        }))
      );

      setBranchOptions(
        branchData.data.map((branch: BranchOption) => ({
          label: branch.name,
          value: branch._id,
          description: branch.code,
        }))
      );

      setUserOptions(
        usersData.data.map((user: User) => ({
          label: `${user.firstname} ${user.lastname}`,
          value: user._id,
          description: user.email,
        }))
      );

      setHasLoadedOptions(true);
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  // Initialize sensitiveAccess with defaults when sensitiveInfo is enabled
  useEffect(() => {
    if (sensitiveInfo) {
      const currentAccess = form.getValues("display.sensitiveAccess");
      if (!currentAccess) {
        form.setValue("display.sensitiveAccess", {
          allowSubmitter: true,
          allowApprovers: true,
          roles: [],
          positions: [],
          departments: [],
          branches: [],
          userIds: [],
        });
      }
    }
  }, [sensitiveInfo, form]);

  return (
    <div className="flex-1 space-y-4">
      <h3 className="text-lg font-semibold">Display Settings</h3>
      <p className="text-sm text-muted-foreground">
        Control where and how this field appears in your application
      </p>
      {/* Show in Table */}
      <FormField
        control={form.control}
        name="display.showInTable"
        render={({ field }) => {
          return (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show in Table</FormLabel>
                <FormDescription>
                  Display this field in table/list views
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
          );
        }}
      />
      <FormField
        control={form.control}
        name="display.showInForm"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Show in Form</FormLabel>
              <FormDescription>
                Display this field when creating or editing records
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
      {/* Show in Detail */}
      <FormField
        control={form.control}
        name="display.showInDetail"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Show in Detail</FormLabel>
              <FormDescription>
                Display this field in detail/preview views
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
      {/* Sensitive Info */}
      <FormField
        control={form.control}
        name="display.sensitiveInfo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Sensitive Information</FormLabel>
              <FormDescription>
                Mark this field as containing sensitive data (e.g., salary,
                passwords)
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

      {/* Sensitive Access Configuration - Only show when sensitiveInfo is ON */}
      {sensitiveInfo && (
        <Collapsible
          open={isAccessOpen}
          onOpenChange={setIsAccessOpen}
          className="rounded-lg border border-amber-200 bg-amber-50/30 dark:border-amber-900 dark:bg-amber-950/10"
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="flex w-full items-center justify-between p-4 hover:bg-amber-100/50 dark:hover:bg-amber-950/30"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                <span className="font-medium">Access Configuration</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isAccessOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure who can view this sensitive field. By default,
              submitters and approvers can view the data.
            </p>

            {/* Allow Submitter */}
            <FormField
              control={form.control}
              name="display.sensitiveAccess.allowSubmitter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-white dark:bg-background">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Allow Submitter</FormLabel>
                    <FormDescription className="text-xs">
                      The person who submitted the form can view this field
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Allow Approvers */}
            <FormField
              control={form.control}
              name="display.sensitiveAccess.allowApprovers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-white dark:bg-background">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Allow Approvers</FormLabel>
                    <FormDescription className="text-xs">
                      Users in the approval workflow can view this field
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Divider */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Additional Access</p>
              <p className="text-xs text-muted-foreground mb-4">
                Grant access to specific roles, departments, positions,
                branches, or users
              </p>
            </div>

            {/* Roles MultiSelect */}
            <FormField
              control={form.control}
              name="display.sensitiveAccess.roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    Roles
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={roleOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select roles..."
                      searchPlaceholder="Search roles..."
                      emptyMessage="No roles found"
                      disabled={loading || isLoadingOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Departments MultiSelect */}
            <FormField
              control={form.control}
              name="display.sensitiveAccess.departments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4" />
                    Departments
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={departmentOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select departments..."
                      searchPlaceholder="Search departments..."
                      emptyMessage="No departments found"
                      disabled={loading || isLoadingOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Positions MultiSelect */}
            <FormField
              control={form.control}
              name="display.sensitiveAccess.positions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4" />
                    Positions
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={positionOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select positions..."
                      searchPlaceholder="Search positions..."
                      emptyMessage="No positions found"
                      disabled={loading || isLoadingOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Branches MultiSelect */}
            <FormField
              control={form.control}
              name="display.sensitiveAccess.branches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    Branches
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={branchOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select branches..."
                      searchPlaceholder="Search branches..."
                      emptyMessage="No branches found"
                      disabled={loading || isLoadingOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Users MultiSelect */}
            <FormField
              control={form.control}
              name="display.sensitiveAccess.userIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <UserIcon className="w-4 h-4" />
                    Specific Users
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={userOptions}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select users..."
                      searchPlaceholder="Search users..."
                      emptyMessage="No users found"
                      disabled={loading || isLoadingOptions}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default FieldDisplay;
