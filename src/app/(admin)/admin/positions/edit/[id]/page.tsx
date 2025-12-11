import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PositionForm from "@/lib/components/Pages/Positions/PositionForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.POSITIONS.EDIT}>
      <PageContainer>
        <HeaderContainer
          title="Edit Position"
          description="Update position information."
        />
        <PositionForm isEdit />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
