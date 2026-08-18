import { NextRequest } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return apiError('Email and password are required', 400);
    }

    const envAdminEmail = process.env.ADMIN_EMAIL || 'admin@groceryhub.ng';
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';

    // Priority 1: Check against .env credentials for instant setup and environment control
    if (email.trim().toLowerCase() === envAdminEmail.toLowerCase() && password === envAdminPassword) {
      const token = generateToken({
        id: 1,
        role: 'admin',
        email: envAdminEmail,
      });

      return apiSuccess(
        {
          token,
          user: {
            id: 1,
            name: 'Super Admin',
            email: envAdminEmail,
            role: 'super_admin',
            permissions: ['all'],
          },
        },
        'Admin authenticated successfully'
      );
    }

    // Priority 2: Check MongoDB Admin collection
    try {
      await connectToDatabase();
      const adminUser = await Admin.findOne({ email: email.trim().toLowerCase(), is_active: true }).select('+password');

      if (adminUser && adminUser.password) {
        const isMatch = await verifyPassword(password, adminUser.password);
        if (isMatch) {
          const token = generateToken({
            id: adminUser.admin_id,
            role: 'admin',
            email: adminUser.email,
          });

          return apiSuccess(
            {
              token,
              user: {
                id: adminUser.admin_id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
                permissions: adminUser.permissions,
              },
            },
            'Admin authenticated successfully'
          );
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB query warning in admin login:', dbErr);
    }

    return apiError('Invalid admin email or password', 401);
  } catch (error: any) {
    return apiError(error?.message || 'Login failed', 500);
  }
}
