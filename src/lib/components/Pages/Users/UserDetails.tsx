"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { MoveLeftIcon, ShieldCheck } from "lucide-react";

import { API_USER } from "@/lib/services/User/user_service";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/lib/ui/tabs";
import DotsLoader from "../../Loader/DotsLoader";
import UserOverview from "./UserOverview";
import UserAnalytics from "./UserAnalytics";
import { Button } from "@/lib/ui/button";
import { URLs } from "@/lib/constants/urls";
import FixedHeaderFooterLayout from "../../Layout/FixedHeaderFooterLayout";
import { User } from "@/lib/types/user/user";

interface UserAnalyticsData {
  forms?: number;
  submissions?: number;
  total?: number;
  barChartAnalytics?: Array<{ month: string; forms: number; workflows: number }>;
  recentActivities?: Array<{
    _id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    is_active: boolean;
  }>;
}

const UserDetails = ({ userId }: { userId: string }) => {
  const user_slug = userId;

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const handleManagePermissions = () => {
    router.push(
      URLs.admin.users.detail.replace(":slug", user_slug) + "/permissions"
    );
  };

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<{
    details: User | null;
    analytics: UserAnalyticsData | null;
  }>({
    details: null,
    analytics: null,
  });

  // TODO: Change rendering based on user permissions/role
  const tabsList = [
    {
      value: "0",
      label: "Overview",
    },
    {
      value: "1",
      label: "Analytics",
    },
  ];
  const [activeTab, setActiveTab] = useState<string>("0");

  const renderTabContent = () => {
    switch (activeTab) {
      case "0":
        return <UserOverview data={userDetails.details} />;
      case "1":
        return <UserAnalytics data={userDetails.analytics} />;
      default:
        return null;
    }
  };
  const getUserDetails = useCallback(async () => {
    if (!user_slug) {
      console.error("User ID is undefined");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res_analytics = await API_USER.getUserAnalytics(user_slug);
      const res_details = await API_USER.getUserById(user_slug);
      setUserDetails({
        analytics: res_analytics as unknown as UserAnalyticsData,
        details: res_details,
      });
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
        <DotsLoader />
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

            <Tabs defaultValue={activeTab}>
              <TabsList>
                {tabsList.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeTab}>
                {renderTabContent()}
              </TabsContent>
            </Tabs>
          </div>
        </FixedHeaderFooterLayout>
      )}
    </div>
  );
};

export default UserDetails;
