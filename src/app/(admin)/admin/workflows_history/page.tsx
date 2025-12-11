import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import WorkflowHistoryTable from "@/lib/components/Pages/workflow/Table/WorkflowHistoryTable";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.WORKFLOWS.VIEW}>
      <PageContainer>
        <HeaderContainer
          title="Workflows History"
          description="Manage and check statuses of all automated workflows within your platform."
        />
        <WorkflowHistoryTable />
      </PageContainer>
    </ProtectedPage>
  );
};
export default page;
