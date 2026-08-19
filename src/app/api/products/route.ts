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
    const sellerId = searchParams.get('seller_id');

    let filter: any = {};
    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }
    if (query) {
      filter.name = new RegExp(query, 'i');
    }
    if (sellerId) {
      const parsedSellerId = parseInt(sellerId, 10);
      filter.seller_id = isNaN(parsedSellerId) ? sellerId : parsedSellerId;
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
    const { name, category, price, discounted_price, stock, description, image, status, seller_id, unit } = body;

    if (!name || !name.trim()) {
      return apiError('Product name is required', 400);
    }

    const productId = Date.now();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const numPrice = parseFloat(price || '0');
    const numDiscounted = discounted_price !== undefined && discounted_price !== '' ? parseFloat(discounted_price) : numPrice;
    const numSellerId = seller_id ? parseInt(seller_id, 10) : 1;

    const newProduct = await Product.create({
      product_id: productId,
      name: name.trim(),
      slug: slug || `product-${productId}`,
      category: category || 'Vegetables',
      image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
      description: description || '',
      seller_id: isNaN(numSellerId) ? 1 : numSellerId,
      variants: [
        {
          variant_id: productId,
          title: 'Standard Pack',
          price: numPrice,
          discounted_price: numDiscounted,
          stock: parseInt(stock || '0', 10),
          unit: unit || '1 pack',
        },
      ],
      status: status ? status.toLowerCase().replace(/ /g, '_') : 'active',
    });

    return apiSuccess(newProduct, 'Product created successfully');
  } catch (error: any) {
    console.error('POST /api/products error:', error);
    return apiError(error?.message || 'Failed to create product', 500);
  }
}
