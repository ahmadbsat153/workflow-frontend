import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import WorkflowHistoryTable from "@/lib/components/Pages/workflow/Table/WorkflowHistoryTable";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Workflows History"
        description="Manage and check statuses of all automated workflows within your platform."
      />
      <WorkflowHistoryTable />
    </PageContainer>
  );
};
export default page;
