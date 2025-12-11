import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import ActionsTable from "@/lib/components/Pages/Actions/ActionsTable";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.ACTIONS.VIEW}>
      <PageContainer>
        <HeaderContainer
          title="Actions"
          description="Manage Actions for forms workflow"
        />
        <ActionsTable />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
