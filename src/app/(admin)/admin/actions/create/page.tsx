"use client";

import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import { ActionForm } from "@/lib/components/Pages/Actions/ActionForm";
import { PERMISSIONS } from "@/lib/constants/permissions";
const CreateActionPage = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.ACTIONS.CREATE}>
      <ActionForm title="Create Action" />
    </ProtectedPage>
  );
};

export default CreateActionPage;
