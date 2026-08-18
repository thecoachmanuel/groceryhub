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

    // Aggregate Gross GMV
    let totalGMV = 0;
    try {
      const gmvAggregation = await Order.aggregate([
        { $match: { active_status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total_payable' } } },
      ]);
      if (gmvAggregation && gmvAggregation.length > 0) {
        totalGMV = gmvAggregation[0].total || 0;
      }
    } catch (err) {
      console.warn('GMV aggregation warning:', err);
    }

    // Recent Orders
    let recentOrders: any[] = [];
    try {
      recentOrders = await Order.find()
        .sort({ created_at: -1, _id: -1 })
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
          recentOrders: [],
        },
      },
      { status: 200 }
    );
  }
}
