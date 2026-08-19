import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import PosCartSession from '@/models/PosCartSession';
import PosSale from '@/models/PosSale';

export const dynamic = 'force-dynamic';

/**
 * POS Checkout — writes to PosSale collection (NOT Order).
 * POS sales are tracked separately and never appear in:
 * - Online financial analytics
 * - Seller withdrawable balance calculations
 * - Admin platform revenue totals
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      seller_id = 1,
      terminal_name = 'Counter 1',
      customer_name = 'Walk-in Customer',
      customer_mobile = '',
      cart_items = [],
      items = [],
      subtotal = 0,
      tax = 0,
      additional_charges = [],
      additional_discount = 0,
      payment_method = 'CASH',
      session_id,
    } = body;

    const finalCartItems = cart_items.length > 0 ? cart_items : items;
    const posOrderId = `POS${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const additionalChargesTotal = Array.isArray(additional_charges)
      ? additional_charges.reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0)
      : Number(additional_charges) || 0;

    const finalTotal = Math.max(0, subtotal + tax + additionalChargesTotal - additional_discount);

    // Create PosSale document (separate collection — never mixes with Order)
    const newSale = await PosSale.create({
      pos_order_id: posOrderId,
      seller_id: Number(seller_id) || 1,
      terminal_name: terminal_name || 'Counter 1',
      customer_name: customer_name || 'Walk-in Customer',
      customer_mobile: customer_mobile || '',
      items: finalCartItems.map((item: any) => ({
        product_id: String(item.product_id || item.id || item._id || ''),
        product_name: item.name || item.product_name || item.title || 'Product',
        variant_title: item.variant_title || 'Default',
        price: item.price || 0,
        discounted_price: item.discounted_price || item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || '',
        barcode: item.barcode || '',
      })),
      subtotal,
      tax_amount: tax,
      discount_amount: additional_discount,
      additional_charges: additionalChargesTotal,
      total: finalTotal,
      payment_method: (payment_method || 'cash').toLowerCase(),
      status: 'completed',
      notes: `POS sale — Terminal: ${terminal_name || 'Counter 1'}. Payment: ${payment_method}`,
    });

    // Deduct stock for purchased products
    for (const item of finalCartItems) {
      try {
        const prodId = item.product_id || item.id || item._id;
        if (prodId) {
          const prod = await Product.findById(prodId);
          if (prod && prod.variants && prod.variants.length > 0) {
            const currentStock = prod.variants[0].stock || 0;
            prod.variants[0].stock = Math.max(0, currentStock - item.quantity);
            await prod.save();
          }
        }
      } catch (err) {
        console.warn('POS stock update warning:', err);
      }
    }

    // Remove cart hold session if provided
    if (session_id) {
      await PosCartSession.deleteOne({ session_id }).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      message: 'POS sale recorded successfully',
      pos_order_id: posOrderId,
      sale: newSale,
    });
  } catch (error: any) {
    console.error('POS Checkout error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
