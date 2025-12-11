import PositionsTable from "@/lib/components/Pages/Positions/PositionsTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.POSITIONS.VIEW}>
      <PageContainer>
        <HeaderContainer
          title="Positions"
          description="Manage positions within your organization's departments."
        />
        <PositionsTable />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
