import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import DepartmentForm from "@/lib/components/Pages/Departments/DepartmentForm";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Edit Department"
        description="Update department information."
      />
      <DepartmentForm isEdit />
    </PageContainer>
  );
};

export default page;
