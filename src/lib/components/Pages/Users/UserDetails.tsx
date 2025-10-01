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
import { MoveLeftIcon } from "lucide-react";

import { API_USER } from "@/lib/services/User/user_service";
import { ErrorResponse } from "@/lib/types/common";
import { handleServerError } from "@/lib/api/_axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/lib/ui/tabs";
import DotsLoader from "../../Loader/DotsLoader";
import UserOverview from "./UserOverview";
import UserAnalytics from "./UserAnalytics";

const UserDetails = () => {
  const params = useParams();
  const user_slug = params.slug as string;

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<{details: any, analytics: any}>({
    details: [],
    analytics: [],
  });
  console.log("data", userDetails);
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
      //   const serialize = createSerializer(user_slug);
      //   const request = serialize(query);

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
          <button className="flex items-center gap-1 hover:bg-pink-50 py-2 px-3 rounded-lg text-sm mb-4" onClick={handleGoBack}>
            <MoveLeftIcon className="size-4" />
            Users
          </button>
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
