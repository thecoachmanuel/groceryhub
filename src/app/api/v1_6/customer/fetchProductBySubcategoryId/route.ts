import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

// Helper to format a product for the app
const formatProduct = (p: any) => {
  const pid = p.product_id || String(p._id);
  const allImages: string[] = [
    p.image,
    ...(p.additional_images || []),
  ].filter(Boolean);

  const rawVariants = p.variants && p.variants.length > 0 ? p.variants : [
    {
      variant_id: 101,
      title: 'Standard Pack',
      price: p.price || 3500,
      discounted_price: p.discounted_price || p.price || 3000,
      unit: p.unit || '500g',
      stock: 100,
      is_unlimited_stock: 1,
      min_cart_quantity: 1,
    }
  ];

  const formattedVariants = rawVariants.map((v: any, index: number) => ({
    id: v.variant_id || v.id || `${pid}_v${index}`,
    variant_id: v.variant_id || v.id || `${pid}_v${index}`,
    title: v.title || v.size || 'Standard Pack',
    price: v.price || 3500,
    discounted_price: v.discounted_price || v.price || 3000,
    unit: v.unit || 'pcs',
    stock: v.stock ?? 100,
    is_unlimited_stock: v.is_unlimited_stock ?? 1,
    min_cart_quantity: v.min_cart_quantity || 1,
    cart_quantity: 0,
  }));

  return {
    id: pid,
    product_id: pid,
    _id: String(p._id),
    name: p.name,
    product_name: p.name,
    slug: p.slug || '',
    image: p.image || '',
    images: allImages,
    additional_images: p.additional_images || [],
    rating: p.rating || 4.8,
    rating_count: p.rating_count || 0,
    price: formattedVariants[0].price,
    discounted_price: formattedVariants[0].discounted_price,
    unit: formattedVariants[0].unit,
    category_id: p.category_id || 1,
    seller_id: p.seller_id || 1,
    stock: formattedVariants[0].stock,
    is_deal_of_the_day: p.is_deal_of_the_day || false,
    variants: formattedVariants,
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { category_id, subcategory_id, page = 1, limit = 10, productSort = '1', brands = [], sellers = [] } = body;

    await connectToDatabase();

    const query: any = { status: 'active', is_approved: true };

    // Handle category_id — could be MongoDB ObjectId string or a numeric id
    if (category_id) {
      const numCatId = Number(category_id);

      if (!isNaN(numCatId) && numCatId > 0) {
        // Direct numeric category_id on product
        query.category_id = numCatId;
      } else if (typeof category_id === 'string' && category_id.length === 24) {
        // It's a MongoDB ObjectId string — look up category's numeric id
        const cat = await Category.findById(category_id).lean<any>().catch(() => null);
        if (cat?.category_id) query.category_id = cat.category_id;
        else query.category_id = 0; // Force empty result if not found
      }
    }

    // Handle subcategory_id filter
    if (subcategory_id) {
      const numSubId = Number(subcategory_id);
      if (!isNaN(numSubId) && numSubId > 0) {
        query.subcategory_id = numSubId;
      }
    }

    // Brand filter
    if (brands && brands.length > 0) {
      query.brand_id = { $in: brands.map(Number) };
    }

    // Seller filter
    if (sellers && sellers.length > 0) {
      query.seller_id = { $in: sellers.map(Number) };
    }

    // Sort
    let sortQuery: any = { createdAt: -1 };
    if (productSort === '2') sortQuery = { name: 1 };
    else if (productSort === '3') sortQuery = { name: -1 };
    else if (productSort === '4') sortQuery = { 'variants.0.price': 1 };
    else if (productSort === '5') sortQuery = { 'variants.0.price': -1 };
    else if (productSort === '6') sortQuery = { rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortQuery).skip(skip).limit(Number(limit)).lean<any[]>(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Products fetched',
      pagination: {
        current_page: Number(page),
        total_pages: totalPages,
        total_items: total,
        has_next_page: Number(page) < totalPages,
      },
      data: products.map(formatProduct),
    });
  } catch (error: any) {
    console.error('fetchProductBySubcategoryId error:', error);
    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: 'Products fetched',
      pagination: { current_page: 1, total_pages: 0, total_items: 0, has_next_page: false },
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
