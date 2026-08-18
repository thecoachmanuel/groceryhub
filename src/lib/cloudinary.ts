import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_secret',
  secure: true,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer | string,
  folder: string = 'groceryhub'
): Promise<{ url: string; public_id: string }> {
  try {
    if (typeof fileBuffer === 'string' && fileBuffer.startsWith('data:')) {
      const uploadResult = await cloudinary.uploader.upload(fileBuffer, {
        folder,
        resource_type: 'auto',
      });
      return {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      if (Buffer.isBuffer(fileBuffer)) {
        uploadStream.end(fileBuffer);
      } else {
        uploadStream.end(Buffer.from(fileBuffer));
      }
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
}

export default cloudinary;
