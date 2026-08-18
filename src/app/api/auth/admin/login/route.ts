import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const envAdminEmail = process.env.ADMIN_EMAIL || 'admin@groceryhub.ng';
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';

    let adminToken = '';
    let adminUserObj = null;

    // Priority 1: Check against .env credentials for instant setup and environment control
    if (email.trim().toLowerCase() === envAdminEmail.toLowerCase() && password === envAdminPassword) {
      adminToken = generateToken({
        id: 1,
        role: 'admin',
        email: envAdminEmail,
      });

      adminUserObj = {
        id: 1,
        name: 'Super Admin',
        email: envAdminEmail,
        role: 'super_admin',
        permissions: ['all'],
      };
    } else {
      // Priority 2: Check MongoDB Admin collection
      try {
        await connectToDatabase();
        const dbAdmin = await Admin.findOne({ email: email.trim().toLowerCase(), is_active: true }).select('+password');

        if (dbAdmin && dbAdmin.password) {
          const isMatch = await verifyPassword(password, dbAdmin.password);
          if (isMatch) {
            adminToken = generateToken({
              id: dbAdmin.admin_id,
              role: 'admin',
              email: dbAdmin.email,
            });

            adminUserObj = {
              id: dbAdmin.admin_id,
              name: dbAdmin.name,
              email: dbAdmin.email,
              role: dbAdmin.role,
              permissions: dbAdmin.permissions,
            };
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB query warning in admin login:', dbErr);
      }
    }

    if (!adminToken || !adminUserObj) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin email or password' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      data: {
        token: adminToken,
        user: adminUserObj,
      },
    });

    // Set HTTP Cookies on Response Header
    res.cookies.set('auth_token', adminToken, { path: '/', maxAge: 604800, sameSite: 'lax' });
    res.cookies.set('user_role', 'admin', { path: '/', maxAge: 604800, sameSite: 'lax' });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
