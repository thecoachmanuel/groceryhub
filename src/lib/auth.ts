import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET || 'groceryhub_secret_key_2026';

// ── Password Helpers ──────────────────────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(password, hashed);
}

// ── Phone Helpers ─────────────────────────────────────────────────────────────
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('234')) return '+' + cleaned;
  if (cleaned.startsWith('0')) return '+234' + cleaned.slice(1);
  return '+' + cleaned;
}

export function getLocalPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('234')) return '0' + cleaned.slice(3);
  return phone;
}

// ── Encode ────────────────────────────────────────────────────────────────────
export function signToken(payload: Record<string, any>): string {
  const data = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  };
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const body = btoa(JSON.stringify(data))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const sig = btoa(`${SECRET}:${header}.${body}`)
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${header}.${body}.${sig}`;
}

// ── Decode ────────────────────────────────────────────────────────────────────
export function decodeToken(token: string): Record<string, any> | null {
  try {
    if (!token) return null;
    const raw = token.replace(/^Bearer\s+/i, '').trim();
    const parts = raw.split('.');
    if (parts.length < 2) return null;
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(padded + '=='.slice((padded.length * 3) % 4 === 0 ? 2 : (padded.length * 3) % 4 === 1 ? 0 : 1));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ── Extract user_id from Authorization header ─────────────────────────────────
export function getUserIdFromHeader(authHeader: string | null): number | null {
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token.startsWith('gh_token_')) {
    const parts = token.split('_');
    const id = Number(parts[2]);
    return isNaN(id) ? null : id;
  }
  const decoded = decodeToken(token);
  if (decoded?.user_id) return Number(decoded.user_id);
  return null;
}

// ── Extract full user info from header ───────────────────────────────────────
export function getUserFromHeader(authHeader: string | null): Record<string, any> | null {
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token.startsWith('gh_token_')) {
    const parts = token.split('_');
    const id = Number(parts[2]);
    return isNaN(id) ? null : { user_id: id };
  }
  return decodeToken(token);
}
