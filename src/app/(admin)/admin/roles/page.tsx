import RolesTable from "@/lib/components/Pages/Roles/RolesTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.ROLES.VIEW}>
      <PageContainer>
        <HeaderContainer
          title="Roles & Permissions"
          description="Control access levels and assign roles to your team."
        />
        <RolesTable />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
