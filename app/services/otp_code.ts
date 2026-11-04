import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'

export function generateOtpCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0')
}

export function hashOtpCode(code: string, participantId: number, secret: string): string {
  return createHmac('sha256', secret)
    .update(`lauren-fox-otp:${participantId}:${code}`)
    .digest('hex')
}

export function verifyOtpCode(
  code: string,
  storedHash: string,
  participantId: number,
  secret: string
): boolean {
  if (!/^\d{6}$/.test(code) || !/^[a-f0-9]{64}$/i.test(storedHash)) {
    return false
  }

  const attempted = Buffer.from(hashOtpCode(code, participantId, secret), 'hex')
  const stored = Buffer.from(storedHash, 'hex')

  return timingSafeEqual(attempted, stored)
}
