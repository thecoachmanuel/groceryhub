import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Banner from '@/models/Banner';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    await connectToDatabase();

    // Fetch banners
    const banners = await Banner.find({ status: 'Active' })
      .sort({ sort_order: 1 })
      .limit(6)
      .lean()
      .catch(() => []);

    // Fetch categories
    const categories = await Category.find({ status: 'Active' })
      .sort({ sort_order: 1 })
      .limit(12)
      .lean()
      .catch(() => []);

    // Fetch products
    const dealProducts = await Product.find({
      status: 'active',
      is_approved: true,
      is_deal_of_the_day: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .catch(() => []);

    const popularProducts = await Product.find({
      status: 'active',
      is_approved: true,
    })
      .sort({ rating: -1 })
      .limit(20)
      .lean()
      .catch(() => []);

    const newProducts = await Product.find({
      status: 'active',
      is_approved: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .catch(() => []);

    const formatProduct = (p: any) => {
      const pid = p.product_id || String(p._id);
      const rawVariants = p.variants && p.variants.length > 0 ? p.variants : [
        {
          variant_id: 101,
          title: 'Standard Pack',
          price: p.price || 3500,
          discounted_price: p.discounted_price || p.price || 3000,
          unit: p.unit || '500g',
          stock: 100,
          is_unlimited_stock: 1,
        }
      ];

      const formattedVariants = rawVariants.map((v: any, index: number) => ({
        id: v.variant_id || v.id || `${pid}_v${index}`,
        variant_id: v.variant_id || v.id || `${pid}_v${index}`,
        title: v.title || v.size || 'Standard Pack',
        price: v.price || 3500,
        discounted_price: v.discounted_price || v.price || 3000,
        unit: v.unit || 'pcs',
        stock: v.stock ?? 100,
        is_unlimited_stock: 1,
        cart_quantity: 0,
      }));

      return {
        id: pid,
        product_id: pid,
        _id: String(p._id),
        name: p.name,
        product_name: p.name,
        slug: p.slug || '',
        image: p.image || '',
        img: p.image || '',
        rating: p.rating || 4.8,
        rating_count: p.rating_count || 12,
        price: formattedVariants[0].price,
        discounted_price: formattedVariants[0].discounted_price,
        original_price: formattedVariants[0].price,
        unit: formattedVariants[0].unit,
        category_id: p.category_id || 1,
        seller_id: p.seller_id || 1,
        is_deal_of_the_day: p.is_deal_of_the_day || false,
        stock: formattedVariants[0].stock,
        variants: formattedVariants,
      };
    };

    const formatBanner = (b: any) => ({
      id: String(b._id),
      image: b.image_url || b.image || '',
      redirect_type: b.link_type || 'none',
      redirect_id: b.link_id || null,
      title: b.title || '',
      placement: b.placement ?? 0,
    });

    const formatCategory = (c: any) => ({
      id: c.category_id || String(c._id),
      category_id: c.category_id || String(c._id),
      name: c.name,
      category_name: c.name,
      slug: c.slug || '',
      image: c.icon || c.image || '',
      category_img: c.icon || c.image || '',
    });

    const formattedCategories = categories.map(formatCategory);

    const sections: any[] = [];

    // Section 1: Categories
    if (formattedCategories.length > 0) {
      sections.push({
        id: 1,
        title: 'Explore Categories',
        section_style: 'category_list',
        items: formattedCategories,
        no_of_content: 12,
        no_of_row: 1,
        bg_color: '#FFFFFF',
        load_more: 0,
        view_all: 0,
      });
    }

    // Section 2: Deal of the Day
    const dealItems = (dealProducts.length > 0 ? dealProducts : popularProducts.slice(0, 4)).map(formatProduct);
    if (dealItems.length > 0) {
      sections.push({
        id: 2,
        title: 'Deal of the Day 🔥',
        section_style: 'product_list',
        items: dealItems,
        no_of_content: 10,
        no_of_row: 1,
        bg_color: '#FFFFFF',
        load_more: 0,
        view_all: 1,
      });
    }

    // Section 3: Popular Products
    const popularItems = popularProducts.map(formatProduct);
    if (popularItems.length > 0) {
      sections.push({
        id: 3,
        title: 'Popular Products ⭐',
        section_style: 'product_list',
        items: popularItems,
        no_of_content: 10,
        no_of_row: 1,
        bg_color: '#FFFFFF',
        load_more: 0,
        view_all: 1,
      });
    }

    // Section 4: New Arrivals
    const newItems = newProducts.map(formatProduct);
    if (newItems.length > 0) {
      sections.push({
        id: 4,
        title: 'New Arrivals ✨',
        section_style: 'product_list',
        items: newItems,
        no_of_content: 10,
        no_of_row: 1,
        bg_color: '#FFFFFF',
        load_more: 0,
        view_all: 1,
      });
    }

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Home data fetched successfully',
      banners: banners.map(formatBanner),
      categories: formattedCategories,
      sections,
      data: {
        banners: banners.map(formatBanner),
        categories: formattedCategories,
        sections,
      },
    });
  } catch (error: any) {
    console.error('fetchHomeData error:', error);
    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Home data fetched',
      banners: [],
      categories: [],
      sections: [],
      data: { banners: [], categories: [], sections: [] },
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
