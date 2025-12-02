import DepartmentsTable from "@/lib/components/Pages/Departments/DepartmentsTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Departments"
        description="Manage your organization's departments and structure."
      />
      <DepartmentsTable />
    </PageContainer>
  );
};

export default page;
