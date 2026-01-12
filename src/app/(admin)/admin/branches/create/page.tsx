import { PERMISSIONS } from "@/lib/constants/permissions";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import BranchForm from "@/lib/components/Pages/Branches/BranchForm";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.BRANCHES.CREATE}>
      <BranchForm
        title="Create Branch"
        description="Add a new branch location to your organization."
      />
    </ProtectedPage>
  );
};

export default page;
