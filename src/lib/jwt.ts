import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'groceryhub_super_secret_jwt_key_2026';

export interface TokenPayload {
  id: number;
  role: 'admin' | 'seller' | 'user' | 'delivery';
  mobile?: string;
  email?: string;
}

export function generateToken(payload: TokenPayload, expiresIn: string | number = '30d'): string {
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
