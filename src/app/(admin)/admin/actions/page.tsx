import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import ActionsTable from "@/lib/components/Pages/Actions/ActionsTable";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Actions"
        description="Manage Actions for forms workflow"
      />
      <ActionsTable />
    </PageContainer>
  );
};

export default page;
