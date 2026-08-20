import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { email, name, google_id, uid, photoURL, photo } = body;

    if (!email && !google_id && !uid) {
      return NextResponse.json(
        { status: 'error', success: false, result: 'false', message: 'Email or Google ID is required' },
        { status: 400 }
      );
    }

    let user: any = null;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() }).lean();
    }

    if (!user) {
      // Auto-register new social login user with placeholder mobile
      const placeholderMobile = `google_${(google_id || uid || Date.now()).toString().slice(-10)}`;
      user = await User.create({
        user_id: Date.now(),
        name: name || email?.split('@')[0] || 'User',
        email: email?.toLowerCase() || '',
        mobile: placeholderMobile,
        profile_pic: photoURL || photo || '',
        wallet_balance: 0,
        status: 'active',
      });
    }

    const token = `gh_token_${user._id}_${Date.now()}`;
    const userData = {
      user_id: user.user_id || user._id,
      id: String(user._id),
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      wallet_balance: user.wallet_balance || 0,
      profile_pic: user.profile_pic || '',
    };

    return NextResponse.json({
      status: 'success',
      success: true,
      result: 'true',
      code: 200,
      message: 'Google sign-in successful',
      token,
      user_id: user.user_id || user._id,
      data: {
        token,
        user: userData,
        ...userData,
      },
    });
  } catch (error: any) {
    console.error('googleSignin error:', error);
    return NextResponse.json(
      { status: 'error', success: false, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
