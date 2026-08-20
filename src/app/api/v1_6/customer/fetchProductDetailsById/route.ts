import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductRating from '@/models/ProductRating';
import User from '@/models/User';
import mongoose from 'mongoose';
import { getUserIdFromHeader } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product_id } = body;

    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    const userId = getUserIdFromHeader(authHeader);

    let product: any = null;
    if (product_id) {
      const numId = Number(product_id);
      const isMongoId =
        typeof product_id === 'string' &&
        mongoose.Types.ObjectId.isValid(product_id) &&
        product_id.length === 24;

      if (isMongoId) {
        product = await Product.findById(product_id).lean();
      } else if (!isNaN(numId)) {
        product = await Product.findOne({ product_id: numId }).lean();
      }

      // Fallback: try as string product_id
      if (!product) {
        product = await Product.findById(String(product_id)).lean().catch(() => null);
      }
    }

    if (!product) {
      return NextResponse.json({
        status: 'error',
        code: 404,
        result: 'false',
        message: 'Product not found',
        data: null,
      });
    }

    // Build images array: main image + all additional_images
    const imagesArr: string[] = [
      product.image,
      ...(product.additional_images || []),
    ].filter(Boolean);

    // Format variants with all fields the app expects
    const pid = product.product_id || String(product._id);
    const variants = (product.variants && product.variants.length > 0
      ? product.variants
      : [
          {
            variant_id: 101,
            title: 'Standard Pack',
            price: product.price || 3500,
            discounted_price: product.discounted_price || product.price || 3000,
            unit: product.unit || '500g',
            stock: 100,
            is_unlimited_stock: 1,
            min_cart_quantity: 1,
          },
        ]
    ).map((v: any, index: number) => ({
      id: v.variant_id || v.id || `${pid}_v${index}`,
      variant_id: v.variant_id || v.id || `${pid}_v${index}`,
      title: v.title || v.size || 'Standard Pack',
      price: v.price || 3500,
      discounted_price: v.discounted_price || v.price || 3000,
      unit: v.unit || '500g',
      stock: v.stock ?? 100,
      is_unlimited_stock: v.is_unlimited_stock ?? 1,
      min_cart_quantity: v.min_cart_quantity || 1,
      cart_quantity: 0,
    }));

    // Fetch real reviews for this product
    const ratings = await ProductRating.find({ product_id: String(pid) })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean<any[]>()
      .catch(() => []);

    // Enrich reviews with user names
    const userIds = [...new Set(ratings.map((r: any) => r.user_id).filter(Boolean))];
    const users = await User.find({ user_id: { $in: userIds } })
      .select('user_id name profile_pic')
      .lean<any[]>()
      .catch(() => []);
    const userMap: Record<number, any> = {};
    users.forEach((u: any) => { userMap[u.user_id] = u; });

    const reviews = ratings.map((r: any) => ({
      id: String(r._id),
      user_id: r.user_id,
      user_name: userMap[r.user_id]?.name || 'Customer',
      user_img: userMap[r.user_id]?.profile_pic || '',
      rate: r.rating || 5,
      title: r.title || '',
      review: r.review || '',
      images: r.images || [],
      created_at: r.createdAt || new Date().toISOString(),
    }));

    // Check if current user already rated this product
    const userRating = userId
      ? await ProductRating.findOne({ product_id: String(pid), user_id: userId }).lean<any>()
      : null;

    const productDetails = {
      id: pid,
      product_id: pid,
      _id: String(product._id),
      name: product.name,
      product_name: product.name,
      slug: product.slug || '',
      product_image: product.image || '',
      image: product.image || '',
      main_img: product.image || '',
      // All images including additional ones
      images: imagesArr,
      additional_images: product.additional_images || [],
      description: product.description || '',
      rating: product.rating || 0,
      rating_count: product.rating_count || 0,
      category_id: product.category_id || 1,
      subcategory_id: product.subcategory_id || 0,
      seller_id: product.seller_id || 1,
      brand_id: product.brand_id || 0,
      is_deal_of_the_day: product.is_deal_of_the_day || false,
      variants,
      reviews,
      // Has the current user rated it?
      is_rated_by_user: !!userRating,
      user_rating: userRating?.rating || 0,
    };

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Product details fetched successfully',
      data: productDetails,
    });
  } catch (error: any) {
    console.error('fetchProductDetailsById error:', error);
    return NextResponse.json(
      { status: 'error', code: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
