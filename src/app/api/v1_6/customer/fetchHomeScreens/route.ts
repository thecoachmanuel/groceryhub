import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import HomeScreen from '@/models/HomeScreen';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const screens = await HomeScreen.find({ status: 'Active' })
      .sort({ sort_order: 1 })
      .lean<any[]>()
      .catch(() => []);

    // If no screens configured, return a single default screen
    const data = screens.length > 0
      ? screens.map((s: any) => ({
          id: s.home_screen_id || String(s._id),
          title: s.title || 'Home',
          is_default: s.is_default ?? 1,
          sort_order: s.sort_order ?? 0,
        }))
      : [{ id: 1, title: 'Home', is_default: 1, sort_order: 0 }];

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Home screens fetched',
      data,
    });
  } catch (error: any) {
    console.error('fetchHomeScreens error:', error);
    // Return a default screen on error so the app always has something to load
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Home screens fetched',
      data: [{ id: 1, title: 'Home', is_default: 1, sort_order: 0 }],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
