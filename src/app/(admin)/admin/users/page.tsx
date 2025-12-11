import UsersTable from "@/lib/components/Pages/Users/UsersTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.USERS.VIEW}>
      <PageContainer>
        <HeaderContainer
          title="Users"
          description="Your central hub for platform users. Manage accounts, control roles and permissions."
        />
        <UsersTable />
      </PageContainer>
    </ProtectedPage>
  );
};
export default page;
