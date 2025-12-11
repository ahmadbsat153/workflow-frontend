import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import BranchForm from "@/lib/components/Pages/Branches/BranchForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.BRANCHES.CREATE}>
      <PageContainer>
        <HeaderContainer
          title="Create Branch"
          description="Add a new branch location to your organization."
        />
        <BranchForm />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
