import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/state/auth-store";
import { UserService } from "@/lib/api/services/user-service";
import { api } from "@/lib/api/fetch-wrapper";
import { AuthResponseSchema, UserSchema } from "@/types/models";
import { useRouter } from "next/navigation";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

// Login hook
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      rememberMe,
    }: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      if (USE_MOCK_API) {
        // Use mock API
        const response = await api.post("/auth/login", {
          email,
          password,
        }, {
          schema: AuthResponseSchema,
        });
        return response;
      } else {
        // Use real API
        return UserService.login(email, password, rememberMe);
      }
    },
    onSuccess: (data) => {
      if (data.accessToken) {
        login(data.user, data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.push("/");
      }
    },
  });
}

// Register hook
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      confirmPassword,
      name,
      phone,
    }: {
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
      phone?: string;
    }) => {
      if (USE_MOCK_API) {
        // Use mock API
        const response = await api.post("/auth/register", {
          email,
          password,
          name,
        }, {
          schema: AuthResponseSchema,
        });
        return response;
      } else {
        // Use real API
        return UserService.register(email, password, confirmPassword, name, phone);
      }
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/");
    },
  });
}

// Logout hook
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout, accessToken } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (USE_MOCK_API) {
        // Mock logout
        return Promise.resolve();
      } else {
        // Use real API
        if (accessToken) {
          return UserService.logout(accessToken);
        }
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push("/");
    },
  });
}

// Current user hook
export function useCurrentUser() {
  const { accessToken, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["user", "current"],
    queryFn: async () => {
      if (USE_MOCK_API) {
        // Use mock API
        const response = await api.get("/user/profile", {
          schema: UserSchema,
          requiresAuth: true,
        });
        return response;
      } else {
        // Use real API
        if (!accessToken) throw new Error("No access token");
        return UserService.getCurrentUser(accessToken);
      }
    },
    enabled: isAuthenticated && !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}

// Update profile hook
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { accessToken, updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (updates: {
      name?: string;
      phone?: string;
      avatar?: string;
    }) => {
      if (USE_MOCK_API) {
        // Mock update
        return { ...updates, id: "user-1", email: "user@example.com", createdAt: new Date().toISOString() };
      } else {
        // Use real API
        if (!accessToken) throw new Error("No access token");
        return UserService.updateProfile(accessToken, updates);
      }
    },
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
}

// Change password hook
export function useChangePassword() {
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      if (USE_MOCK_API) {
        // Mock password change
        return Promise.resolve();
      } else {
        // Use real API
        if (!accessToken) throw new Error("No access token");
        return UserService.changePassword(accessToken, currentPassword, newPassword, confirmPassword);
      }
    },
  });
}

// MFA Setup hook
export function useSetupMFA() {
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (USE_MOCK_API) {
        // Mock MFA setup
        return {
          qrCodeUri: "data:image/png;base64,mock-qr-code",
          manualKey: "MOCK-SECRET-KEY",
        };
      } else {
        // Use real API
        if (!accessToken) throw new Error("No access token");
        return UserService.setupMfa(accessToken);
      }
    },
  });
}

// MFA Verify hook
export function useVerifyMFA() {
  const { setAccessToken } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      code,
      trustDevice,
      tempToken,
    }: {
      code: string;
      trustDevice?: boolean;
      tempToken?: string;
    }) => {
      if (USE_MOCK_API) {
        // Mock MFA verification
        return { accessToken: "mock-access-token-after-mfa" };
      } else {
        // Use real API
        return UserService.verifyMfa(code, trustDevice, tempToken);
      }
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      router.push("/");
    },
  });
}

// OTP Send hook
export function useSendOTP() {
  return useMutation({
    mutationFn: async (phoneOrEmail: string) => {
      if (USE_MOCK_API) {
        // Mock OTP send
        return api.post("/auth/otp/send", {
          phone: phoneOrEmail.includes("@") ? undefined : phoneOrEmail,
          email: phoneOrEmail.includes("@") ? phoneOrEmail : undefined,
        });
      } else {
        // Use real API
        return UserService.sendOtp(phoneOrEmail);
      }
    },
  });
}

// OTP Verify hook
export function useVerifyOTP() {
  return useMutation({
    mutationFn: async ({
      phoneOrEmail,
      code,
    }: {
      phoneOrEmail: string;
      code: string;
    }) => {
      if (USE_MOCK_API) {
        // Mock OTP verification
        return api.post("/auth/otp/verify", { otp: code });
      } else {
        // Use real API
        return UserService.verifyOtp(phoneOrEmail, code);
      }
    },
  });
}

// Forgot password hook
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      if (USE_MOCK_API) {
        // Mock forgot password
        return Promise.resolve();
      } else {
        // Use real API
        return UserService.forgotPassword(email);
      }
    },
  });
}

// Reset password hook
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      token,
      newPassword,
      confirmPassword,
    }: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      if (USE_MOCK_API) {
        // Mock reset password
        return Promise.resolve();
      } else {
        // Use real API
        return UserService.resetPassword(token, newPassword, confirmPassword);
      }
    },
    onSuccess: () => {
      router.push("/auth/login");
    },
  });
}
