import { NextRequest } from 'next/server';
import { verifyToken, TokenPayload } from '@/lib/jwt';
import { apiError } from '@/lib/api-response';

export type UserRole = 'admin' | 'seller' | 'delivery' | 'user';

export interface AuthContext {
  userId: number;
  role: UserRole;
  email?: string;
  mobile?: string;
  sellerId?: number;
  deliveryBoyId?: number;
}

/**
 * Extract token from Authorization header or cookies
 */
export function extractAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const cookieToken = req.cookies.get('token')?.value || req.cookies.get('auth_token')?.value;
  if (cookieToken) return cookieToken;

  return null;
}

/**
 * Role Guard & Session Validator
 * Ensures only authorized roles can invoke endpoints and prevents cross-user data leakage
 */
export function requireAuth(
  req: NextRequest,
  allowedRoles?: UserRole[]
): { error: null; auth: AuthContext } | { error: Response; auth: null } {
  const token = extractAuthToken(req);

  if (!token) {
    return {
      error: apiError('Authentication required. Please log in.', 401),
      auth: null,
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      error: apiError('Invalid or expired authentication session. Please log in again.', 401),
      auth: null,
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
    return {
      error: apiError(`Access denied. Action restricted to [${allowedRoles.join(', ')}] roles.`, 403),
      auth: null,
    };
  }

  const authContext: AuthContext = {
    userId: payload.id,
    role: payload.role,
    email: payload.email,
    mobile: payload.mobile,
    sellerId: payload.role === 'seller' ? payload.id : undefined,
    deliveryBoyId: payload.role === 'delivery' ? payload.id : undefined,
  };

  return {
    error: null,
    auth: authContext,
  };
}
