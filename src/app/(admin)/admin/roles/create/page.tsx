import { PERMISSIONS } from "@/lib/constants/permissions";
import RoleForm from "@/lib/components/Pages/Roles/RoleForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.ROLES.CREATE}>
      <RoleForm
        title="Create New Role"
        description="Define a new role with specific permissions for your team"
      />
    </ProtectedPage>
  );
};

export default page;
