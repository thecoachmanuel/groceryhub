import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    let filter: any = {};
    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }
    if (query) {
      filter.name = new RegExp(query, 'i');
    }

    const products = await Product.find(filter).sort({ createdAt: -1, _id: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { name, category, price, stock, description, image, status } = body;

    if (!name || !name.trim()) {
      return apiError('Product name is required', 400);
    }

    const productId = Date.now();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = await Product.create({
      product_id: productId,
      name: name.trim(),
      slug: slug || `product-${productId}`,
      category: category || 'Vegetables',
      image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
      description: description || '',
      seller_id: 1,
      variants: [
        {
          variant_id: productId,
          title: 'Standard Pack',
          price: parseFloat(price || '0'),
          discounted_price: parseFloat(price || '0'),
          stock: parseInt(stock || '0', 10),
          unit: '1 pack',
        },
      ],
      status: status || 'Active',
    });

    return apiSuccess(newProduct, 'Product created successfully');
  } catch (error: any) {
    console.error('POST /api/products error:', error);
    return apiError(error?.message || 'Failed to create product', 500);
  }
}
