"use client";

import { useState } from "react";
import { useAuthBridge } from "@/lib/auth-bridge/use-auth-bridge";
import { UserProfileService, type UserProfile, type UpdateUserProfileRequest } from "@/lib/api/services/user-profile-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, MapPin, Calendar, Shield, Key, Activity, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Form validation schemas
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
});

const avatarFormSchema = z.object({
  avatar: z.any().optional(),
});

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuthBridge();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const profileForm = useForm<UpdateUserProfileRequest>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      bio: "",
      dateOfBirth: "",
      gender: "prefer_not_to_say",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
    },
  });

  // Avatar form
  const avatarForm = useForm<{ avatar: FileList | null }>({
    resolver: zodResolver(avatarFormSchema),
  });

  // Queries
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => UserProfileService.getUserProfile(),
    enabled: isAuthenticated,
  });

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => UserProfileService.updateUserProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => UserProfileService.uploadAvatar(file),
    onSuccess: (data) => {
      toast.success("Avatar uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      avatarForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload avatar");
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: () => UserProfileService.deleteAvatar(),
    onSuccess: () => {
      toast.success("Avatar deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete avatar");
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: () => UserProfileService.exportUserData(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "user-data.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export data");
    },
  });

  // Update form when profile data loads
  React.useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "prefer_not_to_say",
        address: profile.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
      });
    }
  }, [profile, profileForm]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
          <Button onClick={() => window.location.href = "/auth/login"}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-destructive">
          <h1 className="text-2xl font-bold mb-4">Error loading profile</h1>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const onProfileSubmit = (data: UpdateUserProfileRequest) => {
    updateProfileMutation.mutate(data);
  };

  const onAvatarSubmit = (data: { avatar: FileList | null }) => {
    if (data.avatar && data.avatar.length > 0) {
      const file = data.avatar[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Avatar file size must be less than 5MB");
        return;
      }
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      avatarForm.setValue("avatar", e.target.files);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and account settings</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={profile?.emailConfirmed ? "default" : "secondary"}>
              {profile?.emailConfirmed ? "Verified" : "Unverified"}
            </Badge>
            {profile?.twoFactorEnabled && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                2FA
              </Badge>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about yourself"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description for your profile (max 500 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="w-full"
                      >
                        {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>
                    Update your address details for delivery and billing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="address.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="address.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="address.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="Country" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="address.postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Postal code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="w-full"
                      >
                        {updateProfileMutation.isPending ? "Updating..." : "Update Address"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Avatar Management */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Update your profile picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <Form {...avatarForm}>
                      <form onSubmit={avatarForm.handleSubmit(onAvatarSubmit)}>
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="flex-1"
                          />
                          <Button
                            type="submit"
                            disabled={uploadAvatarMutation.isPending}
                          >
                            {uploadAvatarMutation.isPending ? "Uploading..." : "Upload"}
                          </Button>
                        </div>
                      </form>
                    </Form>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Maximum file size: 5MB</span>
                      <span>•</span>
                      <span>Formats: JPG, PNG, GIF</span>
                    </div>

                    {profile?.avatar && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAvatarMutation.mutate()}
                        disabled={deleteAvatarMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Avatar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
              <p className="text-muted-foreground mb-4">
                Manage your security settings and two-factor authentication
              </p>
              <Button onClick={() => window.location.href = "/profile/security"}>
                Manage Security Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Active Sessions</h2>
              <p className="text-muted-foreground mb-4">
                View and manage your active sessions across devices
              </p>
              <Button onClick={() => window.location.href = "/profile/sessions"}>
                Manage Sessions
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Preferences</h2>
              <p className="text-muted-foreground mb-4">
                Manage your account preferences and notification settings
              </p>
              <Button onClick={() => window.location.href = "/profile/preferences"}>
                Manage Preferences
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
              <p className="text-muted-foreground mb-4">
                View your account activity and security events
              </p>
              <Button onClick={() => window.location.href = "/profile/activity"}>
                View Activity
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export your data or manage your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Export Your Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of your personal data
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => exportDataMutation.mutate()}
                    disabled={exportDataMutation.isPending}
                  >
                    {exportDataMutation.isPending ? "Exporting..." : "Export Data"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <div>
                      <h3 className="font-medium text-destructive">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" disabled>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}