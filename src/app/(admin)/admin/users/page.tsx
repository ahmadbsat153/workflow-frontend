import UsersTable from "@/lib/components/Pages/Users/UsersTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Users"
        description="Manage platform users from here"
      />
      <UsersTable />
    </PageContainer>
  );
};
export default page;
