"use client";

import { Label } from "@/lib/ui/label";
import { User } from "@/lib/types/user/user";
import { Role } from "@/lib/types/role/role";
import React, { useState, useEffect, useMemo } from "react";
import { Branch } from "@/lib/types/branch/branch";
import { MultiEmailInput } from "./MultiEmailInput";
import { Position } from "@/lib/types/position/position";
import { API_USER } from "@/lib/services/User/user_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { Department } from "@/lib/types/department/department";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { NotificationReceivers } from "@/lib/types/actions/action";
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { MultiSelect, MultiSelectOption } from "@/lib/components/Common/MultiSelect";

type NotificationReceiversInputProps = {
  value: NotificationReceivers | undefined;
  onChange: (value: NotificationReceivers) => void;
  onBlur?: () => void;
};

export const NotificationReceiversInput = ({
  value = {},
  onChange,
  onBlur,
}: NotificationReceiversInputProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          deptResponse,
          posResponse,
          branchResponse,
          userResponse,
          roleResponse,
        ] = await Promise.all([
          API_DEPARTMENT.getAllDepartments(),
          API_POSITION.getAllPositions(),
          API_BRANCH.getAllBranches(),
          API_USER.getAllUsers(),
          API_ROLE.getAllRoles(),
        ]);
        setDepartments(deptResponse.data);
        setPositions(posResponse.data);
        setBranches(branchResponse.data);
        setUsers(userResponse.data || []);
        setRoles(roleResponse.data || []);
      } catch (error) {
        console.error("Failed to load data for notification receivers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEmailsChange = (emails: string[]) => {
    onChange({ ...value, emails });
  };

  const handleFieldChange = (field: keyof NotificationReceivers, values: string[]) => {
    onChange({
      ...value,
      [field]: values.length > 0 ? values : undefined,
    });
  };

  const getUserFullName = (user: User): string => {
    return `${user.firstname} ${user.lastname}`.trim() || user.email;
  };

  // Convert data to MultiSelect options
  const userOptions: MultiSelectOption[] = useMemo(
    () => users.map((u) => ({ value: u._id, label: getUserFullName(u) })),
    [users]
  );

  const roleOptions: MultiSelectOption[] = useMemo(
    () => roles.map((r) => ({ value: r._id, label: r.name })),
    [roles]
  );

  const positionOptions: MultiSelectOption[] = useMemo(
    () => positions.map((p) => ({ value: p._id, label: p.name })),
    [positions]
  );

  const departmentOptions: MultiSelectOption[] = useMemo(
    () => departments.map((d) => ({ value: d._id, label: d.name })),
    [departments]
  );

  const branchOptions: MultiSelectOption[] = useMemo(
    () => branches.map((b) => ({ value: b._id, label: b.name })),
    [branches]
  );

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <div className="space-y-1">
        <Label className="text-base font-medium">Notification Receivers</Label>
        <p className="text-xs text-muted-foreground">
          Select users who should be notified about this approval. They will
          receive notifications but cannot approve or reject.
        </p>
      </div>

      {/* Emails Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Email Addresses</Label>
        <MultiEmailInput
          value={value.emails || []}
          onChange={handleEmailsChange}
          onBlur={onBlur}
          placeholder="Enter email addresses"
        />
      </div>

      {/* Users MultiSelect */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Specific Users</Label>
        <MultiSelect
          options={userOptions}
          selected={value.userIds || []}
          onChange={(values) => handleFieldChange("userIds", values)}
          placeholder="Select users..."
          searchPlaceholder="Search users..."
          emptyMessage="No users found"
          disabled={loading}
        />
      </div>

      {/* Roles MultiSelect */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Roles</Label>
        <MultiSelect
          options={roleOptions}
          selected={value.roles || []}
          onChange={(values) => handleFieldChange("roles", values)}
          placeholder="Select roles..."
          searchPlaceholder="Search roles..."
          emptyMessage="No roles found"
          disabled={loading}
        />
      </div>

      {/* Positions MultiSelect */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Positions</Label>
        <MultiSelect
          options={positionOptions}
          selected={value.positions || []}
          onChange={(values) => handleFieldChange("positions", values)}
          placeholder="Select positions..."
          searchPlaceholder="Search positions..."
          emptyMessage="No positions found"
          disabled={loading}
        />
      </div>

      {/* Departments MultiSelect */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Departments</Label>
        <MultiSelect
          options={departmentOptions}
          selected={value.departments || []}
          onChange={(values) => handleFieldChange("departments", values)}
          placeholder="Select departments..."
          searchPlaceholder="Search departments..."
          emptyMessage="No departments found"
          disabled={loading}
        />
      </div>

      {/* Branches MultiSelect */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Branches</Label>
        <MultiSelect
          options={branchOptions}
          selected={value.branches || []}
          onChange={(values) => handleFieldChange("branches", values)}
          placeholder="Select branches..."
          searchPlaceholder="Search branches..."
          emptyMessage="No branches found"
          disabled={loading}
        />
      </div>
    </div>
  );
};
