import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PositionForm from "@/lib/components/Pages/Positions/PositionForm";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Edit Position"
        description="Update position information."
      />
      <PositionForm isEdit />
    </PageContainer>
  );
};

export default page;
