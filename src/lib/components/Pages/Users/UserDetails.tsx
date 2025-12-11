"use client";

import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';

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

const UserDetails = () => {
  const params = useParams();
  const user_slug = params.slug as string;

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const handleManagePermissions = () => {
    router.push(`/admin/users/${user_slug}/permissions`);
  };

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<{details: any, analytics: any}>({
    details: [],
    analytics: [],
  });

  // TODO: Change rendering based on user permissions/role
  const tabsList = [
    {
      value: "0",
      label: "Overview",
      content: <UserOverview data={userDetails.details}/>,
    },
    {
      value: "1",
      label: "Analytics",
      content: <UserAnalytics data={userDetails.analytics} />,
    },
    {
      value: "2",
      label: "Settings",
      content: <div>Settings</div>,
    },
  ];
  const [activeTab, setActiveTab] = useState<string>(tabsList[0].value);
  const getUserDetails = useCallback(async () => {
    try {
      setLoading(true);

      const res_analytics = await API_USER.getUserAnalytics(user_slug);
      const res_details = await API_USER.getUserById(user_slug);
      console.log("details", res_analytics, res_details);
      setUserDetails({
        analytics: res_analytics,
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
  }, []);

  return (
    <div>
      {loading ? (
        <DotsLoader />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Button onClick={handleGoBack} className="bg-gray-50 text-default hover:bg-primary/20">
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
          <TabsContent value={activeTab}>{tabsList[parseInt(activeTab) as number]?.content}</TabsContent>
        </Tabs>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
