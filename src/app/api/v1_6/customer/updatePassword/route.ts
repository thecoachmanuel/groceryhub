import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { user_id, mobile, email, new_password, otp } = body;

    const query: any = {};
    if (user_id) query.user_id = Number(user_id);
    else if (email) query.email = email.toLowerCase();
    else if (mobile) query.mobile = mobile;

    if (!Object.keys(query).length || !new_password) {
      return NextResponse.json(
        { status: 400, result: 'false', message: 'User identifier and new password are required' },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await User.updateOne(query, { $set: { password: hashed } });

    return NextResponse.json({
      status: 200,
      result: 'true',
      message: 'Password updated successfully',
    });
  } catch (error: any) {
    console.error('updatePassword error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
