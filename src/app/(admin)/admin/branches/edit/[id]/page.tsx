import { PERMISSIONS } from "@/lib/constants/permissions";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import BranchForm from "@/lib/components/Pages/Branches/BranchForm";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.BRANCHES.EDIT}>
      <BranchForm
        isEdit
        title="Edit Branch"
        description="Update branch information."
      />
    </ProtectedPage>
  );
};

export default page;
