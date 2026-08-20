import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Brand from '@/models/Brand';

export const dynamic = 'force-dynamic';

// GET all products (with optional filters)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const search = searchParams.get('search') || '';
    const category_id = searchParams.get('category_id');
    const brand_id = searchParams.get('brand_id');
    const seller_id = searchParams.get('seller_id');
    const status = searchParams.get('status');
    const is_deal = searchParams.get('is_deal');
    const tags = searchParams.get('tags');

    const query: any = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category_id) query.category_id = Number(category_id);
    if (brand_id) query.brand_id = Number(brand_id);
    if (seller_id) query.seller_id = Number(seller_id);
    if (status) query.status = status;
    if (is_deal === 'true') query.is_deal_of_the_day = true;
    if (tags) query.tags = { $in: tags.split(',') };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST create product
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    const {
      name, description, image, additional_images = [],
      category_id, subcategory_id, brand_id, seller_id,
      variants, status = 'active', is_approved = true,
      is_deal_of_the_day = false, is_featured = false,
      tags = [], badges = [], dietary_tags = [],
    } = body;

    if (!name || !image) {
      return NextResponse.json({ success: false, message: 'name and image are required' }, { status: 400 });
    }

    // Resolve brand name from brand_id
    let brand_name = '';
    if (brand_id && Number(brand_id) > 0) {
      const brand = await Brand.findOne({ brand_id: Number(brand_id) }).lean<any>();
      brand_name = brand?.name || '';
    }

    // Generate numeric product_id
    const lastProduct = await Product.findOne({}).sort({ product_id: -1 }).select('product_id').lean<any>();
    const newProductId = (lastProduct?.product_id || 1000) + 1;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + newProductId;

    const product = await Product.create({
      product_id: newProductId,
      seller_id: Number(seller_id || 1),
      brand_id: Number(brand_id || 0),
      brand_name,
      category_id: Number(category_id || 1),
      subcategory_id: Number(subcategory_id || 0),
      name,
      slug,
      description: description || '',
      image,
      additional_images: Array.isArray(additional_images) ? additional_images : [],
      tags: Array.isArray(tags) ? tags : [],
      badges: Array.isArray(badges) ? badges : [],
      dietary_tags: Array.isArray(dietary_tags) ? dietary_tags : [],
      variants: variants || [{ variant_id: 1, title: 'Standard', price: 1000, discounted_price: 0, unit: 'pcs', stock: 100, is_unlimited_stock: 1, min_cart_quantity: 1 }],
      status,
      is_approved,
      is_deal_of_the_day,
      is_featured,
    });

    return NextResponse.json({ success: true, message: 'Product created', data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// PUT update product
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { id, _id, product_id, ...updateData } = body;

    let filter: any = {};
    if (_id || id) filter._id = _id || id;
    else if (product_id !== undefined) filter.product_id = Number(product_id);
    else return NextResponse.json({ success: false, message: 'id or product_id required' }, { status: 400 });

    // Ensure arrays are properly handled
    if (updateData.additional_images !== undefined) {
      updateData.additional_images = Array.isArray(updateData.additional_images) ? updateData.additional_images : [];
    }
    if (updateData.tags !== undefined) {
      updateData.tags = Array.isArray(updateData.tags) ? updateData.tags : [];
    }
    if (updateData.badges !== undefined) {
      updateData.badges = Array.isArray(updateData.badges) ? updateData.badges : [];
    }
    if (updateData.dietary_tags !== undefined) {
      updateData.dietary_tags = Array.isArray(updateData.dietary_tags) ? updateData.dietary_tags : [];
    }

    // Resolve brand name if brand_id changed
    if (updateData.brand_id !== undefined && Number(updateData.brand_id) > 0) {
      const brand = await Brand.findOne({ brand_id: Number(updateData.brand_id) }).lean<any>();
      updateData.brand_name = brand?.name || '';
    }

    // Auto-regenerate slug if name changed
    if (updateData.name) {
      const existing = await Product.findOne(filter).lean<any>();
      if (existing) {
        updateData.slug = updateData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') + '-' + (existing.product_id || Date.now());
      }
    }

    const updated = await Product.findOneAndUpdate(filter, { $set: updateData }, { new: true });
    if (!updated) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Product updated', data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || searchParams.get('_id');
    const product_id = searchParams.get('product_id');

    let filter: any = {};
    if (id) filter._id = id;
    else if (product_id) filter.product_id = Number(product_id);
    else return NextResponse.json({ success: false, message: 'id or product_id required' }, { status: 400 });

    await Product.findOneAndDelete(filter);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
