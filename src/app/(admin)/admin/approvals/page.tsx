import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import ApprovalsTable from "@/lib/components/Pages/Approvals/ApprovalsTable";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.APPROVALS.VIEW}>
      <PageContainer>
        <HeaderContainer
          title="My Approvals"
          description="Review and manage all approval requests assigned to you."
        />
        <ApprovalsTable />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
