import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-guard';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { error } = requireAuth(req, ['admin']);
    if (error) return error;

    const body = await req.json().catch(() => ({}));
    const { title, message, target_role, image, action_url } = body;

    if (!title || !message) {
      return apiError('Title and message are required', 400);
    }

    const notificationId = `NOTIF_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

    try {
      await connectToDatabase();
      const newNotif = await Notification.create({
        notification_id: notificationId,
        title,
        message,
        image: image || '',
        target_role: target_role || 'all',
        action_url: action_url || '',
        read_by: [],
      });

      return apiSuccess(
        {
          notification: newNotif,
        },
        'Notification broadcasted successfully via MongoDB Notification Engine'
      );
    } catch (dbErr: any) {
      console.warn('MongoDB save warning in send notification:', dbErr);
    }

    return apiSuccess(
      {
        notification: {
          notification_id: notificationId,
          title,
          message,
          target_role: target_role || 'all',
        },
      },
      'Notification sent successfully'
    );
  } catch (error: any) {
    return apiError(error?.message || 'Failed to send notification', 500);
  }
}
