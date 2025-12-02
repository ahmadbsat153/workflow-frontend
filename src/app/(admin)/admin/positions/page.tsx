import PositionsTable from "@/lib/components/Pages/Positions/PositionsTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Positions"
        description="Manage positions within your organization's departments."
      />
      <PositionsTable />
    </PageContainer>
  );
};

export default page;
