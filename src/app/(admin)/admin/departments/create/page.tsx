import DepartmentForm from "@/lib/components/Pages/Departments/DepartmentForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.DEPARTMENTS.CREATE}>
      <DepartmentForm
        isEdit={false}
        title="Create Department"
        description="Add a new department to your organization."
      />
    </ProtectedPage>
  );
};

export default page;
