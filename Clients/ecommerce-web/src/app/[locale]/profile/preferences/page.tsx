"use client";

import { useState, useEffect } from "react";
import { useAuthBridge } from "@/lib/auth-bridge/use-auth-bridge";
import {
  UserProfileService,
  type UserPreferences,
  type NotificationSettings,
  type UpdateUserPreferencesRequest,
  type UpdateNotificationSettingsRequest
} from "@/lib/api/services/user-profile-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Palette,
  Globe,
  Bell,
  CreditCard,
  Mail,
  Smartphone,
  ShoppingCart,
  Package,
  Tag,
  Settings,
  Save
} from "lucide-react";
import { toast } from "sonner";

const preferencesFormSchema = z.object({
  language: z.string().min(1, "Language is required"),
  timezone: z.string().min(1, "Timezone is required"),
  theme: z.enum(["light", "dark", "auto"]),
  currency: z.string().min(1, "Currency is required"),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  twoFactorReminder: z.boolean(),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  twoFactorReminder: z.boolean(),
  loginAlerts: z.boolean(),
  passwordChangeAlerts: z.boolean(),
  purchaseConfirmations: z.boolean(),
  shippingUpdates: z.boolean(),
  promotionalOffers: z.boolean(),
  newsletter: z.boolean(),
});

const languages = [
  { code: "en", name: "English" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh City (GMT+7)" },
  { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (GMT+8)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  { value: "Asia/Seoul", label: "Seoul (GMT+9)" },
  { value: "UTC-8", label: "Pacific Time (GMT-8)" },
  { value: "UTC-5", label: "Eastern Time (GMT-5)" },
];

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "KRW", symbol: "₩", name: "Korean Won" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
];

export default function PreferencesPage() {
  const { isAuthenticated, redirectToAuth } = useAuthBridge();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  const preferencesForm = useForm<UpdateUserPreferencesRequest>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      language: "en",
      timezone: "Asia/Ho_Chi_Minh",
      theme: "light",
      currency: "USD",
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      twoFactorReminder: true,
    },
  });

  const notificationSettingsForm = useForm<UpdateNotificationSettingsRequest>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      twoFactorReminder: true,
      loginAlerts: true,
      passwordChangeAlerts: true,
      purchaseConfirmations: true,
      shippingUpdates: true,
      promotionalOffers: false,
      newsletter: false,
    },
  });

  // Queries
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ["user-preferences"],
    queryFn: () => UserProfileService.getUserPreferences(),
    enabled: isAuthenticated,
  });

  const { data: notificationSettings, isLoading: notificationsLoading } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: () => UserProfileService.getNotificationSettings(),
    enabled: isAuthenticated,
  });

  // Mutations
  const updatePreferencesMutation = useMutation({
    mutationFn: (data: UpdateUserPreferencesRequest) => UserProfileService.updateUserPreferences(data),
    onSuccess: () => {
      toast.success("Preferences updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update preferences");
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (data: UpdateNotificationSettingsRequest) => UserProfileService.updateNotificationSettings(data),
    onSuccess: () => {
      toast.success("Notification settings updated successfully");
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update notification settings");
    },
  });

  // Update forms when data loads
  useEffect(() => {
    if (preferences) {
      preferencesForm.reset({
        language: preferences.language,
        timezone: preferences.timezone,
        theme: preferences.theme,
        currency: preferences.currency,
        emailNotifications: preferences.emailNotifications,
        smsNotifications: preferences.smsNotifications,
        marketingEmails: preferences.marketingEmails,
        twoFactorReminder: preferences.twoFactorReminder,
      });
    }
  }, [preferences, preferencesForm]);

  useEffect(() => {
    if (notificationSettings) {
      notificationSettingsForm.reset({
        emailNotifications: notificationSettings.emailNotifications,
        smsNotifications: notificationSettings.smsNotifications,
        marketingEmails: notificationSettings.marketingEmails,
        twoFactorReminder: notificationSettings.twoFactorReminder,
        loginAlerts: notificationSettings.loginAlerts,
        passwordChangeAlerts: notificationSettings.passwordChangeAlerts,
        purchaseConfirmations: notificationSettings.purchaseConfirmations,
        shippingUpdates: notificationSettings.shippingUpdates,
        promotionalOffers: notificationSettings.promotionalOffers,
        newsletter: notificationSettings.newsletter,
      });
    }
  }, [notificationSettings, notificationSettingsForm]);

  const onPreferencesSubmit = (data: UpdateUserPreferencesRequest) => {
    updatePreferencesMutation.mutate(data);
  };

  const onNotificationsSubmit = (data: UpdateNotificationSettingsRequest) => {
    updateNotificationsMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to manage your preferences</h1>
          <Button onClick={() => redirectToAuth()}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Preferences</h1>
          <p className="text-muted-foreground">Manage your account preferences and notification settings</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Regional Settings
              </CardTitle>
              <CardDescription>
                Configure your language, timezone, and currency preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {preferencesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              ) : (
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={preferencesForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {languages.map((lang) => (
                                  <SelectItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="timezone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timezones.map((tz) => (
                                  <SelectItem key={tz.value} value={tz.value}>
                                    {tz.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={preferencesForm.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem key={currency.code} value={currency.code}>
                                    {currency.symbol} {currency.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="auto">Auto</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Basic Notifications</h3>
                      <div className="space-y-4">
                        <FormField
                          control={preferencesForm.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Email Notifications</FormLabel>
                                <FormDescription>
                                  Receive notifications via email
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={preferencesForm.control}
                          name="smsNotifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">SMS Notifications</FormLabel>
                                <FormDescription>
                                  Receive notifications via SMS
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={preferencesForm.control}
                          name="marketingEmails"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Marketing Emails</FormLabel>
                                <FormDescription>
                                  Receive promotional offers and marketing content
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={preferencesForm.control}
                          name="twoFactorReminder"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">2FA Reminders</FormLabel>
                                <FormDescription>
                                  Receive reminders about two-factor authentication
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={updatePreferencesMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updatePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <Form {...notificationSettingsForm}>
                  <form onSubmit={notificationSettingsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="pb-4 border-b">
                        <h3 className="text-lg font-medium mb-4">Security Notifications</h3>
                        <div className="space-y-4">
                          <FormField
                            control={notificationSettingsForm.control}
                            name="loginAlerts"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Login Alerts</FormLabel>
                                  <FormDescription>
                                    Get notified when someone logs into your account
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={notificationSettingsForm.control}
                            name="passwordChangeAlerts"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Password Changes</FormLabel>
                                  <FormDescription>
                                    Get notified when your password is changed
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={notificationSettingsForm.control}
                            name="twoFactorReminder"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">2FA Reminders</FormLabel>
                                  <FormDescription>
                                    Reminders about two-factor authentication
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="pb-4 border-b">
                        <h3 className="text-lg font-medium mb-4">Shopping Notifications</h3>
                        <div className="space-y-4">
                          <FormField
                            control={notificationSettingsForm.control}
                            name="purchaseConfirmations"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Purchase Confirmations</FormLabel>
                                  <FormDescription>
                                    Order confirmations and receipts
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={notificationSettingsForm.control}
                            name="shippingUpdates"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Shipping Updates</FormLabel>
                                  <FormDescription>
                                    Track your orders and delivery status
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Marketing & Promotions</h3>
                        <div className="space-y-4">
                          <FormField
                            control={notificationSettingsForm.control}
                            name="promotionalOffers"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Promotional Offers</FormLabel>
                                  <FormDescription>
                                    Special deals and discounts
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={notificationSettingsForm.control}
                            name="newsletter"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">Newsletter</FormLabel>
                                  <FormDescription>
                                    Weekly newsletter with updates and features
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={notificationSettingsForm.control}
                            name="marketingEmails"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">General Marketing</FormLabel>
                                  <FormDescription>
                                    Other marketing communications
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={updateNotificationsMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateNotificationsMutation.isPending ? "Saving..." : "Save Notification Settings"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Manage your privacy and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Privacy Controls</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced privacy settings will be available soon
                </p>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}