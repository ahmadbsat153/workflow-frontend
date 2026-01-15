import { PERMISSIONS } from "@/lib/constants/permissions";
import { ActionForm } from "@/lib/components/Pages/Actions/ActionForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
const CreateActionPage = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.ACTIONS.CREATE}>
      <ActionForm title="Create Action" />
    </ProtectedPage>
  );
};

export default CreateActionPage;
