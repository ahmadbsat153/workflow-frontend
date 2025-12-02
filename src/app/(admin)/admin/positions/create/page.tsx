import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PositionForm from "@/lib/components/Pages/Positions/PositionForm";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Create Position"
        description="Add a new position to a department."
      />
      <PositionForm />
    </PageContainer>
  );
};

export default page;
