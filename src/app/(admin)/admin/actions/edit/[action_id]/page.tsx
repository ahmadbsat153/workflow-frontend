"use client";
import { useParams } from "next/navigation";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { ProtectedPage } from "@/lib/components/Auth/ProtectedPage";
import PageContainer from "@/lib/components/Container/PageContainer";
import { ActionForm } from "@/lib/components/Pages/Actions/ActionForm";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";

const Page  = () => {
  const params = useParams();
  const action_id = params.action_id as string;

  return (
    <ProtectedPage permission={PERMISSIONS.ACTIONS.EDIT}>
      <PageContainer>
        <HeaderContainer title="Edit Action" />
        <ActionForm action_id={action_id} title="Edit Action"/>
      </PageContainer>
    </ProtectedPage>
  );
};

export default Page;
