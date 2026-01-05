import RoleForm from "@/lib/components/Pages/Roles/RoleForm";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

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
