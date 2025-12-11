import UserForm from "@/lib/components/Pages/Users/UserForm";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.USERS.CREATE}>
      <PageContainer>
        <HeaderContainer
          title="Create New User"
          description="Use this form to onboard a new team member by providing their essential details."
        />
        <UserForm />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
