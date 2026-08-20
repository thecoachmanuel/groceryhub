import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { email, name, google_id, uid, photoURL } = body;

    if (!email && !google_id && !uid) {
      return NextResponse.json(
        { status: 400, result: 'false', message: 'Email or Google ID is required' },
        { status: 400 }
      );
    }

    const query: any = {};
    // Look up by email only (google_id not in User schema)
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
        profile_pic: photoURL || '',
        wallet_balance: 0,
        status: 'active',
      });
    }

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Google sign-in successful',
      token: `gh_token_${user._id}_${Date.now()}`,
      user_id: user.user_id || user._id,
      data: {
        user_id: user.user_id || user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || '',
        wallet_balance: user.wallet_balance || 0,
        profile_pic: user.profile_pic || '',
      },
    });
  } catch (error: any) {
    console.error('googleSignin error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
