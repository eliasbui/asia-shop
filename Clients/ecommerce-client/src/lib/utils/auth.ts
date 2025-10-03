import { z } from 'zod';
import { PasswordValidation, FormErrors } from '@/lib/types/auth';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports international formats)
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{10,}$/;

// Password validation schema
const PASSWORD_SCHEMA = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)');

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLoginForm = (emailOrPhone: string, password: string): FormErrors => {
  const errors: FormErrors = {};

  if (!emailOrPhone.trim()) {
    errors.emailOrPhone = 'Email or phone number is required';
  } else if (!validateEmail(emailOrPhone) && !validatePhone(emailOrPhone)) {
    errors.emailOrPhone = 'Please enter a valid email or phone number';
  }

  if (!password.trim()) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateRegisterForm = (data: {
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
}): FormErrors => {
  const errors: FormErrors = {};

  // Email validation
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (optional but if provided, must be valid)
  if (data.phone && data.phone.trim() && !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Password validation
  if (!data.password.trim()) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0]; // Show first error
    }
  }

  // Confirm password validation
  if (!data.confirmPassword.trim()) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // First name validation
  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters long';
  }

  // Last name validation
  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters long';
  }

  // Terms agreement validation
  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions';
  }

  return errors;
};

export const validateForgotPasswordForm = (emailOrPhone: string): FormErrors => {
  const errors: FormErrors = {};

  if (!emailOrPhone.trim()) {
    errors.emailOrPhone = 'Email or phone number is required';
  } else if (!validateEmail(emailOrPhone) && !validatePhone(emailOrPhone)) {
    errors.emailOrPhone = 'Please enter a valid email or phone number';
  }

  return errors;
};

export const validateResetPasswordForm = (password: string, confirmPassword: string): FormErrors => {
  const errors: FormErrors = {};

  if (!password.trim()) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0]; // Show first error
    }
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateOTPForm = (code: string): FormErrors => {
  const errors: FormErrors = {};

  if (!code.trim()) {
    errors.code = 'Verification code is required';
  } else if (!/^\d{6}$/.test(code.replace(/\s/g, ''))) {
    errors.code = 'Please enter a valid 6-digit verification code';
  }

  return errors;
};

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 3) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart.slice(0, 3)}***@${domain}`;
};

export const maskPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length <= 6) {
    return `${cleanPhone.slice(0, 2)}******`;
  }
  return `${cleanPhone.slice(0, 2)}******${cleanPhone.slice(-2)}`;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');

  // Format for international numbers
  if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
    return `+${cleanPhone.slice(0, 1)} ${cleanPhone.slice(1, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
  }

  // Format for standard numbers (10 digits)
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
  }

  return phone; // Return original if it doesn't match expected formats
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const generateRecaptchaToken = async (action: string): Promise<string | null> => {
  if (typeof window === 'undefined' || !window.grecaptcha) {
    return null;
  }

  try {
    const token = await new Promise<string>((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action })
          .then(resolve)
          .catch(reject);
      });
    });
    return token;
  } catch (error) {
    console.error('reCAPTCHA token generation failed:', error);
    return null;
  }
};

// Add TypeScript declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}