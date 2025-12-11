"use client";

import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import { ActionForm } from "@/lib/components/Pages/Actions/ActionForm";
import { PERMISSIONS } from "@/lib/constants/permissions";
const CreateActionPage = () => {
  return (
    <ProtectedPage permission={PERMISSIONS.ACTIONS.CREATE}>
      <PageContainer>
        <HeaderContainer title="Create Action" />
        <ActionForm />
      </PageContainer>
    </ProtectedPage>
  );
};

export default CreateActionPage;
