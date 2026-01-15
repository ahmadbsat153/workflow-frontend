"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_NOTIFICATION } from "@/lib/services/notification_service";
import { Button } from "@/lib/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { Switch } from "@/lib/ui/switch";
import { Label } from "@/lib/ui/label";
import { Separator } from "@/lib/ui/separator";
import { Skeleton } from "@/lib/ui/skeleton";
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { NotificationPreferences } from "@/lib/types/notification";
import FixedHeaderFooterLayout from "@/lib/components/Layout/FixedHeaderFooterLayout";

type NotificationPrefProps = {
  title: string;
  description: string;
};

/**
 * Notification type configuration
 */
const notificationTypes = [
  {
    key: "form_submission" as const,
    title: "Form Submissions",
    description: "Get notified when a new form is submitted",
    icon: <BellIcon className="size-5" />,
  },
  {
    key: "approval_request" as const,
    title: "Approval Requests",
    description: "Get notified when your approval is needed",
    icon: <BellIcon className="size-5" />,
  },
  {
    key: "approval_decision" as const,
    title: "Approval Decisions",
    description:
      "Get notified when your approval request is approved or rejected",
    icon: <CheckCircleIcon className="size-5" />,
  },
  {
    key: "workflow_completed" as const,
    title: "Workflow Completed",
    description: "Get notified when a workflow completes successfully",
    icon: <CheckCircleIcon className="size-5" />,
  },
  {
    key: "workflow_failed" as const,
    title: "Workflow Failed",
    description: "Get notified when a workflow encounters an error",
    icon: <BellIcon className="size-5" />,
  },
];

/**
 * Individual preference row
 */
const PreferenceRow = ({
  type,
  title,
  description,
  icon,
  inApp,
  email,
  onInAppChange,
  onEmailChange,
  disableEmail = false,
}: {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  inApp: boolean;
  email: boolean;
  onInAppChange: (checked: boolean) => void;
  onEmailChange: (checked: boolean) => void;
  disableEmail?: boolean;
}) => {
  return (
    <div className="py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-muted-foreground mt-1">{icon}</div>
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <DevicePhoneMobileIcon className="size-4 text-muted-foreground" />
            <Switch
              id={`${type}-inapp`}
              checked={inApp}
              onCheckedChange={onInAppChange}
            />
            <Label
              htmlFor={`${type}-inapp`}
              className="text-xs text-muted-foreground cursor-pointer"
            >
              In-App
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <EnvelopeIcon className="size-4 text-muted-foreground" />
            <Switch
              id={`${type}-email`}
              checked={email}
              onCheckedChange={onEmailChange}
              disabled={disableEmail}
            />
            <Label
              htmlFor={`${type}-email`}
              className={`text-xs text-muted-foreground ${
                disableEmail
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              Email
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading skeleton for preferences
 */
const PreferenceSkeleton = () => (
  <div className="py-4">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <Skeleton className="size-5 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
);

/**
 * Notification Preferences Page
 */
export default function NotificationPreferencesPage({
  title = "Notification Preferences",
  description = "Manage how you receive notifications for different events",
}: NotificationPrefProps) {
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await API_NOTIFICATION.getPreferences();
      setPreferences(response.data.preferences);
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      toast.error("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    try {
      setSaving(true);
      await API_NOTIFICATION.updatePreferences({ preferences });
      toast.success("Preferences saved successfully");
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (
    type: keyof NotificationPreferences,
    channel: "inApp" | "email",
    value: boolean
  ) => {
    if (!preferences) return;

    setPreferences({
      ...preferences,
      [type]: {
        ...preferences[type],
        [channel]: value,
      },
    });
    setHasChanges(true);
  };

  return (
    <FixedHeaderFooterLayout
      title={title}
      description={description}
      // footer={}
      maxWidth="3xl"
      maxHeight="90vh"
    >
      <div className="">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Choose how you want to be notified for each type of event. You can
              receive notifications in-app, via email, or both.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <PreferenceSkeleton />
                    {i < 4 && <Separator />}
                  </div>
                ))}
              </div>
            ) : preferences ? (
              <>
                <div className="space-y-0 divide-y">
                  {notificationTypes.map((type) => (
                    <PreferenceRow
                      key={type.key}
                      type={type.key}
                      title={type.title}
                      description={type.description}
                      icon={type.icon}
                      inApp={preferences[type.key].inApp}
                      email={preferences[type.key].email}
                      onInAppChange={(checked) =>
                        updatePreference(type.key, "inApp", checked)
                      }
                      onEmailChange={(checked) =>
                        updatePreference(type.key, "email", checked)
                      }
                      disableEmail={type.key === "approval_request"}
                    />
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Changes will be applied immediately after saving
                  </p>
                  <div className="flex items-center gap-3">
                    {hasChanges && (
                      <Button
                        variant="outline"
                        onClick={fetchPreferences}
                        disabled={saving}
                      >
                        Reset
                      </Button>
                    )}
                    <Button
                      onClick={handleSave}
                      disabled={!hasChanges || saving}
                    >
                      {saving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Failed to load preferences. Please try again.
                </p>
                <Button
                  variant="outline"
                  onClick={fetchPreferences}
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">About Notifications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>In-App Notifications:</strong> Appear in your notification
              bell and show real-time updates while you&apos;re using the
              application.
            </p>
            <p>
              <strong>Email Notifications:</strong> Sent to your registered
              email address. Useful for staying updated when you&apos;re not
              actively using the application.
            </p>
          </CardContent>
        </Card>
      </div>
    </FixedHeaderFooterLayout>
  );
}
