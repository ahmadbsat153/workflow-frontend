import { PERMISSIONS } from "@/lib/constants/permissions";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import DepartmentForm from "@/lib/components/Pages/Departments/DepartmentForm";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.DEPARTMENTS.EDIT}>
      <DepartmentForm
        isEdit
        title="Edit Department"
        description="Update department information."
      />
    </ProtectedPage>
  );
};

export default page;
