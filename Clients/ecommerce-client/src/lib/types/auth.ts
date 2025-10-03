export interface User {
  id: string;
  email: string;
  maskedEmail: string;
  phone?: string;
  maskedPhone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  has2FA: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
  subscribeToNewsletter?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  requires2FA?: boolean;
  twoFactorToken?: string;
}

export interface OTPRequest {
  emailOrPhone: string;
  purpose: 'login' | 'register' | 'forgot_password' | 'enable_2fa';
}

export interface OTPVerification {
  emailOrPhone: string;
  code: string;
  token?: string;
}

export interface ForgotPasswordData {
  emailOrPhone: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface GoogleAuthData {
  token: string;
  rememberMe?: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export interface RecaptchaData {
  token: string;
  action: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  requires2FA: boolean;
  tempToken: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials, recaptchaToken?: string) => Promise<void>;
  register: (data: RegisterData, recaptchaToken?: string) => Promise<void>;
  loginWithGoogle: (data: GoogleAuthData, recaptchaToken?: string) => Promise<void>;
  verifyOTP: (verification: OTPVerification) => Promise<void>;
  resendOTP: (request: OTPRequest) => Promise<void>;
  forgotPassword: (data: ForgotPasswordData, recaptchaToken?: string) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export interface FormErrors {
  [key: string]: string | undefined;
}