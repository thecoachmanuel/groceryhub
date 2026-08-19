import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;
    const numericId = parseInt(id, 10);

    const filter = isNaN(numericId)
      ? { $or: [{ _id: id }, { slug: id }] }
      : { $or: [{ product_id: numericId }, { id: numericId }, { _id: id }, { slug: id }] };

    const product = await Product.findOne(filter).lean();
    if (!product) {
      return apiError('Product not found', 404);
    }

    return apiSuccess(product, 'Product retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/products/[id] error:', error);
    return apiError(error?.message || 'Failed to fetch product', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;
    const body = await req.json().catch(() => ({}));
    const { name, category, price, discounted_price, stock, description, image, status, unit, is_deal_of_the_day } = body;

    const numericId = parseInt(id, 10);
    const filter = isNaN(numericId) ? { _id: id } : { $or: [{ product_id: numericId }, { id: numericId }, { _id: id }] };

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (category) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (image) updateData.image = image;
    if (status) updateData.status = status.toLowerCase().replace(/ /g, '_');
    if (is_deal_of_the_day !== undefined) updateData.is_deal_of_the_day = is_deal_of_the_day;

    // Update variant-level fields (price, discounted_price, stock, unit)
    if (price !== undefined || discounted_price !== undefined || stock !== undefined || unit !== undefined) {
      const existing = await Product.findOne(filter);
      if (existing && existing.variants && existing.variants.length > 0) {
        const v = existing.variants[0];
        if (price !== undefined)            v.price = parseFloat(price);
        if (discounted_price !== undefined) v.discounted_price = parseFloat(discounted_price);
        else if (price !== undefined)       v.discounted_price = parseFloat(price); // default discounted = price if not provided
        if (stock !== undefined)            v.stock = parseInt(stock, 10);
        if (unit !== undefined)             v.unit = unit;
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
