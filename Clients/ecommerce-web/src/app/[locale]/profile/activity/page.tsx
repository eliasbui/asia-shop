"use client";

import { useState } from "react";
import { useAuthBridge } from "@/lib/auth-bridge/use-auth-bridge";
import {
  UserProfileService,
  type UserActivity
} from "@/lib/api/services/user-profile-service";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Activity,
  Calendar,
  Filter,
  Download,
  User,
  Shield,
  Key,
  ShoppingBag,
  Package,
  CreditCard,
  Mail,
  Smartphone,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

const actionIcons: Record<string, any> = {
  login: User,
  logout: User,
  register: User,
  change_password: Key,
  enable_mfa: Shield,
  disable_mfa: Shield,
  verify_mfa: Shield,
  generate_backup_codes: Key,
  purchase: ShoppingBag,
  order_update: Package,
  payment: CreditCard,
  email_verified: Mail,
  phone_verified: Smartphone,
  profile_update: User,
  password_reset: Key,
  account_locked: Shield,
  account_unlocked: Shield,
  api_key_created: Key,
  api_key_deleted: Key,
  session_terminated: User,
  export_data: Download,
  default: Activity,
};

const actionColors: Record<string, string> = {
  login: "text-green-600",
  logout: "text-gray-600",
  register: "text-blue-600",
  change_password: "text-orange-600",
  enable_mfa: "text-green-600",
  disable_mfa: "text-red-600",
  verify_mfa: "text-green-600",
  generate_backup_codes: "text-blue-600",
  purchase: "text-purple-600",
  order_update: "text-purple-600",
  payment: "text-green-600",
  email_verified: "text-blue-600",
  phone_verified: "text-blue-600",
  profile_update: "text-gray-600",
  password_reset: "text-orange-600",
  account_locked: "text-red-600",
  account_unlocked: "text-green-600",
  api_key_created: "text-blue-600",
  api_key_deleted: "text-red-600",
  session_terminated: "text-orange-600",
  export_data: "text-gray-600",
  default: "text-gray-600",
};

const actionTypes = [
  { value: "", label: "All Actions" },
  { value: "login", label: "Login" },
  { value: "logout", label: "Logout" },
  { value: "register", label: "Register" },
  { value: "change_password", label: "Change Password" },
  { value: "enable_mfa", label: "Enable MFA" },
  { value: "disable_mfa", label: "Disable MFA" },
  { value: "verify_mfa", label: "Verify MFA" },
  { value: "generate_backup_codes", label: "Generate Backup Codes" },
  { value: "purchase", label: "Purchase" },
  { value: "order_update", label: "Order Update" },
  { value: "payment", label: "Payment" },
  { value: "profile_update", label: "Profile Update" },
  { value: "password_reset", label: "Password Reset" },
  { value: "api_key_created", label: "API Key Created" },
  { value: "api_key_deleted", label: "API Key Deleted" },
  { value: "session_terminated", label: "Session Terminated" },
  { value: "export_data", label: "Data Export" },
];

export default function ActivityPage() {
  const { isAuthenticated, redirectToAuth } = useAuthBridge();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedAction, setSelectedAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Query for user activity
  const {
    data: activityData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["user-activity", currentPage, pageSize, selectedAction, startDate, endDate],
    queryFn: () => UserProfileService.getUserActivity(
      currentPage,
      pageSize,
      selectedAction || undefined,
      startDate || undefined,
      endDate || undefined
    ),
    enabled: isAuthenticated,
  });

  const handleFilter = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleReset = () => {
    setCurrentPage(1);
    setSelectedAction("");
    setStartDate("");
    setEndDate("");
    setTimeout(refetch, 0);
  };

  const getActionIcon = (action: string) => {
    const Icon = actionIcons[action] || actionIcons.default;
    return <Icon className={`w-4 h-4 ${actionColors[action] || actionColors.default}`} />;
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your activity</h1>
          <Button onClick={() => redirectToAuth()}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">View your account activity and security events</p>
        </div>
        <Button variant="outline" disabled>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter your activity logs by date and action type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="action">Action Type</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={handleFilter}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your recent account activities and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Failed to Load Activity</h3>
              <p className="text-muted-foreground mb-4">
                There was an error loading your activity logs. Please try again.
              </p>
              <Button onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : !activityData?.activities || activityData.activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Activity Found</h3>
              <p className="text-muted-foreground">
                {selectedAction || startDate || endDate
                  ? "No activity matches your filters. Try adjusting your criteria."
                  : "No activity recorded yet."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activityData.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            {formatAction(activity.action)}
                          </h3>
                          {getStatusIcon(activity.success)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(activity.timestamp)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {activity.ipAddress}
                          </div>
                          <div className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3" />
                            {activity.userAgent.slice(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {activityData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pageSize) + 1} to{' '}
                    {Math.min(currentPage * pageSize, activityData.totalRecords)} of{' '}
                    {activityData.totalRecords} activities
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} of {activityData.totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= activityData.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}