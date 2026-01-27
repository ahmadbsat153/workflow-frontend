"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/lib/ui/collapsible";
import { Label } from "@/lib/ui/label";
import { Badge } from "@/lib/ui/badge";
import { Button } from "@/lib/ui/button";
import { Checkbox } from "@/lib/ui/checkbox";
import { User } from "@/lib/types/user/user";
import { Role } from "@/lib/types/role/role";
import React, { useState, useEffect } from "react";
import { Branch } from "@/lib/types/branch/branch";
import { MultiEmailInput } from "./MultiEmailInput";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Position } from "@/lib/types/position/position";
import { API_USER } from "@/lib/services/User/user_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { Department } from "@/lib/types/department/department";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { NotificationReceivers } from "@/lib/types/actions/action";
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";

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

  const [openSections, setOpenSections] = useState({
    emails: true,
    users: false,
    roles: false,
    positions: false,
    departments: false,
    branches: false,
  });

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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEmailsChange = (emails: string[]) => {
    onChange({ ...value, emails });
  };

  const handleMultiSelectChange = (
    field: keyof NotificationReceivers,
    itemId: string,
    checked: boolean,
  ) => {
    const currentValues = (value[field] as string[]) || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, itemId];
    } else {
      newValues = currentValues.filter((id) => id !== itemId);
    }

    onChange({
      ...value,
      [field]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const getUserFullName = (user: User): string => {
    return `${user.firstname} ${user.lastname}`.trim() || user.email;
  };


  const renderCheckboxList = (
    field: keyof NotificationReceivers,
    items: Array<{ _id: string; name: string }>,
    emptyMessage: string,
  ) => {
    const selectedIds = (value[field] as string[]) || [];

    if (loading) {
      return <p className="text-sm text-muted-foreground">Loading...</p>;
    }

    if (items.length === 0) {
      return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
    }

    return (
      <div className="max-h-48 overflow-y-auto space-y-2">
        {items.map((item) => (
          <div key={item._id} className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              id={`${field}-${item._id}`}
              className="cursor-pointer"
              checked={selectedIds.includes(item._id)}
              onCheckedChange={(checked) =>
                handleMultiSelectChange(field, item._id, checked as boolean)
              }
            />
            <label
              htmlFor={`${field}-${item._id}`}
              className="text-sm cursor-pointer"
            >
              {item.name}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const getSectionCount = (field: keyof NotificationReceivers): number => {
    if (field === "emails") {
      return (value.emails || []).length;
    }
    return ((value[field] as string[]) || []).length;
  };

  return (
    <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
      <div className="space-y-1">
        <Label className="text-base font-medium">Notification Receivers</Label>
        <p className="text-xs text-muted-foreground">
          Select users who should be notified about this approval. They will
          receive notifications but cannot approve or reject.
        </p>
      </div>

      {/* Emails Section */}
      <Collapsible
        open={openSections.emails}
        onOpenChange={() => toggleSection("emails")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto"
            type="button"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">Email Addresses</span>
              {getSectionCount("emails") > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getSectionCount("emails")}
                </Badge>
              )}
            </span>
            {openSections.emails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <MultiEmailInput
            value={value.emails || []}
            onChange={handleEmailsChange}
            onBlur={onBlur}
            placeholder="Enter email addresses"
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Users Section */}
      <Collapsible
        open={openSections.users}
        onOpenChange={() => toggleSection("users")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto"
            type="button"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">Specific Users</span>
              {getSectionCount("userIds") > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getSectionCount("userIds")}
                </Badge>
              )}
            </span>
            {openSections.users ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 px-2">
          {renderCheckboxList(
            "userIds",
            users.map((u) => ({ _id: u._id, name: getUserFullName(u) })),
            "No users available",
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Roles Section */}
      <Collapsible
        open={openSections.roles}
        onOpenChange={() => toggleSection("roles")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto"
            type="button"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">Roles</span>
              {getSectionCount("roles") > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getSectionCount("roles")}
                </Badge>
              )}
            </span>
            {openSections.roles ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 px-2">
          {renderCheckboxList(
            "roles",
            roles.map((r) => ({ _id: r._id, name: r.name })),
            "No roles available",
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Positions Section */}
      <Collapsible
        open={openSections.positions}
        onOpenChange={() => toggleSection("positions")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto"
            type="button"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">Positions</span>
              {getSectionCount("positions") > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getSectionCount("positions")}
                </Badge>
              )}
            </span>
            {openSections.positions ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 px-2">
          {renderCheckboxList(
            "positions",
            positions.map((p) => ({ _id: p._id, name: p.name })),
            "No positions available",
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Departments Section */}
      <Collapsible
        open={openSections.departments}
        onOpenChange={() => toggleSection("departments")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto"
            type="button"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">Departments</span>
              {getSectionCount("departments") > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getSectionCount("departments")}
                </Badge>
              )}
            </span>
            {openSections.departments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 px-2">
          {renderCheckboxList(
            "departments",
            departments.map((d) => ({ _id: d._id, name: d.name })),
            "No departments available",
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Branches Section */}
      <Collapsible
        open={openSections.branches}
        onOpenChange={() => toggleSection("branches")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto"
            type="button"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">Branches</span>
              {getSectionCount("branches") > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getSectionCount("branches")}
                </Badge>
              )}
            </span>
            {openSections.branches ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 px-2">
          {renderCheckboxList(
            "branches",
            branches.map((b) => ({ _id: b._id, name: b.name })),
            "No branches available",
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
