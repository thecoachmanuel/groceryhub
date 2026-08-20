import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Banner from '@/models/Banner';
import Category from '@/models/Category';
import Highlight from '@/models/Highlight';
import Brand from '@/models/Brand';
import Seller from '@/models/Seller';
import HomeSection from '@/models/HomeSection';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    await connectToDatabase();

    // Parallel fetch of all home data
    const [banners, categories, highlights, brands, sellers, dealProducts, popularProducts, newProducts, homeSections] = await Promise.all([
      Banner.find({ status: 'Active' }).sort({ sort_order: 1 }).lean<any[]>().catch(() => []),
      Category.find({ status: 'Active', $or: [{ parent_id: 0 }, { parent_id: null }, { parent_id: { $exists: false } }] } as any).sort({ sort_order: 1 }).limit(12).lean<any[]>().catch(() => []),
      Highlight.find({ status: 'Active' }).sort({ createdAt: -1 }).lean<any[]>().catch(() => []),
      Brand.find({ status: 'Active' }).sort({ sort_order: 1 }).limit(8).lean<any[]>().catch(() => []),
      Seller.find({ status: 'approved' }).limit(6).lean<any[]>().catch(() => []),
      Product.find({ status: 'active', is_approved: true, is_deal_of_the_day: true }).sort({ createdAt: -1 }).limit(10).lean<any[]>().catch(() => []),
      Product.find({ status: 'active', is_approved: true }).sort({ rating: -1 }).limit(20).lean<any[]>().catch(() => []),
      Product.find({ status: 'active', is_approved: true }).sort({ createdAt: -1 }).limit(10).lean<any[]>().catch(() => []),
      HomeSection.find({ status: 'Active' }).sort({ sort_order: 1, createdAt: 1 }).lean<any[]>().catch(() => []),
    ]);

    const formatProduct = (p: any) => {
      const pid = p.product_id || String(p._id);
      const allImages = [p.image, ...(p.additional_images || [])].filter(Boolean);
      const rawVariants = p.variants && p.variants.length > 0 ? p.variants : [
        { variant_id: 101, title: 'Standard Pack', price: p.price || 3500, discounted_price: p.discounted_price || p.price || 3000, unit: p.unit || '500g', stock: 100, is_unlimited_stock: 1 }
      ];

      const formattedVariants = rawVariants.map((v: any, index: number) => ({
        id: v.variant_id || v.id || `${pid}_v${index}`,
        variant_id: v.variant_id || v.id || `${pid}_v${index}`,
        title: v.title || 'Standard Pack',
        price: v.price || 3500,
        discounted_price: v.discounted_price || v.price || 3000,
        unit: v.unit || 'pcs',
        stock: v.stock ?? 100,
        is_unlimited_stock: 1,
        cart_quantity: 0,
      }));

      return {
        id: pid, product_id: pid, _id: String(p._id),
        name: p.name, product_name: p.name,
        slug: p.slug || '',
        image: p.image || '',
        images: allImages,
        tags: p.tags || [],
        badges: p.badges || [],
        dietary_tags: p.dietary_tags || [],
        brand_id: p.brand_id || 0,
        brand_name: p.brand_name || '',
        rating: p.rating || 4.8,
        rating_count: p.rating_count || 12,
        price: formattedVariants[0].price,
        discounted_price: formattedVariants[0].discounted_price,
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
      image: b.image || b.banner_image || '',
      banner_image: b.image || b.banner_image || '',
      banner_type: b.banner_type || 'offer',
      link_type: b.banner_type || 'offer',
      content_id: b.content_id || 1,
      link_id: b.content_id || 1,
      redirect_url: b.redirect_url || '',
      title: b.title || '',
      placement: Number(b.placement ?? 0),
    });

    const formatCategory = (c: any) => ({
      id: c.category_id || String(c._id),
      category_id: c.category_id || String(c._id),
      name: c.name, category_name: c.name,
      slug: c.slug || '',
      image: c.icon || c.image || '',
      category_img: c.icon || c.image || '',
      is_featured: c.is_featured || false,
    });

    const formatHighlight = (h: any) => ({
      id: String(h._id),
      title: h.title, description: h.description,
      image: h.image || '', video: h.video || '',
      redirect_type: h.redirect_type || 'none',
      redirect_id: h.redirect_id || 1,
      seller_id: h.seller_id || 1,
    });

    const formatBrand = (b: any) => ({
      id: b.brand_id || String(b._id),
      brand_id: b.brand_id || String(b._id),
      brand: b.name, brand_name: b.name,
      logo: b.logo || '', image: b.logo || '',
      slug: b.slug || '',
    });

    const formatSeller = (s: any) => ({
      id: s.seller_id || String(s._id),
      seller_id: s.seller_id || String(s._id),
      name: s.name, store_name: s.store_name || s.name,
      logo: s.logo || '', banner: s.banner || '',
      rating: s.rating || 4.9, rating_count: s.rating_count || 10,
      address: s.address || '', city: s.city || 'Lagos',
    });

    const formattedCategories = categories.map(formatCategory);
    const formattedHighlights = highlights.map(formatHighlight);
    const formattedBrands = brands.map(formatBrand);
    const formattedSellers = sellers.map(formatSeller);
    const allFormattedBanners = banners.map(formatBanner);
    const dealItems = (dealProducts.length > 0 ? dealProducts : popularProducts.slice(0, 4)).map(formatProduct);
    const popularItems = popularProducts.map(formatProduct);
    const newItems = newProducts.map(formatProduct);

    // Build sections array — admin-managed sections first, then defaults
    const sections: any[] = [];
    let sectionIdCounter = 100;

    // Admin-managed home sections from DB
    if (homeSections.length > 0) {
      homeSections.forEach((hs: any) => {
        sections.push({
          id: String(hs._id),
          title: hs.title || hs.name,
          section_style: hs.type || 'product_list',
          items: [],
          no_of_content: hs.item_count || 10,
          no_of_row: 1,
          bg_color: hs.bg_color || '#FFFFFF',
          load_more: 0, view_all: hs.view_all || 0,
        });
      });
    }

    // Always include core default sections
    if (formattedCategories.length > 0) {
      sections.push({ id: 1, title: 'Explore Categories', section_style: 'category_list', items: formattedCategories, no_of_content: 12, no_of_row: 1, bg_color: '#FFFFFF', load_more: 0, view_all: 0 });
    }
    if (formattedHighlights.length > 0) {
      sections.push({ id: 2, title: 'Featured Highlights ✨', section_style: 'highlight', items: formattedHighlights, no_of_content: 6, no_of_row: 1, bg_color: '#FFFFFF', load_more: 0, view_all: 0 });
    }
    if (dealItems.length > 0) {
      sections.push({ id: 3, title: 'Deal of the Day 🔥', section_style: 'product_list', items: dealItems, no_of_content: 10, no_of_row: 1, bg_color: '#FFFFFF', load_more: 0, view_all: 1 });
    }
    if (formattedBrands.length > 0) {
      sections.push({ id: 4, title: 'Shop by Brand 🏷️', section_style: 'shop_by_brand', items: formattedBrands, no_of_content: 8, no_of_row: 1, bg_color: '#FFFFFF', load_more: 0, view_all: 0 });
    }
    if (popularItems.length > 0) {
      sections.push({ id: 5, title: 'Popular Products ⭐', section_style: 'product_list', items: popularItems, no_of_content: 10, no_of_row: 1, bg_color: '#FFFFFF', load_more: 0, view_all: 1 });
    }
    if (formattedSellers.length > 0) {
      sections.push({ id: 6, title: 'Verified Farm Sellers 🏪', section_style: 'shop_by_seller', items: formattedSellers, no_of_content: 6, no_of_row: 1, bg_color: '#FFFFFF', load_more: 0, view_all: 0 });
    }
    if (newItems.length > 0) {
      sections.push({ id: 7, title: 'New Arrivals 🌿', section_style: 'product_list', items: newItems, no_of_content: 10, no_of_row: 1, bg_color: '#FFFFFF', load_more: 0, view_all: 1 });
    }

    return NextResponse.json({
      status: 'success',
      result: 'true',
      message: 'Home data fetched successfully',
      banners: allFormattedBanners,
      categories: formattedCategories,
      highlights: formattedHighlights,
      brands: formattedBrands,
      sellers: formattedSellers,
      sections,
      data: {
        banners: allFormattedBanners,
        categories: formattedCategories,
        highlights: formattedHighlights,
        brands: formattedBrands,
        sellers: formattedSellers,
        sections,
      },
    });
  } catch (error: any) {
    console.error('fetchHomeData error:', error);
    return NextResponse.json({
      status: 'success', result: 'true', message: 'Home data fetched',
      banners: [], categories: [], sections: [],
      data: { banners: [], categories: [], sections: [] },
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
