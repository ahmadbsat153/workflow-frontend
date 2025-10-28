"use client";

import { useState, useCallback } from "react";
import PageContainer from "@/lib/components/Container/PageContainer";
import HeaderContainer from "@/lib/components/Container/HeaderContainer";
import { FieldsType } from "@/lib/types/form/fields";
import { API_USER } from "@/lib/services/User/user_service";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { toast } from "sonner";
import DotsLoader from "@/lib/components/Loader/DotsLoader";
import AddForm from "@/lib/components/Pages/Users/AddForm";
import { useRouter } from "next/navigation";

type inputValuesProps = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  is_archived: boolean;
  is_active: boolean;
  is_super_admin: boolean;
  role: string;
  password: string;
};

const page = () => {
  const [loading, setLoading] = useState(false);
  const inputValuesProps: inputValuesProps = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    is_archived: false,
    is_active: false,
    is_super_admin: false,
    role: "",
    password: "",
  };
  const [inputValues, setInputValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    is_archived: false,
    is_active: true,
    is_super_admin: true,
    role: "",
    password: "",
  });
  const fields = [
    {
      _id: "firstname",
      name: "firstname",
      label: "First Name",
      type: FieldsType.TEXT,
      required: true,
      placeholder: "First Name",
      defaultValue: inputValues.firstname,
      order: 0,
      style: "",
    },
    {
      _id: "lastname",
      name: "lastname",
      label: "Last Name",
      type: FieldsType.TEXT,
      required: true,
      placeholder: "Last Name",
      defaultValue: inputValues.lastname,
      order: 1,
      style: "",
    },
    {
      _id: "email",
      name: "email",
      label: "Email",
      type: FieldsType.EMAIL,
      required: true,
      placeholder: "Email",
      defaultValue: inputValues.email,
      order: 2,
      style: "",
    },
    {
      _id: "phone",
      name: "phone",
      label: "Phone Number",
      type: FieldsType.TEXT,
      required: true,
      placeholder: "First Name",
      defaultValue: inputValues.phone,
      order: 3,
      style: "",
    },
    {
      _id: "role",
      name: "role",
      label: "Role",
      type: FieldsType.SELECT,
      required: true,
      placeholder: "First Name",
      defaultValue: inputValues.role,
      order: 4,
      style: "col-span-2 w-full",
      restrictions: {
        autocomplete: "off",
      },
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
    {
      _id: "is_super_admin",
      name: "is_super_admin",
      label: "Is Admin",
      type: FieldsType.CHECKBOX,
      required: true,
      placeholder: "First Name",
      description: "Grant super admin privileges to this user",
      defaultValue: inputValues.is_super_admin,
      order: 5,
      style: "col-span-1",
    },
    {
      _id: "is_active",
      name: "is_active",
      label: "Status",
      type: FieldsType.CHECKBOX,
      required: true,
      placeholder: "First Name",
      description: "Turn this user active or inactive",
      defaultValue: inputValues.is_active,
      order: 6,
      style: "col-span-1",
    },
    {
      _id: "is_archived",
      name: "is_archived",
      label: "Is Archived",
      type: FieldsType.CHECKBOX,
      required: true,
      placeholder: "First Name",
      description: "Archive this user",
      defaultValue: inputValues.is_archived,
      order: 7,
      style: "col-span-1",
    },
  ];

  const onClose = () => {
    router.push("/admin/users");
    setInputValues({
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      is_archived: false,
      is_active: true,
      is_super_admin: true,
      role: "",
      password: "",
    });
  };
  const router = useRouter();
  const addUser = async () => {
    try {
      setLoading(true);

      const res = await API_USER.createUser(inputValues);
      // On success, reset the form, show a success message and navigate to the users page
      await onClose();
      toast.success("User added successfully");
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <HeaderContainer
        title="Add User"
        description="Use this form to onboard a new team member by providing their essential details."
      />
      {loading ? (
        <DotsLoader />
      ) : (
        <AddForm
          inputValues={inputValues}
          setInputValues={setInputValues}
          fields={fields}
          addFunction={addUser}
          onClose={() => onClose()}
          loading={loading}
          inputValuesProps={inputValuesProps}
        />
      )}
    </PageContainer>
  );
};
export default page;
