const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

const uri = 'mongodb+srv://groceryhub:ooydl4ZOrDUakClM@cluster0.8r3acxq.mongodb.net/groceryhub?appName=Cluster0';

async function seed() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.log('Connected to MongoDB Atlas...');

  // 1. Banners
  const banners = [
    {
      title: 'Fresh Organic Produce - 30% OFF',
      placement: 0, // Header carousel
      banner_type: 'offer',
      content_id: 1,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      redirect_url: '',
      status: 'Active',
      sort_order: 1,
    },
    {
      title: 'Artisanal Bakery & Farm Dairy',
      placement: 0, // Header carousel
      banner_type: 'category',
      content_id: 2,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      redirect_url: '',
      status: 'Active',
      sort_order: 2,
    },
    {
      title: 'Express 30 Mins Delivery in Lagos',
      placement: 0, // Header carousel
      banner_type: 'offer',
      content_id: 3,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1200&q=80',
      redirect_url: '',
      status: 'Active',
      sort_order: 3,
    },
    {
      title: 'Special Weekend Grocery Sale',
      placement: 1, // Deal of the day ad
      banner_type: 'offer',
      content_id: 1,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
      redirect_url: '',
      status: 'Active',
      sort_order: 1,
    },
    {
      title: 'Middle Promotion - Farm Direct',
      placement: 2, // Home middle ad
      banner_type: 'category',
      content_id: 1,
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=1200&q=80',
      redirect_url: '',
      status: 'Active',
      sort_order: 1,
    },
    {
      title: 'Footer Promo Banner',
      placement: 3, // Footer ad
      banner_type: 'url',
      content_id: 0,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=1200&q=80',
      redirect_url: 'https://groceryhub-ng.vercel.app',
      status: 'Active',
      sort_order: 1,
    },
  ];

  await db.collection('banners').deleteMany({});
  await db.collection('banners').insertMany(banners);
  console.log('Seeded banners successfully');

  // 2. Highlights
  const highlights = [
    {
      id: 1,
      title: 'Farm Fresh Harvest',
      description: 'Handpicked daily directly from verified organic farms in Lagos & Ogun state.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      video: '',
      redirect_type: 'category',
      redirect_id: 1,
      seller_id: 1,
      is_active: 1,
      status: 'Active',
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Guaranteed 30-Min Delivery',
      description: 'Our temperature-controlled cold chain fleet ensures maximum freshness.',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800',
      video: '',
      redirect_type: 'seller',
      redirect_id: 1,
      seller_id: 1,
      is_active: 1,
      status: 'Active',
      createdAt: new Date(),
    },
    {
      id: 3,
      title: 'Artisanal Bakery Craft',
      description: 'Pure sourdough and whole-grain breads baked fresh every morning.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
      video: '',
      redirect_type: 'category',
      redirect_id: 2,
      seller_id: 1,
      is_active: 1,
      status: 'Active',
      createdAt: new Date(),
    },
  ];

  await db.collection('highlights').deleteMany({});
  await db.collection('highlights').insertMany(highlights);
  console.log('Seeded highlights successfully');

  // 3. Brands
  const brands = [
    {
      brand_id: 1,
      name: 'Dangote Sugar & Foods',
      slug: 'dangote',
      logo: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=200',
      status: 'Active',
      sort_order: 1,
    },
    {
      brand_id: 2,
      name: 'Nestlé Foods Nigeria',
      slug: 'nestle',
      logo: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200',
      status: 'Active',
      sort_order: 2,
    },
    {
      brand_id: 3,
      name: 'Golden Penny Mills',
      slug: 'golden-penny',
      logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200',
      status: 'Active',
      sort_order: 3,
    },
    {
      brand_id: 4,
      name: 'Unilever Nigeria',
      slug: 'unilever',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
      status: 'Active',
      sort_order: 4,
    },
  ];

  await db.collection('brands').deleteMany({});
  await db.collection('brands').insertMany(brands);
  console.log('Seeded brands successfully');

  // 4. Sellers
  const sellers = [
    {
      seller_id: 1,
      name: 'Green Valley Organic Farms',
      store_name: 'Green Valley Organic Farms',
      email: 'seller1@groceryhub.ng',
      mobile: '+2348011112222',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
      banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      rating: 4.9,
      rating_count: 142,
      address: 'Plot 18, Agro Industrial Estate, Epe, Lagos',
      city: 'Lagos',
      status: 'active',
      is_open: true,
    },
    {
      seller_id: 2,
      name: 'Lekki Fresh Supermarket',
      store_name: 'Lekki Fresh Supermarket',
      email: 'seller2@groceryhub.ng',
      mobile: '+2348033334444',
      logo: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200',
      banner: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      rating: 4.8,
      rating_count: 89,
      address: 'Admiralty Way, Lekki Phase 1, Lagos',
      city: 'Lagos',
      status: 'active',
      is_open: true,
    },
  ];

  await db.collection('sellers').deleteMany({});
  await db.collection('sellers').insertMany(sellers);
  console.log('Seeded sellers successfully');

  await mongoose.disconnect();
  console.log('Seeding finished cleanly!');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
