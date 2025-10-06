/**
 * Authentication Bridge Package
 * Exports all authentication bridge components
 */

export { AuthBridge, createAuthBridge, getAuthBridge } from './auth-bridge';
export type {
  User,
  AuthTokens,
  AuthState,
  AuthBridgeConfig,
  AuthBridgeOptions,
} from './types';