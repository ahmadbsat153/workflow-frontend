"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { toast } from "sonner";
import FormCard from "./FormCard";
import { build_path } from "@/utils/common";
import { useRouter } from "next/navigation";
import DotsLoader from "../../Loader/DotsLoader";
import { ErrorResponse } from "@/lib/types/common";
import { BookCheckIcon, Plus } from "lucide-react";
import { getUrl, URLs } from "@/lib/constants/urls";
import { useAuth } from "@/lib/context/AuthContext";
import { handleServerError } from "@/lib/api/_axios";
import { Form, FormList } from "@/lib/types/form/form";
import { INITIAL_META } from "@/lib/constants/initials";
import { useCallback, useEffect, useState } from "react";
import { API_FORM } from "@/lib/services/Form/form_service";

const FormCardList = () => {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  const searchParams = {
    page: parseAsInteger,
    limit: parseAsInteger,
    search: parseAsString,
    sortField: parseAsString,
    sortOrder: parseAsString,
  };

  const [forms, setForms] = useState<FormList>({
    data: [],
    meta: INITIAL_META,
  });

  const [query] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(25),
      search: parseAsString,
      sortField: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsString.withDefault("asc"),
    },
    {
      history: "push",
    }
  );

  const getForms = useCallback(async () => {
    try {
      setLoading(true);
      const serialize = createSerializer(searchParams);
      const request = serialize(query);

      const res = await API_FORM.getAllForms(request);
      setForms(res);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getForms();
  }, [getForms]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <DotsLoader />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {isAdmin && (
        <FormCard
          title="Create from scratch"
          icon={Plus}
          iconColor="white"
          iconBackgroundColor="bg-green-500"
          description="Start with a blank form and add your own questions."
          onClick={() => {
            const url = getUrl(build_path(URLs.admin.forms.create));
            router.push(url);
          }}
          variant="create"
        />
      )}

      {forms.data.map((form: Form) => {
        return (
          <FormCard
            key={form._id}
            form_id={form._id}
            title={form.name}
            iconColor={"white"}
            icon={BookCheckIcon}
            editable={isAdmin}
            createdAt={form.createdAt}
            createdBy={form.createdBy?.firstname + " " + form.createdBy?.lastname}
            description={form.description}
            iconBackgroundColor={"bg-blue-500"}
            onClick={() => {
              const admin_url = getUrl(
                build_path(URLs.admin.forms.detail, { slug: form.slug })
              );

              const user_url = getUrl(
                build_path(URLs.app.submissions.submit, {
                  form_slug: form.slug,
                })
              );

              const url = isAdmin ? admin_url : user_url;
              router.push(url);
            }}
            disabled={!form.isActive}
            className={!form.isActive ? "opacity-75" : ""}
          />
        );
      })}
    </div>
  );
};
export default FormCardList;
