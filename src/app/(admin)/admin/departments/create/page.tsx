import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import DepartmentForm from "@/lib/components/Pages/Departments/DepartmentForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.DEPARTMENTS.CREATE}>
      <PageContainer>
        <HeaderContainer
          title="Create Department"
          description="Add a new department to your organization."
        />
        <DepartmentForm />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
