import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ProductRating from '@/models/ProductRating';
import Product from '@/models/Product';
import { getUserIdFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { product_id, rating, title, review, order_id, images } = body;

    const authHeader = req.headers.get('authorization');
    const userId = getUserIdFromHeader(authHeader);

    if (!userId) {
      return NextResponse.json(
        { status: 'error', code: 401, result: 'false', message: 'Please log in to submit a rating' },
        { status: 401 }
      );
    }

    if (!product_id || !rating) {
      return NextResponse.json(
        { status: 'error', code: 400, result: 'false', message: 'product_id and rating are required' },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { status: 'error', code: 400, result: 'false', message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Upsert: one rating per user per product
    const existingRating = await ProductRating.findOne({
      product_id: String(product_id),
      user_id: userId,
    });

    let savedRating: any;
    if (existingRating) {
      existingRating.rating = ratingNum;
      existingRating.title = title || existingRating.title;
      existingRating.review = review || existingRating.review;
      if (images && images.length) existingRating.images = images;
      savedRating = await existingRating.save();
    } else {
      savedRating = await ProductRating.create({
        product_id: String(product_id),
        user_id: userId,
        order_id: order_id || '',
        rating: ratingNum,
        title: title || '',
        review: review || '',
        images: images || [],
      });
    }

    // Recalculate and update product's average rating
    const allRatings = await ProductRating.find({ product_id: String(product_id) }).lean<any[]>();
    if (allRatings.length > 0) {
      const avg = allRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / allRatings.length;
      await Product.updateOne(
        { product_id: Number(product_id) },
        { rating: Math.round(avg * 10) / 10, rating_count: allRatings.length }
      ).catch(() => {
        // Try updating by _id if numeric id not found
        Product.findByIdAndUpdate(String(product_id), {
          rating: Math.round(avg * 10) / 10,
          rating_count: allRatings.length,
        }).catch(() => {});
      });
    }

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: existingRating ? 'Rating updated successfully' : 'Rating submitted successfully',
      data: {
        id: String(savedRating._id),
        product_id: String(product_id),
        user_id: userId,
        rating: ratingNum,
        title: savedRating.title || '',
        review: savedRating.review || '',
      },
    });
  } catch (error: any) {
    console.error('addProductRating error:', error);
    return NextResponse.json(
      { status: 'error', code: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
