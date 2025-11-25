"use client";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import PageContainer from "@/lib/components/Container/PageContainer";
import { ActionForm } from "@/lib/components/Pages/Actions/ActionForm";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const action_id = params.action_id as string;

  return (
    <PageContainer>
      <HeaderContainer title="Edit Action" />
      <ActionForm action_id={action_id} />
    </PageContainer>
  );
};

export default page;
