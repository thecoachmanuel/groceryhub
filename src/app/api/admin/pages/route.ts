import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const pages = await Page.find().lean();
    return NextResponse.json({
      status: 'success',
      data: pages,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { slug, title, content, meta_data } = body;

    if (!slug || !title) {
      return NextResponse.json({ status: 'error', message: 'Slug and title are required' }, { status: 400 });
    }

    const updatedPage = await Page.findOneAndUpdate(
      { slug },
      { $set: { title, content, meta_data } },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      status: 'success',
      message: 'Page updated successfully',
      data: updatedPage,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
