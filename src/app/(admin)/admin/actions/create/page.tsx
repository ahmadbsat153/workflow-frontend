"use client";

import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import { ActionForm } from "@/lib/components/Pages/Actions/ActionForm";
const CreateActionPage = () => {
  return (
    <PageContainer>
      <HeaderContainer title="Create Action" />
      <ActionForm />
    </PageContainer>
  );
};

export default CreateActionPage;
