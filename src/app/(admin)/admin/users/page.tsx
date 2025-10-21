import UsersTable from "@/lib/components/Pages/Users/UsersTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Users"
        description="Your central hub for platform users. Manage accounts, control roles and permissions."
      />
      <UsersTable />
    </PageContainer>
  );
};
export default page;
