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
