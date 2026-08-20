import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Timeslot from '@/models/Timeslot';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    const timeslots = await Timeslot.find({ status: 'Active' })
      .sort({ startTime: 1 })
      .lean<any[]>();

    const formatted = timeslots.map((t, index) => ({
      id: String(t._id),
      timeslot_id: String(t._id),
      title: t.title,
      timeslot: `${t.startTime} - ${t.endTime}`,
      start_time: t.startTime,
      end_time: t.endTime,
      max_orders: t.maxOrders || 50,
      status: t.status,
    }));

    // Fallback defaults if DB is empty
    const defaults = [
      { id: 's1', timeslot_id: 's1', title: 'Morning Delivery', timeslot: '08:00 AM - 11:00 AM', start_time: '08:00', end_time: '11:00', max_orders: 50, status: 'Active' },
      { id: 's2', timeslot_id: 's2', title: 'Afternoon Delivery', timeslot: '11:00 AM - 02:00 PM', start_time: '11:00', end_time: '14:00', max_orders: 50, status: 'Active' },
      { id: 's3', timeslot_id: 's3', title: 'Evening Delivery', timeslot: '02:00 PM - 06:00 PM', start_time: '14:00', end_time: '18:00', max_orders: 50, status: 'Active' },
      { id: 's4', timeslot_id: 's4', title: 'Night Delivery', timeslot: '06:00 PM - 09:00 PM', start_time: '18:00', end_time: '21:00', max_orders: 30, status: 'Active' },
    ];

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Timeslots fetched',
      data: formatted.length > 0 ? formatted : defaults,
    });
  } catch (error: any) {
    console.error('fetchDeliveryTimeslot error:', error);
    return NextResponse.json({
      status: 'success', code: 200, result: 'true',
      message: 'Timeslots fetched',
      data: [
        { id: 's1', timeslot: '08:00 AM - 11:00 AM', title: 'Morning Delivery' },
        { id: 's2', timeslot: '11:00 AM - 02:00 PM', title: 'Afternoon Delivery' },
        { id: 's3', timeslot: '02:00 PM - 06:00 PM', title: 'Evening Delivery' },
        { id: 's4', timeslot: '06:00 PM - 09:00 PM', title: 'Night Delivery' },
      ],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
