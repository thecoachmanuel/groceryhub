import bcrypt from 'bcryptjs';

/**
 * Verify a password against a hash (supports PHP $2y$ and standard $2a$ / $2b$ hashes)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  
  // Normalize PHP $2y$ hash to $2a$ for bcryptjs compatibility
  const normalizedHash = hash.startsWith('$2y$')
    ? '$2a$' + hash.substring(4)
    : hash;

  try {
    return await bcrypt.compare(password, normalizedHash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Normalize phone numbers to handle spaces, hyphens, and Nigerian country codes
 * Example:
 * '08023456789' -> '+2348023456789'
 * '+234 802 345 6789' -> '+2348023456789'
 * '2348023456789' -> '+2348023456789'
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[\s\-\(\)]/g, '').trim();
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '+234' + cleaned.substring(1);
  } else if (cleaned.startsWith('234') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  return cleaned;
}

/**
 * Get local phone representation (e.g. 08023456789 from +2348023456789)
 */
export function getLocalPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\(\)]/g, '').trim();
  if (cleaned.startsWith('+234') && cleaned.length === 14) {
    return '0' + cleaned.substring(4);
  }
  if (cleaned.startsWith('234') && cleaned.length === 13) {
    return '0' + cleaned.substring(3);
  }
  return cleaned;
}
