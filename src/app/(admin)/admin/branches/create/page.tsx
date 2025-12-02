import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import BranchForm from "@/lib/components/Pages/Branches/BranchForm";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Create Branch"
        description="Add a new branch location to your organization."
      />
      <BranchForm />
    </PageContainer>
  );
};

export default page;
