import DepartmentsTable from "@/lib/components/Pages/Departments/DepartmentsTable";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.DEPARTMENTS.VIEW}>
      <PageContainer>
        <HeaderContainer
          title="Departments"
          description="Manage your organization's departments and structure."
        />
        <DepartmentsTable />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
