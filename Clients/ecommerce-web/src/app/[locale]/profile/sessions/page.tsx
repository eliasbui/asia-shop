"use client";

import { useState } from "react";
import { useAuthBridge } from "@/lib/auth-bridge/use-auth-bridge";
import {
  SessionService,
  type SessionInfo,
  type SessionStatistics,
  type UpdateSessionTimeoutRequest
} from "@/lib/api/services/session-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Shield,
  Trash2,
  Settings,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const sessionTimeoutFormSchema = z.object({
  sessionTimeoutMinutes: z.number().min(5).max(1440),
  concurrentSessionLimit: z.number().min(1).max(10),
});

export default function SessionsPage() {
  const { isAuthenticated, user } = useAuthBridge();
  const queryClient = useQueryClient();
  const [showSettings, setShowSettings] = useState(false);

  const sessionTimeoutForm = useForm<UpdateSessionTimeoutRequest>({
    resolver: zodResolver(sessionTimeoutFormSchema),
    defaultValues: {
      sessionTimeoutMinutes: 30,
      concurrentSessionLimit: 3,
    },
  });

  // Queries
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useQuery({
    queryKey: ["active-sessions"],
    queryFn: () => SessionService.getActiveSessions(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ["session-statistics"],
    queryFn: () => SessionService.getSessionStatistics(),
    enabled: isAuthenticated,
  });

  // Mutations
  const terminateSessionMutation = useMutation({
    mutationFn: (sessionId: string) => SessionService.terminateSession(sessionId),
    onSuccess: () => {
      toast.success("Session terminated successfully");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-statistics"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to terminate session");
    },
  });

  const terminateAllOthersMutation = useMutation({
    mutationFn: () => SessionService.terminateAllOtherSessions(),
    onSuccess: (data) => {
      toast.success(`Terminated ${data.terminatedCount} other sessions`);
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["session-statistics"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to terminate sessions");
    },
  });

  const updateTimeoutMutation = useMutation({
    mutationFn: (data: UpdateSessionTimeoutRequest) => SessionService.updateSessionTimeout(data),
    onSuccess: () => {
      toast.success("Session settings updated successfully");
      setShowSettings(false);
      queryClient.invalidateQueries({ queryKey: ["session-statistics"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update settings");
    },
  });

  const onTimeoutSubmit = (data: UpdateSessionTimeoutRequest) => {
    updateTimeoutMutation.mutate(data);
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes("mobile") || device.toLowerCase().includes("phone")) {
      return <Smartphone className="w-4 h-4" />;
    }
    if (device.toLowerCase().includes("tablet") || device.toLowerCase().includes("ipad")) {
      return <Tablet className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const isSessionExpiringSoon = (session: SessionInfo) => {
    return SessionService.isSessionExpiringSoon(session);
  };

  const getSessionTimeRemaining = (session: SessionInfo) => {
    const minutes = SessionService.getSessionTimeRemaining(session);
    if (minutes <= 0) return "Expired";
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  };

  const getSessionDuration = (session: SessionInfo) => {
    const minutes = SessionService.getSessionDuration(session);
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your sessions</h1>
          <Button onClick={() => window.location.href = "/auth/login"}>
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
          <h1 className="text-3xl font-bold">Active Sessions</h1>
          <p className="text-muted-foreground">Manage your active sessions across all devices</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="destructive"
            onClick={() => terminateAllOthersMutation.mutate()}
            disabled={terminateAllOthersMutation.isPending || !sessions || sessions.length <= 1}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Terminate All Others
          </Button>
        </div>
      </div>

      {/* Session Settings */}
      {showSettings && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Session Settings</CardTitle>
            <CardDescription>
              Configure your session timeout and concurrent session limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={sessionTimeoutForm.handleSubmit(onTimeoutSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeoutMinutes">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    min="5"
                    max="1440"
                    {...sessionTimeoutForm.register("sessionTimeoutMinutes", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How long sessions remain active (5-1440 minutes)
                  </p>
                </div>
                <div>
                  <Label htmlFor="concurrentSessionLimit">Concurrent Sessions</Label>
                  <Input
                    id="concurrentSessionLimit"
                    type="number"
                    min="1"
                    max="10"
                    {...sessionTimeoutForm.register("concurrentSessionLimit", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum number of simultaneous sessions (1-10)
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateTimeoutMutation.isPending}
                >
                  {updateTimeoutMutation.isPending ? "Updating..." : "Update Settings"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">
                  {statistics?.activeSessions || (sessions?.length || 0)}
                </p>
              </div>
              <Monitor className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Timeout</p>
                <p className="text-2xl font-bold">
                  {statistics?.currentSessionTimeout || 30}m
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Devices Used</p>
                <p className="text-2xl font-bold">
                  {statistics?.devicesUsed?.length || 0}
                </p>
              </div>
              <Smartphone className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                <p className="text-2xl font-bold">
                  {statistics?.lastLoginAt
                    ? format(new Date(statistics.lastLoginAt), "MMM dd")
                    : "Never"
                  }
                </p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Sessions that are currently active on your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : sessionsError ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load sessions. Please try again later.
              </AlertDescription>
            </Alert>
          ) : !sessions || sessions.length === 0 ? (
            <div className="text-center py-8">
              <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No active sessions</h3>
              <p className="text-muted-foreground">
                You don't have any active sessions at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  className={`p-4 border rounded-lg ${
                    session.isCurrent ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getDeviceIcon(session.device)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {session.device}
                          </h3>
                          {session.isCurrent && (
                            <Badge variant="default">Current</Badge>
                          )}
                          {isSessionExpiringSoon(session) && (
                            <Badge variant="destructive">Expiring Soon</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {session.browser}
                          </div>
                          <div className="flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            {session.operatingSystem}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Duration: {getSessionDuration(session)}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {session.ipAddress}
                          </div>
                          {session.location && (
                            <span>{session.location}</span>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires: {getSessionTimeRemaining(session)}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Last activity: {format(new Date(session.lastActivity), "MMM dd, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.isCurrent ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </Badge>
                      ) : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => terminateSessionMutation.mutate(session.sessionId)}
                          disabled={terminateSessionMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Terminate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}