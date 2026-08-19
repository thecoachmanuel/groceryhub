import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Select name, category, variants (where stock lives), image, and product_id
    const products = await Product.find()
      .select('name category variants product_id seller_id image status')
      .sort({ name: 1 })
      .lean();

    // Compute total stock and price from variants array
    const data = products.map((p: any) => {
      const variants: any[] = Array.isArray(p.variants) ? p.variants : [];
      const totalStock = variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0);
      const firstVariant = variants[0] || {};
      return {
        _id: p._id,
        product_id: p.product_id,
        seller_id: p.seller_id,
        name: p.name || 'Unnamed Product',
        category: p.category || '—',
        image: p.image || '',
        status: p.status || 'active',
        // Unified stock surface (sum of all variants)
        stock: totalStock,
        current_stock: totalStock,
        price: firstVariant.price ?? 0,
        discounted_price: firstVariant.discounted_price ?? 0,
        unit: firstVariant.unit || '',
        variant_count: variants.length,
      };
    });

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('GET /api/admin/stock:', err);
    return NextResponse.json({ success: true, data: [], count: 0 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { productId, stock, current_stock } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'productId required' }, { status: 400 });
    }

    const newStock = stock ?? current_stock ?? 0;

    // Find the product first to know how many variants it has
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const variantCount = product.variants?.length || 0;

    if (variantCount === 0) {
      // Product has no variants — just set a direct stock field as fallback
      const updated = await Product.findByIdAndUpdate(
        productId,
        { $set: { 'variants.0.stock': newStock } },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updated });
    } else if (variantCount === 1) {
      // Single variant — set it directly
      const updated = await Product.findByIdAndUpdate(
        productId,
        { $set: { 'variants.0.stock': newStock } },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updated });
    } else {
      // Multiple variants — distribute stock evenly across all variants
      const perVariant = Math.floor(newStock / variantCount);
      const remainder = newStock % variantCount;

      const variantUpdates: any = {};
      product.variants.forEach((_: any, idx: number) => {
        variantUpdates[`variants.${idx}.stock`] = perVariant + (idx === 0 ? remainder : 0);
      });

      const updated = await Product.findByIdAndUpdate(
        productId,
        { $set: variantUpdates },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updated });
    }
  } catch (err: any) {
    console.error('PUT /api/admin/stock:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
