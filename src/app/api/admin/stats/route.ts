import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Seller from '@/models/Seller';
import DeliveryBoy from '@/models/DeliveryBoy';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Brand from '@/models/Brand';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const [usersCount, sellersCount, ridersCount, productsCount, ordersCount, brandsCount] = await Promise.all([
      User.countDocuments().catch(() => 0),
      Seller.countDocuments().catch(() => 0),
      DeliveryBoy.countDocuments().catch(() => 0),
      Product.countDocuments().catch(() => 0),
      Order.countDocuments().catch(() => 0),
      Brand.countDocuments().catch(() => 0),
    ]);

    // Aggregate Gross GMV (exclude cancelled)
    let totalGMV = 0;
    try {
      const gmvAggregation = await Order.aggregate([
        { $match: { order_status: { $ne: 'cancelled' }, active_status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$total_amount', '$total_payable'] } } } },
      ]);
      if (gmvAggregation && gmvAggregation.length > 0) {
        totalGMV = gmvAggregation[0].total || 0;
      }
    } catch (err) {
      console.warn('GMV aggregation warning:', err);
    }

    // Category breakdown
    let categoryCounts: Record<string, number> = {};
    try {
      const catAgg = await Product.aggregate([
        { $group: { _id: { $toLower: '$category' }, count: { $sum: 1 } } },
      ]);
      catAgg.forEach((c: any) => {
        if (c._id) categoryCounts[c._id] = c.count;
      });
    } catch (err) {
      console.warn('Category breakdown warning:', err);
    }

    // Order status breakdown
    let orderStatusBreakdown: Record<string, number> = {};
    try {
      const statusAgg = await Order.aggregate([
        { $group: { _id: { $ifNull: ['$order_status', '$active_status'] }, count: { $sum: 1 } } },
      ]);
      statusAgg.forEach((s: any) => {
        if (s._id) orderStatusBreakdown[s._id] = s.count;
      });
    } catch (err) {
      console.warn('Order status breakdown warning:', err);
    }

    // Recent Orders (5 most recent)
    let recentOrders: any[] = [];
    try {
      recentOrders = await Order.find()
        .sort({ createdAt: -1, created_at: -1, _id: -1 })
        .limit(5)
        .lean();
    } catch (err) {
      console.warn('Recent orders query warning:', err);
    }

    return NextResponse.json({
      success: true,
      data: {
        usersCount,
        sellersCount,
        ridersCount,
        productsCount,
        ordersCount,
        brandsCount,
        totalGMV,
        categoryCounts,
        orderStatusBreakdown,
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      {
        success: true,
        data: {
          usersCount: 0,
          sellersCount: 0,
          ridersCount: 0,
          productsCount: 0,
          ordersCount: 0,
          brandsCount: 0,
          totalGMV: 0,
          categoryCounts: {},
          orderStatusBreakdown: {},
          recentOrders: [],
        },
      },
      { status: 200 }
    );
  }
}
