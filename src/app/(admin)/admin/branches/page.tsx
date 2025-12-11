import BranchesTable from "@/lib/components/Pages/Branches/BranchesTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.BRANCHES.VIEW}>
      <PageContainer>
        <HeaderContainer
          title="Branches"
          description="Manage your organization's branch locations."
        />
        <BranchesTable />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
