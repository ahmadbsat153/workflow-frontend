"use client";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import { ActionForm } from "@/lib/components/Pages/Actions/ActionForm";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const action_id = params.action_id as string;

  return (
    <ProtectedPage permission={PERMISSIONS.ACTIONS.EDIT}>
      <PageContainer>
        <HeaderContainer title="Edit Action" />
        <ActionForm action_id={action_id} />
      </PageContainer>
    </ProtectedPage>
  );
};

export default page;
