import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { user_id, name, email, mobile, profile_pic, address } = body;

    if (!user_id) {
      return NextResponse.json(
        { status: 400, result: 'false', message: 'user_id is required' },
        { status: 400 }
      );
    }

    const update: any = {};
    if (name) update.name = name;
    if (email) update.email = email.toLowerCase();
    if (mobile) update.mobile = mobile;
    if (profile_pic) update.profile_pic = profile_pic;
    if (address) update.address = address;

    await User.updateOne({ user_id: Number(user_id) }, { $set: update });

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    console.error('updateProfileDetails error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
