import BranchesTable from "@/lib/components/Pages/Branches/BranchesTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Branches"
        description="Manage your organization's branch locations."
      />
      <BranchesTable />
    </PageContainer>
  );
};

export default page;
