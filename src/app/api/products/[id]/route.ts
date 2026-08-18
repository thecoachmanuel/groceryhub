import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;
    const body = await req.json().catch(() => ({}));
    const { name, category, price, stock, description, image, status } = body;

    const numericId = parseInt(id, 10);
    const filter = isNaN(numericId) ? { _id: id } : { $or: [{ product_id: numericId }, { id: numericId }, { _id: id }] };

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (image) updateData.image = image;
    if (status) updateData.status = status;

    if (price !== undefined || stock !== undefined) {
      const existing = await Product.findOne(filter);
      if (existing && existing.variants && existing.variants.length > 0) {
        existing.variants[0].price = parseFloat(price ?? existing.variants[0].price);
        existing.variants[0].discounted_price = parseFloat(price ?? existing.variants[0].discounted_price);
        existing.variants[0].stock = parseInt(stock ?? existing.variants[0].stock, 10);
        updateData.variants = existing.variants;
      }
    }

    const updated = await Product.findOneAndUpdate(filter, { $set: updateData }, { new: true });
    if (!updated) {
      return apiError('Product not found in database', 404);
    }

    return apiSuccess(updated, 'Product updated successfully');
  } catch (error: any) {
    console.error('PUT /api/products/[id] error:', error);
    return apiError(error?.message || 'Failed to update product', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;
    const numericId = parseInt(id, 10);

    const filter = isNaN(numericId) ? { _id: id } : { $or: [{ product_id: numericId }, { id: numericId }, { _id: id }] };
    const deleted = await Product.findOneAndDelete(filter);

    return apiSuccess({ id: deleted?.product_id || id }, 'Product deleted successfully');
  } catch (error: any) {
    console.error('DELETE /api/products/[id] error:', error);
    return apiError(error?.message || 'Failed to delete product', 500);
  }
}
