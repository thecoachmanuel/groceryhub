import { hashPassword } from '@/lib/auth';
import Admin from '@/models/Admin';
import User from '@/models/User';
import Seller from '@/models/Seller';
import DeliveryBoy from '@/models/DeliveryBoy';
import Product from '@/models/Product';
import Brand from '@/models/Brand';

let isSeeding = false;

/**
 * Seed initial real data if collections are empty
 */
export async function seedInitialDataIfNeeded() {
  if (isSeeding) return;
  isSeeding = true;

  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdminPass = await hashPassword(process.env.ADMIN_PASSWORD || 'AdminPassword2026!');
      await Admin.create({
        admin_id: 1,
        email: (process.env.ADMIN_EMAIL || 'admin@groceryhub.ng').toLowerCase(),
        name: 'Super Administrator',
        mobile: '+234 800 000 0001',
        password: defaultAdminPass,
        role: 'super_admin',
        permissions: [{ category: 'all', can_view: true, can_add: true, can_edit: true, can_delete: true }],
        is_active: true,
      });
      console.log('✅ Admin initialized in MongoDB');
    }

    // 2. Seed Demo Registered Customer
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const customerPass = await hashPassword('CustomerPassword2026!');
      await User.create({
        user_id: 101,
        name: 'Chinedu Okafor',
        email: 'customer@groceryhub.ng',
        mobile: '+234 802 345 6789',
        password: customerPass,
        wallet_balance: 15000.00, // ₦15,000
        referral_code: 'GROCERY-CHINEDU',
        status: 'active',
      });
      console.log('✅ Demo registered customer created in MongoDB');
    }

    // 3. Seed Demo Registered Seller
    const sellerCount = await Seller.countDocuments();
    if (sellerCount === 0) {
      const sellerPass = await hashPassword('VendorPassword2026!');
      await Seller.create({
        seller_id: 1,
        name: 'Green Valley Organic Farms',
        store_name: 'Green Valley Organic Farms',
        email: 'vendor@groceryhub.ng',
        mobile: '+234 800 123 4567',
        password: sellerPass,
        logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
        banner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
        address: 'Plot 18, Agro Industrial Estate, Epe, Lagos',
        city: 'Lagos',
        balance: 485000.00, // ₦485,000
        commission_rate: 5,
        status: 'approved',
      });
      console.log('✅ Demo registered seller created in MongoDB');
    }

    // 4. Seed Demo Registered Delivery Partner
    const riderCount = await DeliveryBoy.countDocuments();
    if (riderCount === 0) {
      const riderPass = await hashPassword('RiderPassword2026!');
      await DeliveryBoy.create({
        delivery_boy_id: 1,
        name: 'Marcus Vance',
        mobile: '+234 809 111 2233',
        email: 'rider@groceryhub.ng',
        password: riderPass,
        vehicle_type: 'Honda Super Cub 125cc (LAG-8492)',
        license_number: 'DL-NG-89104',
        city: 'Lagos',
        trip_bonus: 500.00, // ₦500 / trip
        balance: 28500.00, // ₦28,500
        cash_in_hand: 14200.00, // ₦14,200
        status: 'on_duty',
      });
      console.log('✅ Demo registered delivery partner created in MongoDB');
    }

    // 5. Seed Brand Partners
    const brandCount = await Brand.countDocuments();
    if (brandCount === 0) {
      await Brand.create([
        {
          brand_id: 1,
          name: 'Golden Penny Foodstuffs',
          slug: 'golden-penny',
          logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
          banner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
          website_url: 'https://goldenpenny.ng',
          support_email: 'sales@goldenpenny.ng',
          is_certified_partner: true,
          is_featured_on_home: true,
          status: 'Active',
          products_count: 24,
        },
        {
          brand_id: 2,
          name: 'Dangote Agro Sugar & Mills',
          slug: 'dangote-agro',
          logo: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200',
          website_url: 'https://dangote.com',
          support_email: 'contact@dangote.com',
          is_certified_partner: true,
          is_featured_on_home: true,
          status: 'Active',
          products_count: 18,
        },
        {
          brand_id: 3,
          name: 'Organic Valley Farms',
          slug: 'organic-valley',
          logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
          website_url: 'https://organicvalley.co',
          support_email: 'partners@organicvalley.co',
          is_certified_partner: true,
          is_featured_on_home: true,
          status: 'Active',
          products_count: 32,
        },
      ]);
      console.log('✅ Brand partners catalog seeded in MongoDB');
    }

    // 6. Seed Products in Naira
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.create([
        {
          product_id: 1,
          seller_id: 1,
          brand_id: 3,
          category_id: 1,
          name: 'Fresh Organic Farm Broccoli (Certified Non-GMO)',
          slug: 'fresh-organic-farm-broccoli',
          description: 'Hand-picked daily from certified organic local growers in Lagos.',
          image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800',
          variants: [
            { variant_id: 101, title: '500 g Pack', price: 4500, discounted_price: 3500, stock: 45, unit: '500g', barcode: '8901234567890' },
            { variant_id: 102, title: '1 kg Family Pack', price: 8500, discounted_price: 6500, stock: 30, unit: '1kg', barcode: '8901234567891' },
          ],
          rating: 4.9,
          rating_count: 145,
          status: 'active',
          is_approved: true,
          is_deal_of_the_day: true,
        },
        {
          product_id: 2,
          seller_id: 1,
          brand_id: 3,
          category_id: 1,
          name: 'Fresh Organic Hass Avocados (Pack of 4)',
          slug: 'fresh-organic-hass-avocados',
          description: 'Creamy rich Hass avocados ready to eat.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
          variants: [
            { variant_id: 201, title: 'Pack of 4', price: 4800, discounted_price: 3800, stock: 35, unit: '4 pcs', barcode: '8901234567892' },
          ],
          rating: 4.8,
          rating_count: 89,
          status: 'active',
          is_approved: true,
          is_deal_of_the_day: false,
        },
        {
          product_id: 3,
          seller_id: 1,
          brand_id: 1,
          category_id: 2,
          name: 'Artisanal Sourdough Country Loaf (750g)',
          slug: 'artisanal-sourdough-country-loaf',
          description: 'Slow-fermented artisan sourdough baked fresh every morning.',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
          variants: [
            { variant_id: 301, title: '750g Loaf', price: 3800, discounted_price: 3200, stock: 20, unit: '750g', barcode: '8901234567893' },
          ],
          rating: 4.9,
          rating_count: 64,
          status: 'active',
          is_approved: true,
          is_deal_of_the_day: true,
        },
        {
          product_id: 4,
          seller_id: 1,
          brand_id: 3,
          category_id: 3,
          name: 'Pasture-Raised Organic Grade A Eggs (Dozen)',
          slug: 'pasture-raised-organic-grade-a-eggs',
          description: 'Free-range farm fresh eggs rich in omega-3.',
          image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800',
          variants: [
            { variant_id: 401, title: '12 Count Carton', price: 5000, discounted_price: 4200, stock: 50, unit: '12 eggs', barcode: '8901234567894' },
          ],
          rating: 5.0,
          rating_count: 112,
          status: 'active',
          is_approved: true,
          is_deal_of_the_day: false,
        },
      ]);
      console.log('✅ Real grocery products seeded in MongoDB');
    }
  } catch (err) {
    console.error('Initial seeding error:', err);
  } finally {
    isSeeding = false;
  }
}
