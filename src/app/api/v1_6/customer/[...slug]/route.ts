import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Banner from '@/models/Banner';
import Category from '@/models/Category';
import Brand from '@/models/Brand';
import Seller from '@/models/Seller';
import Order from '@/models/Order';
import Area from '@/models/Area';
import WalletTransaction from '@/models/WalletTransaction';
import SystemSettings from '@/models/SystemSettings';

export const dynamic = 'force-dynamic';

async function handleCustomerRequest(req: NextRequest, { params }: { params: { slug: string[] } }) {
  const endpoint = params.slug?.[0] || '';

  try {
    await connectToDatabase();
    const method = req.method;
    
    let body: any = {};
    if (method === 'POST' || method === 'PUT') {
      body = await req.json().catch(() => ({}));
    }

    const { searchParams } = new URL(req.url);
    const queryObj = Object.fromEntries(searchParams.entries());

    // 1. fetchCustomerSettings
    if (endpoint === 'fetchCustomerSettings' || endpoint === 'getSettings') {
      const settings = await SystemSettings.findOne().lean().catch(() => null);
      return NextResponse.json({
        status: 200,
        result: 'true',
        customerSettings: {
          app_name: settings?.appName || 'GroceryHub',
          currency_symbol: settings?.currencySymbol || '₦',
          currency: settings?.currencyCode || 'NGN',
          country_code: '+234',
          logo: settings?.storeLogoUrl || '',
          delivery_charge_standard: settings?.deliveryFee || 500,
          min_order_free_delivery: settings?.freeDeliveryThreshold || 15000,
          enable_wallet: true,
          support_phone: settings?.supportPhone || '+234 (800) 123-4567',
          support_email: settings?.supportEmail || 'support@groceryhub.ng',
        },
        countrySettings: {
          currency_symbol: settings?.currencySymbol || '₦',
          country_code: '+234',
          currency: settings?.currencyCode || 'NGN',
          country_name: 'Nigeria',
          currency_symbol_position: 'left',
          validation_no: 10,
        },
      });
    }

    // 2. Authentication: login, googleSignin, appleLogin, verifyMobileOtp, verifySignupOtp
    if (
      endpoint === 'login' ||
      endpoint === 'googleSignin' ||
      endpoint === 'appleLogin' ||
      endpoint === 'verifyMobileOtp' ||
      endpoint === 'verifySignupOtp'
    ) {
      const email = (body.email || body.mobile || 'customer@groceryhub.ng').toLowerCase();
      let user = await User.findOne({ $or: [{ email }, { mobile: body.mobile || '' }] }).lean().catch(() => null);

      if (!user) {
        // Fallback demo registered user or auto-register
        user = await User.create({
          user_id: Date.now(),
          name: body.name || body.fullName || 'Chinedu Okafor',
          email: body.email || 'customer@groceryhub.ng',
          mobile: body.mobile || '+234 802 345 6789',
          wallet_balance: 15000.0,
          referral_code: `GROCERY-${Date.now().toString().slice(-4)}`,
          status: 'active',
        });
      }

      return NextResponse.json({
        status: 'success',
        result: 'true',
        message: 'Login successful',
        token: 'groceryhub_demo_jwt_token_2026',
        user_id: user.user_id || 101,
        data: {
          user_id: user.user_id || 101,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          wallet_balance: user.wallet_balance || 15000.0,
          profile_pic: user.profile_pic || '',
        },
      });
    }

    // 3. updatePassword
    if (endpoint === 'updatePassword') {
      return NextResponse.json({
        status: 'success',
        result: 'true',
        message: 'Password updated successfully',
      });
    }

    // 4. Deliverable Areas
    if (
      endpoint === 'fetchDeliverableAreaByLatLong' ||
      endpoint === 'fetchDeliverableAreaByLatLongByDeliverableAreaId'
    ) {
      const areas = await Area.find({ status: 'Active' }).lean().catch(() => []);
      return NextResponse.json({
        status: 200,
        result: 'true',
        message: 'Deliverable area retrieved successfully',
        data: {
          area_id: 1,
          deliverable_area_id: 1,
          name: areas?.[0]?.name || 'Lagos Island & Lekki Phase 1',
          city: areas?.[0]?.city || 'Lagos',
          deliverable: true,
          areas: areas.length > 0 ? areas : [{ id: 1, name: 'Lagos Island', city: 'Lagos' }],
        },
      });
    }

    // 5. fetchSorting
    if (endpoint === 'fetchSorting') {
      return NextResponse.json({
        status: 200,
        result: 'true',
        data: [
          { id: 1, title: 'Relevance / Recommended' },
          { id: 2, title: 'Price: Low to High' },
          { id: 3, title: 'Price: High to Low' },
          { id: 4, title: 'Rating: High to Low' },
        ],
      });
    }

    // 6. fetchAllCategories
    if (endpoint === 'fetchAllCategories' || endpoint === 'getCategories') {
      const categories = await Category.find({ status: 'Active' }).sort({ sort_order: 1 }).lean().catch(() => []);
      return NextResponse.json({
        status: 200,
        result: 'true',
        data: categories.map((c: any) => ({
          id: c.category_id || String(c._id),
          category_id: c.category_id || String(c._id),
          name: c.name,
          slug: c.slug,
          image: c.icon || c.image || '',
        })),
      });
    }

    // 7. fetchAllBrand
    if (endpoint === 'fetchAllBrand' || endpoint === 'getBrands') {
      const brands = await Brand.find({ status: 'Active' }).lean().catch(() => []);
      return NextResponse.json({
        status: 200,
        result: 'true',
        data: brands.map((b) => ({
          id: b.brand_id || String(b._id),
          brand_id: b.brand_id || String(b._id),
          name: b.name,
          slug: b.slug,
          logo: b.logo || '',
        })),
      });
    }

    // 8. Products By Filters & Search
    if (
      endpoint === 'fetchProductsByFilters' ||
      endpoint === 'fetchSerachProducts' ||
      endpoint === 'fetchSearchProducts' ||
      endpoint === 'fetchSectionProducts'
    ) {
      const categoryId = body.category_id || queryObj.category_id;
      const brandId = body.brand_id || queryObj.brand_id;
      const searchText = body.search_text || queryObj.search_text || body.keyword;
      const sellerId = body.seller_id || queryObj.seller_id;

      const query: any = { status: 'active', is_approved: true };
      if (categoryId) query.category_id = Number(categoryId);
      if (brandId) query.brand_id = Number(brandId);
      if (sellerId) query.seller_id = Number(sellerId);
      if (searchText) {
        query.name = { $regex: searchText, $options: 'i' };
      }

      const products = await Product.find(query).limit(40).lean().catch(() => []);

      const formatProduct = (p: any) => ({
        id: p.product_id || String(p._id),
        product_id: p.product_id || String(p._id),
        name: p.name,
        slug: p.slug,
        image: p.image || '',
        rating: p.rating || 5.0,
        rating_count: p.rating_count || 12,
        price: p.variants?.[0]?.price || 0,
        discounted_price: p.variants?.[0]?.discounted_price || p.variants?.[0]?.price || 0,
        unit: p.variants?.[0]?.unit || 'pcs',
        category_id: p.category_id,
        seller_id: p.seller_id,
        variants: p.variants || [],
      });

      return NextResponse.json({
        status: 200,
        result: 'true',
        data: products.map(formatProduct),
      });
    }

    // 9. fetchProductVarientByProductId
    if (endpoint === 'fetchProductVarientByProductId') {
      const productId = Number(body.product_id || queryObj.product_id);
      const product = await Product.findOne({ product_id: productId }).lean().catch(() => null);

      return NextResponse.json({
        status: 200,
        result: 'true',
        data: product?.variants || [
          { variant_id: 101, title: 'Standard Pack', price: 3500, discounted_price: 3000, unit: '1 pack', stock: 50 }
        ],
      });
    }

    // 10. fetchSellerById
    if (endpoint === 'fetchSellerById') {
      const sellerId = Number(body.seller_id || queryObj.seller_id || 1);
      const seller = await Seller.findOne({ seller_id: sellerId }).lean().catch(() => null);

      return NextResponse.json({
        status: 200,
        result: 'true',
        data: seller || {
          seller_id: 1,
          name: 'Green Valley Organic Farms',
          store_name: 'Green Valley Organic Farms',
          logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
          rating: 4.9,
          address: 'Plot 18, Agro Industrial Estate, Epe, Lagos',
        },
      });
    }

    // 11. Cart Operations: isItemInCart, addToCart, removeFromCart
    if (endpoint === 'isItemInCart' || endpoint === 'addToCart' || endpoint === 'removeFromCart') {
      return NextResponse.json({
        status: 200,
        result: 'true',
        message: 'Cart updated successfully',
        cart_count: 3,
        in_cart: true,
        qty: body.qty || 1,
      });
    }

    // 12. Wallet History
    if (endpoint === 'fetchWalletHistory') {
      const userId = Number(body.user_id || 101);
      const user = await User.findOne({ user_id: userId }).lean().catch(() => null);
      const transactions = await WalletTransaction.find({ user_id: userId }).sort({ createdAt: -1 }).lean().catch(() => []);

      return NextResponse.json({
        status: 200,
        result: 'true',
        wallet_balance: user?.wallet_balance || 15000.0,
        data: transactions.length > 0 ? transactions : [
          {
            transaction_id: 'TXN-98124',
            amount: 5000,
            type: 'credit',
            description: 'Welcome Bonus Credit',
            createdAt: new Date().toISOString(),
          }
        ],
      });
    }

    // 13. Profile Details & Updates
    if (endpoint === 'fetchProfileDetails' || endpoint === 'fetchProfile') {
      const userId = Number(body.user_id || 101);
      const user = await User.findOne({ user_id: userId }).lean().catch(() => null);

      return NextResponse.json({
        status: 200,
        result: 'true',
        data: user || {
          user_id: 101,
          name: 'Chinedu Okafor',
          email: 'customer@groceryhub.ng',
          mobile: '+234 802 345 6789',
          wallet_balance: 15000.0,
          profile_pic: '',
        },
      });
    }

    if (endpoint === 'updateProfileDetails' || endpoint === 'updateProfile' || endpoint === 'uploadProfilePic') {
      const userId = Number(body.user_id || 101);
      if (body.name || body.email || body.mobile) {
        await User.updateOne({ user_id: userId }, { $set: body }).catch(() => null);
      }

      return NextResponse.json({
        status: 200,
        result: 'true',
        message: 'Profile updated successfully',
      });
    }

    // 14. Orders: fetchOrderList, placeCODOrder, trackingOrder
    if (endpoint === 'fetchOrderList') {
      const userId = Number(body.user_id || 101);
      const orders = await Order.find({ user_id: userId }).sort({ createdAt: -1 }).lean().catch(() => []);

      return NextResponse.json({
        status: 200,
        result: 'true',
        data: orders.length > 0 ? orders : [
          {
            order_id: 'ORD-89210',
            user_id: 101,
            total_amount: 14500,
            payment_status: 'Paid',
            status: 'Delivered',
            items_count: 3,
            createdAt: new Date().toISOString(),
          }
        ],
      });
    }

    if (endpoint === 'placeCODOrder' || endpoint === 'placeOrder') {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = await Order.create({
        order_id: orderId,
        user_id: Number(body.user_id || 101),
        seller_id: 1,
        items: body.items || [],
        subtotal: body.subtotal || 12000,
        delivery_charge: body.delivery_fee || 500,
        total_amount: body.total_amount || 12500,
        payment_method: 'cod',
        payment_status: 'pending',
        order_status: 'placed',
        delivery_address: {
          address_line: typeof body.address === 'string' ? body.address : 'Plot 14, Adeola Odeku St, VI, Lagos',
          city: 'Lagos',
          phone: '+234 802 345 6789',
        },
        delivery_timeslot: 'Express 30 Mins',
        delivery_pin: '4892',
      }).catch(() => null);

      return NextResponse.json({
        status: 200,
        result: 'true',
        message: 'Order placed successfully!',
        order_id: orderId,
        data: newOrder,
      });
    }

    if (endpoint === 'trackingOrder') {
      const orderId = body.order_id || queryObj.order_id || 'ORD-89210';
      const order: any = await Order.findOne({ order_id: orderId }).lean().catch(() => null);

      return NextResponse.json({
        status: 200,
        result: 'true',
        data: {
          order_id: orderId,
          status: order?.status || 'Out for Delivery',
          courier_name: 'Marcus Vance',
          courier_mobile: '+234 809 111 2233',
          estimated_delivery: '20 mins',
        },
      });
    }

    // Default Fallback Response
    return NextResponse.json({
      status: 200,
      result: 'true',
      message: `Processed request for ${endpoint}`,
      data: [],
    });
  } catch (error: any) {
    console.error(`Customer API error (${endpoint}):`, error);
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: { slug: string[] } }) {
  return handleCustomerRequest(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: { slug: string[] } }) {
  return handleCustomerRequest(req, ctx);
}

export async function PUT(req: NextRequest, ctx: { params: { slug: string[] } }) {
  return handleCustomerRequest(req, ctx);
}
