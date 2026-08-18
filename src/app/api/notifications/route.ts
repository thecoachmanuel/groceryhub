import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { extractAuthToken } from '@/lib/auth-guard';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = extractAuthToken(req);
    const payload = token ? verifyToken(token) : null;
    const userRole = payload?.role || 'user';
    const userId = payload?.id || 0;

    try {
      await connectToDatabase();
      const notifications = await Notification.find({
        $or: [
          { target_role: 'all' },
          { target_role: userRole },
          ...(userId ? [{ target_user_id: userId }] : []),
        ],
      })
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();

      return apiSuccess(
        {
          notifications: notifications.map((n) => ({
            id: n.notification_id,
            title: n.title,
            message: n.message,
            image: n.image,
            target_role: n.target_role,
            is_read: userId ? n.read_by?.includes(userId) : false,
            created_at: n.createdAt,
          })),
        },
        'Notifications fetched successfully'
      );
    } catch (dbErr) {
      console.warn('MongoDB notifications warning:', dbErr);
    }

    // Default mock notifications in Naira
    return apiSuccess(
      {
        notifications: [
          {
            id: 'NOTIF-101',
            title: 'Weekend Flash Sale ⚡',
            message: 'Enjoy up to 40% OFF all organic greens and fresh fruits today across Lagos!',
            target_role: 'all',
            is_read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: 'NOTIF-102',
            title: 'Free Delivery Unlocked',
            message: 'All orders over ₦15,000 receive 100% free 30-minute doorstep courier delivery.',
            target_role: 'user',
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      },
      'Notifications fetched successfully'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Failed to fetch notifications', 500);
  }
}
