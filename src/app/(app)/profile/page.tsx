"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_PROFILE } from "@/lib/services/profile_service";
import { Button } from "@/lib/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card";
import { Input } from "@/lib/ui/input";
import { Label } from "@/lib/ui/label";
import { Separator } from "@/lib/ui/separator";
import { Skeleton } from "@/lib/ui/skeleton";
import {
  UserCircleIcon,
  KeyIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import type { Profile, ProfileUpdateData } from "@/lib/types/profile";
import FixedHeaderFooterLayout from "@/lib/components/Layout/FixedHeaderFooterLayout";
import { handleServerError } from "@/lib/api/_axios";
import { ErrorResponse } from "@/lib/types/common";
import ChangePasswordModal from "@/lib/components/Pages/Profile/ChangePasswordModal";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProfileUpdateData>({
    firstname: "",
    lastname: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API_PROFILE.getProfile();
      setProfile(response.data);
      setFormData({
        firstname: response.data.firstname,
        lastname: response.data.lastname || "",
        phone: response.data.phone || "",
      });
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg || "Failed to load profile");
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.firstname.trim()) {
      toast.error("First name is required");
      return;
    }

    if (formData.firstname.length < 2 || formData.firstname.length > 50) {
      toast.error("First name must be between 2 and 50 characters");
      return;
    }

    try {
      setIsSaving(true);
      const response = await API_PROFILE.updateProfile(formData);
      setProfile(response.data);
      setIsEditing(false);
      toast.success(response.message || "Profile updated successfully");
    } catch (error) {
      handleServerError(error as ErrorResponse, (err_msg) => {
        toast.error(err_msg || "Failed to update profile");
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstname: profile.firstname,
        lastname: profile.lastname || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <FixedHeaderFooterLayout title="My Profile">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </FixedHeaderFooterLayout>
    );
  }

  if (!profile) {
    return (
      <FixedHeaderFooterLayout title="My Profile">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Failed to load profile</p>
              <Button onClick={fetchProfile} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </FixedHeaderFooterLayout>
    );
  }

  return (
    <FixedHeaderFooterLayout title="My Profile">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Personal Information Card */}
        <Card >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserCircleIcon className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your personal details and contact information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstname"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({ ...formData, firstname: e.target.value })
                      }
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      id="lastname"
                      value={formData.lastname}
                      onChange={(e) =>
                        setFormData({ ...formData, lastname: e.target.value })
                      }
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">
                      {profile.firstname} {profile.lastname}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
                {profile.phone && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{profile.phone}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Organization Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5" />
              Organization Details
            </CardTitle>
            <CardDescription>Your role and organizational information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{profile.role?.name || "N/A"}</p>
              </div>
            </div>
            {profile.departmentId && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{profile.departmentId.name}</p>
                  </div>
                </div>
              </>
            )}
            {profile.positionId && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{profile.positionId.name}</p>
                  </div>
                </div>
              </>
            )}
            {profile.branchId && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-medium">{profile.branchId.name}</p>
                  </div>
                </div>
              </>
            )}
            <Separator />
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(profile.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        {profile.authentication?.provider === "local" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyIcon className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Change your password to keep your account secure
                  </p>
                </div>
                <Button
                  onClick={() => setShowChangePassword(true)}
                  variant="outline"
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Account Status</span>
              <span
                className={`text-sm font-medium ${
                  profile.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {profile.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentication Provider</span>
              <span className="text-sm font-medium capitalize">
                {profile.authentication?.provider || "Local"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </FixedHeaderFooterLayout>
  );
};

export default ProfilePage;
