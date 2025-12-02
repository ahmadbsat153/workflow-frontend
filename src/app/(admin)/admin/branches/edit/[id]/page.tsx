import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import BranchForm from "@/lib/components/Pages/Branches/BranchForm";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Edit Branch"
        description="Update branch information."
      />
      <BranchForm isEdit />
    </PageContainer>
  );
};

export default page;
