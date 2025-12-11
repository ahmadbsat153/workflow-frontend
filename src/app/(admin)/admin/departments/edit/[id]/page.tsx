import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import DepartmentForm from "@/lib/components/Pages/Departments/DepartmentForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.DEPARTMENTS.EDIT}>
      <PageContainer>
        <HeaderContainer
          title="Edit Department"
          description="Update department information."
        />
        <DepartmentForm isEdit />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
