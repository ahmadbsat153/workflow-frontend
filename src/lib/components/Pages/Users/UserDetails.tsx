"use client";

import { toast } from "sonner";
import { Button } from "@/lib/ui/button";
import { useRouter } from "next/navigation";
import { URLs } from "@/lib/constants/urls";
import { User, UserOverview } from "@/lib/types/user/user";
import DotsLoader from "../../Loader/DotsLoader";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { useState, useEffect, useCallback } from "react";
import { MoveLeftIcon, ShieldCheck } from "lucide-react";
import { API_USER } from "@/lib/services/User/user_service";
import FixedHeaderFooterLayout from "../../Layout/FixedHeaderFooterLayout";
import UserOverviewDetails from "./UserOverviewDetails";

const UserDetails = ({ userId }: { userId: string }) => {
  const user_slug = userId;

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const handleManagePermissions = () => {
    router.push(
      URLs.admin.users.detail.replace(":slug", user_slug) + "/permissions",
    );
  };

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<UserOverview | null>(null);
  const getUserDetails = useCallback(async () => {
    if (!user_slug) {
      console.error("User ID is undefined");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res_details = await API_USER.getUserOverviewById(user_slug);
      setUserDetails(res_details);
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg);
      });
    } finally {
      setLoading(false);
    }
  }, [user_slug]);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  return (
    <div className="h-full flex items-start">
      {loading ? (
        <div className="h-[90vh] w-full flex items-center justify-center">
          <DotsLoader />
        </div>
      ) : (
        <FixedHeaderFooterLayout
          title={""}
          description={""}
          footer={<></>}
          maxWidth="4xl"
          maxHeight="90vh"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={handleGoBack}
                className="bg-gray-50 text-default hover:bg-primary/20"
              >
                <MoveLeftIcon className="size-4" />
                Back
              </Button>
              <Button onClick={handleManagePermissions} variant="outline">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Manage Permissions
              </Button>
            </div>

            <UserOverviewDetails data={userDetails} />
          </div>
        </FixedHeaderFooterLayout>
      )}
    </div>
  );
};

export default UserDetails;
