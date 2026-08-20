import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Banner from '@/models/Banner';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cityId = body?.city_id || 1;
    const userId = body?.user_id || null;

    await connectToDatabase();

    // Fetch banners
    const banners = await Banner.find({ status: 'Active' })
      .sort({ sort_order: 1 })
      .limit(6)
      .lean();

    // Fetch categories
    const categories = await Category.find({ status: 'Active' })
      .sort({ sort_order: 1 })
      .limit(12)
      .lean()
      .catch(() => []);

    // Fetch deal-of-the-day products
    const dealProducts = await Product.find({
      status: 'active',
      is_approved: true,
      is_deal_of_the_day: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .catch(() => []);

    // Fetch popular / featured products (fallback if no deal products)
    const popularProducts = await Product.find({
      status: 'active',
      is_approved: true,
    })
      .sort({ rating: -1 })
      .limit(20)
      .lean()
      .catch(() => []);

    // Fetch new arrivals
    const newProducts = await Product.find({
      status: 'active',
      is_approved: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .catch(() => []);

    const formatProduct = (p: any) => ({
      id: p.product_id || String(p._id),
      _id: String(p._id),
      name: p.name,
      slug: p.slug,
      image: p.image || '',
      rating: p.rating || 0,
      rating_count: p.rating_count || 0,
      price: p.variants?.[0]?.price || 0,
      discounted_price: p.variants?.[0]?.discounted_price || 0,
      original_price: p.variants?.[0]?.price || 0,
      unit: p.variants?.[0]?.unit || 'pcs',
      category_id: p.category_id,
      seller_id: p.seller_id,
      is_deal_of_the_day: p.is_deal_of_the_day || false,
      stock: p.variants?.[0]?.stock || 0,
    });

    const formatBanner = (b: any) => ({
      id: String(b._id),
      image: b.image_url || b.image || '',
      redirect_type: b.link_type || 'none',
      redirect_id: b.link_id || null,
      title: b.title || '',
    });

    const formatCategory = (c: any) => ({
      id: c.category_id || String(c._id),
      name: c.name,
      slug: c.slug,
      image: c.icon || c.image || '',
    });

    const sections = [];

    if (dealProducts.length > 0) {
      sections.push({
        id: 1,
        title: 'Deal of the Day 🔥',
        style_type: 'deal_of_the_day',
        products: dealProducts.map(formatProduct),
      });
    }

    if (popularProducts.length > 0) {
      sections.push({
        id: 2,
        title: 'Popular Products',
        style_type: 'horizontal',
        products: popularProducts.map(formatProduct),
      });
    }

    if (newProducts.length > 0) {
      sections.push({
        id: 3,
        title: 'New Arrivals ✨',
        style_type: 'horizontal',
        products: newProducts.map(formatProduct),
      });
    }

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Home data fetched successfully',
      // top-level fields the app reads directly
      banners: banners.map(formatBanner),
      categories: categories.length > 0 ? categories.map(formatCategory) : [],
      sections,
      // also nested under data for compatibility
      data: {
        banners: banners.map(formatBanner),
        categories: categories.length > 0 ? categories.map(formatCategory) : [],
        sections,
      },
    });
  } catch (error: any) {
    console.error('fetchHomeData error:', error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
