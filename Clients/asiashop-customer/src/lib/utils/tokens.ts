import crypto from 'crypto'

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generatePhoneVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}