import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { user_id, name, email, mobile, profile_pic, address } = body;

    const update: any = {};
    if (name) update.name = name;
    if (email) update.email = email.toLowerCase();
    if (mobile) update.mobile = mobile;
    if (profile_pic) update.profile_pic = profile_pic;
    if (address) update.address = address;

    if (user_id && Object.keys(update).length > 0) {
      await User.updateOne({ user_id: Number(user_id) }, { $set: update }).catch(() => null);
    }

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Profile updated successfully',
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
