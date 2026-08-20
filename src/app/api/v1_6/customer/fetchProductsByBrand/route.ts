import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Brand from '@/models/Brand';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { searchParams } = new URL(req.url);
    const brand_id = body.brand_id || searchParams.get('brand_id');
    const page = Number(body.page || searchParams.get('page') || 1);
    const limit = Number(body.limit || searchParams.get('limit') || 20);
    const guest_id = body.guest_id;
    const city_id = body.city_id;

    if (!brand_id) {
      return NextResponse.json({
        status: 'error', code: 400, result: 'false',
        message: 'brand_id is required',
      }, { status: 400 });
    }

    // Get brand info
    const brand = await Brand.findOne({
      $or: [{ brand_id: Number(brand_id) }, { _id: String(brand_id) }]
    }).lean<any>().catch(() => null);

    const query: any = {
      status: 'active',
      is_approved: true,
      brand_id: Number(brand_id),
    };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<any[]>(),
      Product.countDocuments(query),
    ]);

    const formattedProducts = products.map(p => {
      const pid = p.product_id || String(p._id);
      const allImages = [p.image, ...(p.additional_images || [])].filter(Boolean);
      return {
        id: pid,
        product_id: pid,
        _id: String(p._id),
        name: p.name,
        product_name: p.name,
        slug: p.slug || '',
        image: p.image || '',
        images: allImages,
        tags: p.tags || [],
        badges: p.badges || [],
        dietary_tags: p.dietary_tags || [],
        brand_id: p.brand_id || 0,
        brand_name: p.brand_name || brand?.name || '',
        rating: p.rating || 4.8,
        rating_count: p.rating_count || 0,
        price: p.variants?.[0]?.price || 0,
        discounted_price: p.variants?.[0]?.discounted_price || p.variants?.[0]?.price || 0,
        unit: p.variants?.[0]?.unit || 'pcs',
        category_id: p.category_id || 1,
        seller_id: p.seller_id || 1,
        stock: p.variants?.[0]?.stock || 100,
        is_deal_of_the_day: p.is_deal_of_the_day || false,
        variants: (p.variants || []).map((v: any, index: number) => ({
          id: v.variant_id || `v_${index}`,
          variant_id: v.variant_id || `v_${index}`,
          title: v.title || 'Standard Pack',
          price: v.price || 0,
          discounted_price: v.discounted_price || v.price || 0,
          unit: v.unit || 'pcs',
          stock: v.stock ?? 100,
          is_unlimited_stock: 1,
          cart_quantity: 0,
        })),
      };
    });

    return NextResponse.json({
      status: 'success',
      code: 200,
      result: 'true',
      message: `Products for brand fetched`,
      brand: brand ? { id: brand.brand_id || brand._id, name: brand.name, logo: brand.logo } : null,
      data: formattedProducts,
      pagination: {
        total_pages: Math.ceil(total / limit),
        current_page: page,
        total,
        has_next_page: page < Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('fetchProductsByBrand error:', error);
    return NextResponse.json({
      status: 'success', code: 200, result: 'true',
      message: 'Products fetched', data: [], pagination: { total_pages: 1, current_page: 1 },
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
