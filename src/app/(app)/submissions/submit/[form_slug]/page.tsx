import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import SubmissionFormBuilder from "@/lib/components/Pages/Submissions/SubmissionFormBuilder";
import { PERMISSIONS } from "@/lib/constants/permissions";

const page = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.FORMS.SUBMIT}>
      <div className="bg-cultured overflow-hidden h-full">
        <SubmissionFormBuilder />
      </div>
    </ProtectedPage>
  );
};
export default page;
