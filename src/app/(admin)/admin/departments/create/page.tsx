import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import DepartmentForm from "@/lib/components/Pages/Departments/DepartmentForm";

const page = () => {
  return (
    <PageContainer>
      <HeaderContainer
        title="Create Department"
        description="Add a new department to your organization."
      />
      <DepartmentForm />
    </PageContainer>
  );
};

export default page;
