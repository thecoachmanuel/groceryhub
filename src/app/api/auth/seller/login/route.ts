import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { connectToDatabase } from '@/lib/mongodb';
import Seller from '@/models/Seller';
import { verifyPassword, normalizePhone, getLocalPhone } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, mobile, password } = body;

    const rawInput = (email || mobile || '').trim();
    if (!rawInput || !password) {
      return NextResponse.json(
        { success: false, message: 'Email/Mobile and password are required' },
        { status: 400 }
      );
    }

    const cleanInput = rawInput.toLowerCase();
    const normPhone = normalizePhone(rawInput);
    const localPhone = getLocalPhone(rawInput);

    await connectToDatabase();

    const seller = await Seller.findOne({
      $or: [
        { email: cleanInput },
        { mobile: rawInput },
        { mobile: normPhone },
        { mobile: localPhone },
      ],
    }).select('+password');

    if (!seller) {
      return NextResponse.json(
        { success: false, message: 'Vendor account not found. Please check your details or register as a vendor partner first.' },
        { status: 404 }
      );
    }

    if (seller.status === 'suspended' || seller.status === 'rejected') {
      return NextResponse.json(
        { success: false, message: `Your vendor account status is '${seller.status}'. Please contact vendor support.` },
        { status: 403 }
      );
    }

    if (!seller.password) {
      return NextResponse.json(
        { success: false, message: 'Password is not configured for this account. Please reset your password.' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, seller.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid vendor password. Please check your credentials and try again.' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: seller.seller_id,
      role: 'seller',
      email: seller.email,
      mobile: seller.mobile,
    });

    const res = NextResponse.json({
      success: true,
      message: 'Vendor authenticated successfully',
      data: {
        token,
        seller: {
          id: seller.seller_id,
          name: seller.name,
          store_name: seller.store_name,
          email: seller.email,
          mobile: seller.mobile,
          balance: seller.balance,
          commission_rate: seller.commission_rate,
          status: seller.status,
        },
      },
    });

    // Set HTTP Cookies on Response Header
    res.cookies.set('auth_token', token, { path: '/', maxAge: 604800, sameSite: 'lax' });
    res.cookies.set('user_role', 'seller', { path: '/', maxAge: 604800, sameSite: 'lax' });

    return res;
  } catch (error: any) {
    console.error('Seller login error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Vendor login failed' },
      { status: 500 }
    );
  }
}
