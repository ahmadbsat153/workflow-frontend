"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_FORM } from "@/lib/services/Form/form_service";
import { API_ROLE } from "@/lib/services/Role/role_service";
import { API_DEPARTMENT } from "@/lib/services/Department/department_service";
import { API_POSITION } from "@/lib/services/Position/position_service";
import { API_BRANCH } from "@/lib/services/Branch/branch_service";
import { Form, FormSettings } from "@/lib/types/form/form";
import { Role } from "@/lib/types/role/role";
import { DepartmentOption } from "@/lib/types/department/department";
import { PositionOption } from "@/lib/types/position/position";
import { BranchOption } from "@/lib/types/branch/branch";
import { MultiSelect, MultiSelectOption } from "../../Common/MultiSelect";
import { Button } from "@/lib/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/card";
import { toast } from "sonner";
import { Loader2, Eye, Edit, Users, Building2, MapPin, Briefcase } from "lucide-react";

const FormSettingsTab = () => {
  const params = useParams();
  const formId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<Form | null>(null);

  // Options for dropdowns
  const [roleOptions, setRoleOptions] = useState<MultiSelectOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<MultiSelectOption[]>([]);
  const [positionOptions, setPositionOptions] = useState<MultiSelectOption[]>([]);
  const [branchOptions, setBranchOptions] = useState<MultiSelectOption[]>([]);

  // Selected values for visibility
  const [visibilityRoles, setVisibilityRoles] = useState<string[]>([]);
  const [visibilityDepartments, setVisibilityDepartments] = useState<string[]>([]);
  const [visibilityBranches, setVisibilityBranches] = useState<string[]>([]);
  const [visibilityPositions, setVisibilityPositions] = useState<string[]>([]);

  // Selected values for canEdit
  const [canEditRoles, setCanEditRoles] = useState<string[]>([]);
  const [canEditPositions, setCanEditPositions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [formData, rolesData, deptData, posData, branchData] = await Promise.all([
          API_FORM.getFormById(formId),
          API_ROLE.getActiveRoles(),
          API_DEPARTMENT.getActiveDepartments(),
          API_POSITION.getActivePositions(),
          API_BRANCH.getActiveBranches(),
        ]);

        setForm(formData);

        // Map to MultiSelectOption format
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

        // Set current settings if they exist
        if (formData.settings) {
          const { visibility, canEdit } = formData.settings;
          setVisibilityRoles(visibility?.roles || []);
          setVisibilityDepartments(visibility?.departments || []);
          setVisibilityBranches(visibility?.branches || []);
          setVisibilityPositions(visibility?.positions || []);
          setCanEditRoles(canEdit?.roles || []);
          setCanEditPositions(canEdit?.positions || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load form settings");
      } finally {
        setIsLoading(false);
      }
    };

    if (formId) {
      fetchData();
    }
  }, [formId]);

  const handleSave = async () => {
    if (!form) return;

    setIsSaving(true);
    try {
      const settings: FormSettings = {
        visibility: {
          roles: visibilityRoles,
          departments: visibilityDepartments,
          branches: visibilityBranches,
          positions: visibilityPositions,
        },
        canEdit: {
          roles: canEditRoles,
          positions: canEditPositions,
        },
      };

      await API_FORM.updateFormById(formId, { settings });
      toast.success("Form settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save form settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-6 px-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Form Settings</h1>
          <p className="text-gray-500 mt-1">
            Configure who can view and edit this form
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Settings
        </Button>
      </div>

      {/* Visibility Settings */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Who Can View This Form
          </CardTitle>
          <p className="text-sm text-gray-500">
            Select which roles, departments, branches, or positions can view and submit this form.
            Leave all empty to allow everyone to view.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 overflow-visible">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Users className="w-4 h-4" />
              Roles
            </label>
            <MultiSelect
              options={roleOptions}
              selected={visibilityRoles}
              onChange={setVisibilityRoles}
              placeholder="Select roles..."
              searchPlaceholder="Search roles..."
              emptyMessage="No roles found"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Building2 className="w-4 h-4" />
              Departments
            </label>
            <MultiSelect
              options={departmentOptions}
              selected={visibilityDepartments}
              onChange={setVisibilityDepartments}
              placeholder="Select departments..."
              searchPlaceholder="Search departments..."
              emptyMessage="No departments found"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin className="w-4 h-4" />
              Branches
            </label>
            <MultiSelect
              options={branchOptions}
              selected={visibilityBranches}
              onChange={setVisibilityBranches}
              placeholder="Select branches..."
              searchPlaceholder="Search branches..."
              emptyMessage="No branches found"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Briefcase className="w-4 h-4" />
              Positions
            </label>
            <MultiSelect
              options={positionOptions}
              selected={visibilityPositions}
              onChange={setVisibilityPositions}
              placeholder="Select positions..."
              searchPlaceholder="Search positions..."
              emptyMessage="No positions found"
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Permissions */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Who Can Edit This Form
          </CardTitle>
          <p className="text-sm text-gray-500">
            Select which roles or positions can edit and configure this form.
            Leave all empty to allow only the creator to edit.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 overflow-visible">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Users className="w-4 h-4" />
              Roles
            </label>
            <MultiSelect
              options={roleOptions}
              selected={canEditRoles}
              onChange={setCanEditRoles}
              placeholder="Select roles..."
              searchPlaceholder="Search roles..."
              emptyMessage="No roles found"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Briefcase className="w-4 h-4" />
              Positions
            </label>
            <MultiSelect
              options={positionOptions}
              selected={canEditPositions}
              onChange={setCanEditPositions}
              placeholder="Select positions..."
              searchPlaceholder="Search positions..."
              emptyMessage="No positions found"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormSettingsTab;
