"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select";
import { Label } from "@/lib/ui/label";
import { UserSelectionMode, UserFieldValue } from "@/lib/types/actions/action";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { Department } from "@/lib/types/department/department";
import { Position } from "@/lib/types/position/position";
import { Branch } from "@/lib/types/branch/branch";
import { FieldTemplate } from "@/lib/types/form/form";
import { MultiEmailInput } from "./MultiEmailInput";

type UserFieldInputProps = {
  value: UserFieldValue | undefined;
  onChange: (value: UserFieldValue) => void;
  onBlur: () => void;
  availableTemplates?: FieldTemplate[];
  placeholder?: string;
};

export const UserFieldInput = ({
  value,
  onChange,
  onBlur,
  availableTemplates = [],
  placeholder,
}: UserFieldInputProps) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);

  const currentMode = value?.mode || UserSelectionMode.DIRECT_EMAIL;

  // Load departments, positions, and branches
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [deptResponse, posResponse, branchResponse] = await Promise.all([
          API_DEPARTMENT.getAllDepartments(),
          API_POSITION.getAllPositions(),
          API_BRANCH.getAllBranches(),
        ]);
        setDepartments(deptResponse.data);
        setPositions(posResponse.data);
        setBranches(branchResponse.data);
      } catch (error) {
        console.error("Failed to load departments/positions/branches:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleModeChange = (mode: UserSelectionMode) => {
    onChange({
      mode,
      email: undefined,
      emails: undefined,
      departmentId: undefined,
      positionId: undefined,
      formFieldName: undefined,
      branchId: undefined,
    });
  };

  const handleValueChange = (
    field: keyof UserFieldValue,
    fieldValue: string
  ) => {
    onChange({
      ...value,
      mode: currentMode,
      [field]: fieldValue,
    } as UserFieldValue);
  };

  // Filter templates to only show position and branch fields
  const positionFields = availableTemplates.filter(
    (t) => t.type === "position" || t.name.includes("position")
  );

  const branchFields = availableTemplates.filter(
    (t) => t.type === "branch" || t.name.includes("branch")
  );

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
      {/* Mode Selector */}
      <div className="space-y-2">
        <Label>User Selection Mode</Label>
        <Select value={currentMode} onValueChange={handleModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select how to identify users..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserSelectionMode.DIRECT_EMAIL}>
              Direct Email Address
            </SelectItem>
            <SelectItem value={UserSelectionMode.DEPARTMENT}>
              All Users in Department
            </SelectItem>
            <SelectItem value={UserSelectionMode.POSITION_IN_DEPARTMENT}>
              Position in Specific Department
            </SelectItem>
            <SelectItem value={UserSelectionMode.POSITION_FROM_FORM}>
              Position from Form Field
            </SelectItem>
            <SelectItem value={UserSelectionMode.POSITION_ANY_DEPT}>
              Position in Any Department
            </SelectItem>
            <SelectItem value={UserSelectionMode.POSITION_IN_SUBMITTER_DEPT}>
              Position in Submitter's Department
            </SelectItem>
            <SelectItem value={UserSelectionMode.BRANCH}>
              All Users in Branch
            </SelectItem>
            <SelectItem value={UserSelectionMode.BRANCH_FROM_FORM}>
              Branch from Form Field
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Input Based on Mode */}
      <div className="space-y-2">
        {currentMode === UserSelectionMode.DIRECT_EMAIL && (
          <div className="space-y-2">
            <Label>Email Addresses</Label>
            <MultiEmailInput
              value={value?.emails || []}
              onChange={(emails) => {
                onChange({
                  ...value,
                  mode: currentMode,
                  emails,
                  email: undefined, // Clear legacy single email
                } as UserFieldValue);
              }}
              onBlur={onBlur}
              placeholder={placeholder || "Enter email addresses"}
            />
            <p className="text-xs text-muted-foreground">
              Enter one or more email addresses to target specific users
            </p>
          </div>
        )}

        {currentMode === UserSelectionMode.DEPARTMENT && (
          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={value?.departmentId || ""}
              onValueChange={(val) => handleValueChange("departmentId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department..." />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : departments.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No departments available
                  </SelectItem>
                ) : (
                  departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All users in this department will be selected
            </p>
          </div>
        )}

        {currentMode === UserSelectionMode.POSITION_IN_DEPARTMENT && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={value?.departmentId || ""}
                onValueChange={(val) => handleValueChange("departmentId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department..." />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : departments.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No departments available
                    </SelectItem>
                  ) : (
                    departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Select
                value={value?.positionId || ""}
                onValueChange={(val) => handleValueChange("positionId", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position..." />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : positions.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No positions available
                    </SelectItem>
                  ) : (
                    positions.map((pos) => (
                      <SelectItem key={pos._id} value={pos._id}>
                        {pos.name} 
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Users with this position in the selected department
            </p>
          </div>
        )}

        {currentMode === UserSelectionMode.POSITION_FROM_FORM && (
          <div className="space-y-2">
            <Label>Form Field (Position)</Label>
            <Select
              value={value?.formFieldName || ""}
              onValueChange={(val) => handleValueChange("formFieldName", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select form field..." />
              </SelectTrigger>
              <SelectContent>
                {positionFields.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No position fields in form
                  </SelectItem>
                ) : (
                  positionFields.map((field) => (
                    <SelectItem key={field.name} value={field.name}>
                      {field.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Users with the position selected in the form field
            </p>
          </div>
        )}

        {currentMode === UserSelectionMode.POSITION_ANY_DEPT && (
          <div className="space-y-2">
            <Label>Position</Label>
            <Select
              value={value?.positionId || ""}
              onValueChange={(val) => handleValueChange("positionId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position..." />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : positions.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No positions available
                  </SelectItem>
                ) : (
                  positions.map((pos) => (
                    <SelectItem key={pos._id} value={pos._id}>
                      {pos.name} 
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All users with this position across all departments
            </p>
          </div>
        )}

        {currentMode === UserSelectionMode.POSITION_IN_SUBMITTER_DEPT && (
          <div className="space-y-2">
            <Label>Position</Label>
            <Select
              value={value?.positionId || ""}
              onValueChange={(val) => handleValueChange("positionId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position..." />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : positions.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No positions available
                  </SelectItem>
                ) : (
                  positions.map((pos) => (
                    <SelectItem key={pos._id} value={pos._id}>
                      {pos.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Users with this position in the form submitter's department
            </p>
          </div>
        )}

        {currentMode === UserSelectionMode.BRANCH && (
          <div className="space-y-2">
            <Label>Branch</Label>
            <Select
              value={value?.branchId || ""}
              onValueChange={(val) => handleValueChange("branchId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select branch..." />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : branches.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No branches available
                  </SelectItem>
                ) : (
                  branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All users in this branch will be selected
            </p>
          </div>
        )}

        {currentMode === UserSelectionMode.BRANCH_FROM_FORM && (
          <div className="space-y-2">
            <Label>Form Field (Branch)</Label>
            <Select
              value={value?.formFieldName || ""}
              onValueChange={(val) => handleValueChange("formFieldName", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select form field..." />
              </SelectTrigger>
              <SelectContent>
                {branchFields.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No branch fields in form
                  </SelectItem>
                ) : (
                  branchFields.map((field) => (
                    <SelectItem key={field.name} value={field.name}>
                      {field.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Users in the branch selected in the form field
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
