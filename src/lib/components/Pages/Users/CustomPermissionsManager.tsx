"use client";

import { useState, useEffect, useCallback } from "react";
import { API_PERMISSION } from "@/lib/services/Permission/permission_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { API_USER } from "@/lib/services/User/user_service";
import type { PermissionGroup, Permission } from "@/lib/types/role/role";
import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";
import { Checkbox } from "@/lib/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types/user/user";

type CustomPermissionsManagerProps = {
  userId: string;
};

// Group permissions by their CRUD action
type CRUDPermissions = {
  create: Permission[];
  read: Permission[];
  update: Permission[];
  delete: Permission[];
};

const CustomPermissionsManager = ({ userId }: CustomPermissionsManagerProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User>();
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  // Track which permissions are currently checked (effective permissions)
  const [checkedPermissions, setCheckedPermissions] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  // Track current server state for custom permissions
  const [serverGranted, setServerGranted] = useState<string[]>([]);
  const [serverDenied, setServerDenied] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [userData, permissionsData, userPermissionsData] = await Promise.all([
        API_USER.getUserById(userId),
        API_ROLE.getAvailablePermissions(true),
        API_PERMISSION.getUserPermissions(userId),
      ]);

      setUser(userData);
      setPermissionGroups(permissionsData);

      // Get role permissions from the user permissions API
      const userRolePermissions = userPermissionsData.rolePermissions || [];
      setRolePermissions(userRolePermissions);

      // Calculate effective permissions (role + granted - denied)
      const customGranted = userPermissionsData.grantedPermissions || [];
      const customDenied = userPermissionsData.deniedPermissions || [];

      // Store server state for comparison during save
      setServerGranted(customGranted);
      setServerDenied(customDenied);

      const effective = new Set<string>();

      // Add all role permissions
      userRolePermissions.forEach((perm: string) => {
        // Only add if not in denied
        if (!customDenied.includes(perm)) {
          effective.add(perm);
        }
      });

      // Add custom granted
      customGranted.forEach((perm: string) => {
        effective.add(perm);
      });

      setCheckedPermissions(effective);
    } catch (error) {
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
            // If checked and from role = default (no custom needed)
            // If unchecked and not from role = default (no custom needed)
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
          await API_PERMISSION.grantUserPermissions(userId, { permissions: newGrants });
        }
        if (newDenies.length > 0) {
          await API_PERMISSION.denyUserPermissions(userId, { permissions: newDenies });
        }
      } else {
        // Just add new permissions without clearing
        if (grantsToAdd.length > 0) {
          await API_PERMISSION.grantUserPermissions(userId, { permissions: grantsToAdd });
        }
        if (deniesToAdd.length > 0) {
          await API_PERMISSION.denyUserPermissions(userId, { permissions: deniesToAdd });
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
    if (!confirm("Are you sure you want to clear all custom permissions and revert to role defaults?")) {
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

  // Group permissions by CRUD action
  const groupPermissionsByCRUD = (permissions: Permission[]): CRUDPermissions => {
    const grouped: CRUDPermissions = {
      create: [],
      read: [],
      update: [],
      delete: [],
    };

    permissions.forEach((perm) => {
      const key = perm.key.toLowerCase();
      if (key.includes(".create") || key.includes(".manage")) {
        grouped.create.push(perm);
      } else if (key.includes(".view") || key.includes(".read")) {
        grouped.read.push(perm);
      } else if (key.includes(".edit") || key.includes(".update")) {
        grouped.update.push(perm);
      } else if (key.includes(".delete")) {
        grouped.delete.push(perm);
      } else {
        // If doesn't match any CRUD, put in read as default
        grouped.read.push(perm);
      }
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {user?.firstname} {user?.lastname} - Custom Permissions
          </h2>
          <p className="text-muted-foreground">
            Role: <Badge variant="outline">{user?.role?.name || "No Role"}</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={saving}>
            Clear Custom
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>

      {permissionGroups && (
        <div className="border rounded-lg overflow-hidden bg-card">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-base border-r">Module</th>
                <th className="text-center py-4 px-6 font-semibold text-base border-r w-32">Create</th>
                <th className="text-center py-4 px-6 font-semibold text-base border-r w-32">Read</th>
                <th className="text-center py-4 px-6 font-semibold text-base border-r w-32">Update</th>
                <th className="text-center py-4 px-6 font-semibold text-base w-32">Delete</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissionGroups).map(([moduleName, permissions]) => {
                const crudGroups = groupPermissionsByCRUD(permissions);
                const allModulePermissions = permissions.map((p) => p.key);
                const allChecked = allModulePermissions.every((key) => checkedPermissions.has(key));

                return (
                  <tr key={moduleName} className="border-t hover:bg-muted/30">
                    <td className="py-4 px-6 border-r">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={allChecked}
                          onCheckedChange={(checked) =>
                            handleModuleToggle(permissions, checked === true)
                          }
                        />
                        <span className="font-medium text-base">{moduleName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 border-r">
                      <div className="flex justify-center gap-2">
                        {crudGroups.create.map((perm) => (
                          <Checkbox
                            key={perm.key}
                            checked={checkedPermissions.has(perm.key)}
                            onCheckedChange={() => handlePermissionToggle(perm.key)}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 border-r">
                      <div className="flex justify-center gap-2">
                        {crudGroups.read.map((perm) => (
                          <Checkbox
                            key={perm.key}
                            checked={checkedPermissions.has(perm.key)}
                            onCheckedChange={() => handlePermissionToggle(perm.key)}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 border-r">
                      <div className="flex justify-center gap-2">
                        {crudGroups.update.map((perm) => (
                          <Checkbox
                            key={perm.key}
                            checked={checkedPermissions.has(perm.key)}
                            onCheckedChange={() => handlePermissionToggle(perm.key)}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        {crudGroups.delete.map((perm) => (
                          <Checkbox
                            key={perm.key}
                            checked={checkedPermissions.has(perm.key)}
                            onCheckedChange={() => handlePermissionToggle(perm.key)}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomPermissionsManager;
