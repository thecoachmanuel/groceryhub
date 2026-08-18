import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { apiSuccess, apiError } from '@/lib/api-response';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return apiError('No file provided for upload', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary keys are configured, try Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      try {
        const cloudRes = await uploadToCloudinary(buffer, `groceryhub/${folder}`);
        return apiSuccess(
          {
            url: cloudRes.url,
            public_id: cloudRes.public_id,
            storage: 'cloudinary',
          },
          'Image uploaded to Cloudinary'
        );
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, falling back to local filesystem storage:', cloudErr);
      }
    }

    // Local filesystem storage fallback to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${safeName}`;

    return apiSuccess(
      {
        url: publicUrl,
        filename: safeName,
        storage: 'local',
      },
      'Image uploaded locally to server'
    );
  } catch (error: any) {
    console.error('API Upload Error:', error);
    return apiError(error?.message || 'Failed to process file upload', 500);
  }
}
