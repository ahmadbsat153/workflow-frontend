"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/ui/tooltip";
import { toast } from "sonner";
import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/lib/ui/checkbox";
import type { User } from "@/lib/types/user/user";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { useState, useEffect, useCallback } from "react";
import { API_USER } from "@/lib/services/User/user_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import type { PermissionGroup, Permission } from "@/lib/types/role/role";
import { API_PERMISSION } from "@/lib/services/Permission/permission_service";

type UserPermissionsManagerProps = {
  userId: string;
};

const UserPermissionsManager = ({ userId }: UserPermissionsManagerProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [permissionGroups, setPermissionGroups] =
    useState<PermissionGroup | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  // Track which permissions are currently checked (effective permissions)
  const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Track current server state for custom permissions
  const [serverGranted, setServerGranted] = useState<string[]>([]);
  const [serverDenied, setServerDenied] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [userData, permissionsData] = await Promise.all([
        API_USER.getUserById(userId),
        API_ROLE.getAvailablePermissions(true),
      ]);
      setUser(userData);
      setPermissionGroups(permissionsData);
      // Get role permissions - check if role exists and has permissions
      let userRolePermissions: string[] = [];

      if (userData.role && typeof userData.role === "object") {
        // Role is an object with { id, code, name }
        // Need to fetch full role details with permissions

        try {
          // Fetch role by code/name using the GET_NAME endpoint
          const roleData = await API_ROLE.getRoleByName(userData.role.code);

          // Extract permission keys from Permission objects
          if (Array.isArray(roleData.permissions)) {
            userRolePermissions = roleData.permissions.map((p: Permission | string) =>
              typeof p === "string" ? p : p.key
            );
          } else {
            userRolePermissions = [];
          }

          // User data already has the role reference, no need to update it
          setUser(userData);
        } catch (roleError) {
          console.error("✗ Error fetching role details:", roleError);
        }
      } else {
        console.error("✗ Role is null, undefined, or unexpected type");
      }

      setRolePermissions(userRolePermissions);

      // Calculate which permissions should be checked:
      // 1. Permission is in role.permissions (from their assigned role)
      // 2. Permission is in customPermissions.granted (custom grant)
      const customGranted = userData.customPermissions?.granted || [];
      const customDenied = userData.customPermissions?.denied || [];

      // Store server state for comparison during save
      setServerGranted(customGranted);
      setServerDenied(customDenied);

      const effective = new Set<string>();

      // Add all role permissions (these are checked by default)
      userRolePermissions.forEach((perm: string) => {
        // Only add if not in denied
        if (!customDenied.includes(perm)) {
          effective.add(perm);
        }
      });

      // Add custom granted permissions (these are also checked)
      customGranted.forEach((perm: string) => {
        effective.add(perm);
      });

      setCheckedPermissions(effective);
    } catch (error) {
      console.error("Error fetching data:", error);
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePermissionToggle = (permissionKey: string) => {
    setCheckedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionKey)) {
        newSet.delete(permissionKey);
      } else {
        newSet.add(permissionKey);
      }
      return newSet;
    });
    setHasChanges(true);
  };

  const handleModuleToggle = (permissions: Permission[], checked: boolean) => {
    setCheckedPermissions((prev) => {
      const newSet = new Set(prev);
      permissions.forEach((perm) => {
        if (checked) {
          newSet.add(perm.key);
        } else {
          newSet.delete(perm.key);
        }
      });
      return newSet;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const newGrants: string[] = [];
      const newDenies: string[] = [];

      // Check all available permissions
      if (permissionGroups) {
        Object.values(permissionGroups).forEach((permissions) => {
          permissions.forEach((perm) => {
            const isChecked = checkedPermissions.has(perm.key);
            const isFromRole = rolePermissions.includes(perm.key);

            if (isChecked && !isFromRole) {
              // Checked but not from role = custom grant
              newGrants.push(perm.key);
            } else if (!isChecked && isFromRole) {
              // Unchecked but from role = custom deny
              newDenies.push(perm.key);
            }
          });
        });
      }

      // Calculate what needs to be added/removed by comparing with server state
      const grantsToAdd = newGrants.filter((p) => !serverGranted.includes(p));
      const grantsToRemove = serverGranted.filter((p) => !newGrants.includes(p));
      const deniesToAdd = newDenies.filter((p) => !serverDenied.includes(p));
      const deniesToRemove = serverDenied.filter((p) => !newDenies.includes(p));

      // Only clear if we need to remove some custom permissions
      const needsClear = grantsToRemove.length > 0 || deniesToRemove.length > 0;

      if (needsClear) {
        // Clear all and re-apply everything
        await API_PERMISSION.clearUserCustomPermissions(userId);

        if (newGrants.length > 0) {
          await API_PERMISSION.grantUserPermissions(userId, {
            permissions: newGrants,
          });
        }
        if (newDenies.length > 0) {
          await API_PERMISSION.denyUserPermissions(userId, {
            permissions: newDenies,
          });
        }
      } else {
        // Just add new permissions without clearing
        if (grantsToAdd.length > 0) {
          await API_PERMISSION.grantUserPermissions(userId, {
            permissions: grantsToAdd,
          });
        }
        if (deniesToAdd.length > 0) {
          await API_PERMISSION.denyUserPermissions(userId, {
            permissions: deniesToAdd,
          });
        }
      }

      toast.success("Permissions updated successfully");
      setHasChanges(false);
      fetchData();
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClearAll = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all custom permissions and revert to role defaults?"
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      await API_PERMISSION.clearUserCustomPermissions(userId);
      toast.success("All custom permissions cleared");
      fetchData();
      setHasChanges(false);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setSaving(false);
    }
  };

  const getPermissionBadge = (permissionKey: string) => {
    const isFromRole = rolePermissions.includes(permissionKey);
    const isChecked = checkedPermissions.has(permissionKey);

    if (isChecked && isFromRole) {
      return (
        <Badge
          variant="outline"
          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
        >
          From Role
        </Badge>
      );
    } else if (isChecked && !isFromRole) {
      return (
        <Badge
          variant="outline"
          className="text-xs bg-green-50 text-green-700 border-green-200"
        >
          Custom Grant
        </Badge>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Role:</span>
                <Badge variant="secondary" className="font-medium">
                  {user?.is_super_admin
                    ? "Super Admin"
                    : user?.role?.name || "No Role"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={saving}
            >
              Clear Custom
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Permission Modules */}
        {permissionGroups && (
          <div className="space-y-6">
            {Object.entries(permissionGroups).map(
              ([moduleName, permissions]) => {
                const allModulePermissions = permissions.map((p) => p.key);
                const allChecked = allModulePermissions.every((key) =>
                  checkedPermissions.has(key)
                );
                const someChecked = allModulePermissions.some((key) =>
                  checkedPermissions.has(key)
                );

                return (
                  <Card key={moduleName} className="overflow-hidden shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={allChecked}
                            onCheckedChange={(checked) =>
                              handleModuleToggle(permissions, checked === true)
                            }
                            className="mt-0.5"
                          />
                          <div>
                            <CardTitle className="text-xl">
                              {moduleName}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {permissions.length} permission
                              {permissions.length !== 1 ? "s" : ""} available
                            </CardDescription>
                          </div>
                        </div>
                        {someChecked && (
                          <Badge variant="outline" className="bg-white">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {
                              allModulePermissions.filter((key) =>
                                checkedPermissions.has(key)
                              ).length
                            }{" "}
                            / {permissions.length}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/30">
                              <th className="text-left py-3 px-6 font-medium text-sm w-12">
                                <span className="sr-only">Checkbox</span>
                              </th>
                              <th className="text-left py-3 px-6 font-medium text-sm">
                                Permission
                              </th>
                              <th className="text-left py-3 px-6 font-medium text-sm">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {permissions.map((permission) => {
                              const isChecked = checkedPermissions.has(
                                permission.key
                              );

                              return (
                                <tr
                                  key={permission.key}
                                  className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                                >
                                  <td className="py-4 px-6">
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={() =>
                                        handlePermissionToggle(permission.key)
                                      }
                                    />
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-start gap-3">
                                      <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="font-medium text-sm cursor-help hover:text-primary transition-colors">
                                                {permission.label}
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent
                                              side="top"
                                              className="bg-cultured text-primary [&>span]:fill-cultured"
                                            >
                                              <p className="text-sm text-secondary">
                                                {permission.description}
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                          {permission.dangerous && (
                                            <Badge
                                              variant="destructive"
                                              className=""
                                            >
                                              <ShieldAlert className="size-4 " />
                                            </Badge>
                                          )}
                                        </div>
                                        <code className="text-xs text-muted-foreground font-mono">
                                          {permission.key}
                                        </code>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-6">
                                    {getPermissionBadge(permission.key)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default UserPermissionsManager;
