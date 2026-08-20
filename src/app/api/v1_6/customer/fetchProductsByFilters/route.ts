import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

const formatProduct = (p: any) => {
  const pid = p.product_id || String(p._id);
  const allImages: string[] = [p.image, ...(p.additional_images || [])].filter(Boolean);

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
    tags: p.tags || [],
    badges: p.badges || [],
    dietary_tags: p.dietary_tags || [],
    brand_id: p.brand_id || 0,
    brand_name: p.brand_name || '',
    rating: p.rating || 4.8,
    rating_count: p.rating_count || 0,
    price: formattedVariants[0].price,
    discounted_price: formattedVariants[0].discounted_price,
    original_price: formattedVariants[0].price,
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
    const {
      category_id,
      categories = [],
      seller_id,
      sellers = [],
      brand_id,
      brands = [],
      search,
      keyword,
      sort_by,
      sort_order = 'desc',
      productSort = '1',
      tags = [],
      page = 1,
      limit = 10,
    } = body;

    await connectToDatabase();

    const query: any = { status: 'active', is_approved: true };

    // Brand filtering (supports single brand_id or array of brands)
    if (brands && Array.isArray(brands) && brands.length > 0) {
      const brandIds = brands.map(b => Number(b)).filter(b => !isNaN(b) && b > 0);
      if (brandIds.length > 0) query.brand_id = { $in: brandIds };
    } else if (brand_id && Number(brand_id) > 0) {
      query.brand_id = Number(brand_id);
    }

    // Category filtering
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const catIds = categories.map(c => Number(c)).filter(c => !isNaN(c) && c > 0);
      if (catIds.length > 0) query.category_id = { $in: catIds };
    } else if (category_id && Number(category_id) > 0) {
      query.category_id = Number(category_id);
    }

    // Seller filtering
    if (sellers && Array.isArray(sellers) && sellers.length > 0) {
      const sellerIds = sellers.map(s => Number(s)).filter(s => !isNaN(s) && s > 0);
      if (sellerIds.length > 0) query.seller_id = { $in: sellerIds };
    } else if (seller_id && Number(seller_id) > 0) {
      query.seller_id = Number(seller_id);
    }

    // Tag / Badge filtering
    if (tags && Array.isArray(tags) && tags.length > 0) {
      query.$or = [
        { tags: { $in: tags } },
        { badges: { $in: tags } },
        { dietary_tags: { $in: tags } }
      ];
    }

    // Search query
    const searchTerm = search || keyword;
    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: 'i' };
    }

    // Sorting logic
    let sortOptions: any = { createdAt: -1 };
    const sortVal = String(productSort || sort_by || '1');

    if (sortVal === '2' || sortVal === 'name_asc') sortOptions = { name: 1 };
    else if (sortVal === '3' || sortVal === 'name_desc') sortOptions = { name: -1 };
    else if (sortVal === '4' || sortVal === 'price_asc') sortOptions = { 'variants.0.price': 1 };
    else if (sortVal === '5' || sortVal === 'price_desc') sortOptions = { 'variants.0.price': -1 };
    else if (sortVal === '6' || sortVal === 'rating') sortOptions = { rating: -1 };
    else if (sort_by) sortOptions[sort_by] = sort_order === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit)).lean<any[]>(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Products fetched by filters',
      total,
      pagination: {
        current_page: Number(page),
        total_pages: totalPages,
        total_items: total,
        has_next_page: Number(page) < totalPages,
      },
      data: products.map(formatProduct),
    });
  } catch (error: any) {
    console.error('fetchProductsByFilters error:', error);
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Products fetched',
      total: 0,
      pagination: { current_page: 1, total_pages: 0, total_items: 0, has_next_page: false },
      data: [],
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
