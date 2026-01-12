import PositionForm from "@/lib/components/Pages/Positions/PositionForm";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.POSITIONS.EDIT}>
      <PositionForm
        isEdit
        title="Edit Position"
        description="Update position information."
      />
    </ProtectedPage>
  );
};

export default page;
