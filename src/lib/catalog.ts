/**
 * GroceryHub — Shared Product Catalog (Nigerian Naira / NGN)
 * Single source of truth for all product data used across homepage,
 * category pages, search, and product detail pages.
 * All prices are in Naira (₦). Replace this with a DB fetch when seeding is done.
 */

export interface ProductVariant {
  id: number;
  title: string;
  price: number; // Regular price in Naira
  discounted_price: number; // Sale price in Naira (0 if no discount)
  stock: number;
  unit: string;
}

export interface CatalogProduct {
  id: number;
  name: string;
  slug: string;
  image: string;
  category: string; // must match category slug
  brand?: string;
  rating: number;
  rating_count: number;
  description?: string;
  variants: ProductVariant[];
  nutrition?: { label: string; value: string }[];
  tags?: string[];
}

export const PRODUCTS_CATALOG: CatalogProduct[] = [
  {
    id: 1,
    name: 'Fresh Organic Farm Broccoli (Certified Non-GMO)',
    slug: 'fresh-organic-broccoli',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500',
    category: 'vegetables',
    brand: 'Green Valley Organic Farms',
    rating: 4.9,
    rating_count: 145,
    description:
      'Hand-picked daily from certified organic local growers. Our farm-fresh broccoli is crisp, rich in vitamins C & K, dietary fiber, and powerful antioxidants. Ideal for steaming, roasting, stir-frying, or fresh salads.',
    nutrition: [
      { label: 'Calories', value: '34 kcal' },
      { label: 'Protein', value: '2.8 g' },
      { label: 'Dietary Fiber', value: '2.6 g' },
      { label: 'Vitamin C', value: '89 mg (148% DV)' },
    ],
    tags: ['organic', 'fresh', 'vegetables'],
    variants: [
      { id: 101, title: '500 g Pack', price: 4500, discounted_price: 3500, stock: 45, unit: '500 g' },
      { id: 102, title: '1 kg Family Pack', price: 8500, discounted_price: 6500, stock: 30, unit: '1 kg' },
      { id: 103, title: '2 kg Bulk Box', price: 16000, discounted_price: 12500, stock: 12, unit: '2 kg' },
    ],
  },
  {
    id: 2,
    name: 'Red Sweet Crisp Apples (Imported)',
    slug: 'red-sweet-apples',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
    category: 'fruits',
    brand: 'SunFresh Orchard Produce',
    rating: 4.8,
    rating_count: 98,
    description:
      'Sweet and crunchy red apples, imported and rigorously quality-checked. Great for lunchboxes, snacking, and baking. Naturally rich in dietary fiber and Vitamin C.',
    nutrition: [
      { label: 'Calories', value: '52 kcal' },
      { label: 'Carbohydrates', value: '14 g' },
      { label: 'Dietary Fiber', value: '2.4 g' },
      { label: 'Vitamin C', value: '4.6 mg' },
    ],
    tags: ['fruits', 'imported', 'sweet'],
    variants: [
      { id: 104, title: '1 kg Pack', price: 5500, discounted_price: 4500, stock: 50, unit: '1 kg' },
      { id: 105, title: '2 kg Family Pack', price: 10000, discounted_price: 8000, stock: 20, unit: '2 kg' },
    ],
  },
  {
    id: 3,
    name: 'Farm Fresh Pure Whole Milk',
    slug: 'farm-fresh-milk',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500',
    category: 'dairy',
    brand: 'Daily Dairy & Poultry Fresh',
    rating: 4.9,
    rating_count: 310,
    description:
      '100% pure, full-cream whole milk sourced from Nigerian-certified dairy farms. Pasteurized, fresh, and free from preservatives. Ideal for cereal, cooking, baking, and drinking.',
    nutrition: [
      { label: 'Calories', value: '61 kcal' },
      { label: 'Protein', value: '3.2 g' },
      { label: 'Fat', value: '3.3 g' },
      { label: 'Calcium', value: '113 mg' },
    ],
    tags: ['dairy', 'milk', 'fresh'],
    variants: [
      { id: 106, title: '1 Litre', price: 4200, discounted_price: 3800, stock: 100, unit: '1L' },
      { id: 107, title: '2 Litres Bundle', price: 8000, discounted_price: 7200, stock: 40, unit: '2L' },
    ],
  },
  {
    id: 4,
    name: 'Artisan Sourdough Bakery Bread',
    slug: 'artisan-sourdough-bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    category: 'bakery',
    brand: 'The Artisanal Bakery Co.',
    rating: 4.7,
    rating_count: 84,
    description:
      'Handcrafted sourdough loaf made fresh daily with slow-fermented natural yeast. No artificial preservatives. Rich in complex carbohydrates and probiotics from natural fermentation.',
    nutrition: [
      { label: 'Calories', value: '268 kcal per 100g' },
      { label: 'Protein', value: '8.8 g' },
      { label: 'Carbohydrates', value: '51 g' },
      { label: 'Fiber', value: '2.4 g' },
    ],
    tags: ['bakery', 'bread', 'artisan'],
    variants: [
      { id: 108, title: 'Standard Loaf (750g)', price: 3500, discounted_price: 3200, stock: 15, unit: '750g' },
    ],
  },
  {
    id: 5,
    name: 'Fresh Ripe Hass Avocados',
    slug: 'fresh-hass-avocados',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500',
    category: 'vegetables',
    brand: 'Green Valley Organic Farms',
    rating: 5.0,
    rating_count: 220,
    description:
      'Creamy Hass avocados at peak ripeness. Rich in heart-healthy monounsaturated fats, potassium, and vitamins B5, B6, C, E, and K. Great for toast, guacamole, and salads.',
    nutrition: [
      { label: 'Calories', value: '160 kcal per 100g' },
      { label: 'Healthy Fat', value: '14.7 g' },
      { label: 'Potassium', value: '485 mg' },
      { label: 'Fiber', value: '6.7 g' },
    ],
    tags: ['vegetables', 'avocado', 'organic'],
    variants: [
      { id: 109, title: 'Pack of 4', price: 4500, discounted_price: 3800, stock: 35, unit: '4 pcs' },
      { id: 110, title: 'Pack of 8', price: 8500, discounted_price: 7000, stock: 25, unit: '8 pcs' },
    ],
  },
  {
    id: 6,
    name: 'Organic Baby Spinach (Pre-washed)',
    slug: 'organic-baby-spinach',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
    category: 'vegetables',
    brand: 'Green Valley Organic Farms',
    rating: 4.8,
    rating_count: 115,
    description:
      'Pre-washed, ready-to-eat baby spinach leaves. Packed with iron, folate, magnesium, vitamins A, C, and K. Perfect for smoothies, salads, omelets, and stir-fries.',
    nutrition: [
      { label: 'Calories', value: '23 kcal' },
      { label: 'Iron', value: '2.7 mg' },
      { label: 'Vitamin K', value: '483 mcg' },
      { label: 'Folate', value: '194 mcg' },
    ],
    tags: ['vegetables', 'spinach', 'organic'],
    variants: [
      { id: 111, title: '250 g Tub', price: 3200, discounted_price: 2800, stock: 60, unit: '250 g' },
    ],
  },
  {
    id: 7,
    name: 'Fresh Juicy Strawberries (Local Farm)',
    slug: 'fresh-strawberries',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500',
    category: 'fruits',
    brand: 'SunFresh Orchard Produce',
    rating: 4.9,
    rating_count: 190,
    description:
      'Farm-fresh strawberries harvested at peak sweetness. Naturally rich in vitamin C, manganese, and antioxidants. Enjoy fresh, in smoothies, yogurt, or desserts.',
    nutrition: [
      { label: 'Calories', value: '32 kcal' },
      { label: 'Vitamin C', value: '58.8 mg (98% DV)' },
      { label: 'Manganese', value: '0.386 mg' },
      { label: 'Fiber', value: '2 g' },
    ],
    tags: ['fruits', 'strawberries', 'fresh'],
    variants: [
      { id: 112, title: '400 g Box', price: 5500, discounted_price: 4500, stock: 40, unit: '400 g' },
    ],
  },
  {
    id: 8,
    name: 'Pure Cold Pressed Extra Virgin Olive Oil',
    slug: 'extra-virgin-olive-oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
    category: 'pantry',
    brand: 'Nature Nectar',
    rating: 4.9,
    rating_count: 165,
    description:
      'Cold-pressed from hand-picked olives in the first pressing. Rich in oleic acid, polyphenols, and antioxidants. Ideal for salad dressings, dipping, sautéing, and low-heat cooking.',
    nutrition: [
      { label: 'Calories', value: '884 kcal per 100ml' },
      { label: 'Oleic Acid (Omega-9)', value: '73 g' },
      { label: 'Vitamin E', value: '14.4 mg' },
      { label: 'Saturated Fat', value: '14 g' },
    ],
    tags: ['pantry', 'oil', 'organic'],
    variants: [
      { id: 113, title: '500 ml Bottle', price: 12500, discounted_price: 11000, stock: 25, unit: '500 ml' },
      { id: 114, title: '1 Litre Premium Tin', price: 24000, discounted_price: 21000, stock: 10, unit: '1L' },
    ],
  },
  {
    id: 9,
    name: 'Pasture-Raised Organic Eggs',
    slug: 'pasture-raised-eggs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500',
    category: 'dairy',
    brand: 'Daily Dairy & Poultry Fresh',
    rating: 4.8,
    rating_count: 203,
    description:
      'Farm-fresh eggs from free-range, pasture-raised hens. Rich in high-quality protein, B vitamins, and omega-3 fatty acids. No antibiotics or growth hormones used.',
    nutrition: [
      { label: 'Calories', value: '155 kcal per 100g' },
      { label: 'Protein', value: '12.6 g' },
      { label: 'Omega-3 Fat', value: '0.6 g' },
      { label: 'Vitamin D', value: '2.0 mcg' },
    ],
    tags: ['dairy', 'eggs', 'organic'],
    variants: [
      { id: 115, title: 'Tray of 12 (Medium)', price: 3600, discounted_price: 3200, stock: 80, unit: '12 eggs' },
      { id: 116, title: 'Crate of 30 (Large)', price: 8500, discounted_price: 7500, stock: 50, unit: '30 eggs' },
    ],
  },
  {
    id: 10,
    name: 'Raw Wildflower Honey (Unfiltered)',
    slug: 'raw-wildflower-honey',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
    category: 'pantry',
    brand: 'Nature Nectar',
    rating: 4.7,
    rating_count: 88,
    description:
      '100% raw, unfiltered wildflower honey from Nigerian apiaries. Loaded with natural enzymes, antioxidants, and trace minerals. No added sugar, no preservatives.',
    nutrition: [
      { label: 'Calories', value: '304 kcal per 100g' },
      { label: 'Natural Sugars', value: '82 g' },
      { label: 'Antioxidants', value: 'High (Polyphenols)' },
      { label: 'Glycemic Index', value: '58 (Moderate)' },
    ],
    tags: ['pantry', 'honey', 'natural'],
    variants: [
      { id: 117, title: '250 g Jar', price: 5500, discounted_price: 4800, stock: 35, unit: '250 g' },
      { id: 118, title: '500 g Jar', price: 10000, discounted_price: 8500, stock: 20, unit: '500 g' },
    ],
  },
  {
    id: 11,
    name: 'Indomie Instant Noodles (Chicken Flavour)',
    slug: 'indomie-chicken-noodles',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500',
    category: 'pantry',
    brand: 'Dufil Prima Foods',
    rating: 4.6,
    rating_count: 512,
    description:
      'Nigeria\'s favourite quick meal. Indomie Chicken flavour — ready in 2 minutes. Each pack comes with seasoning and seasoning oil sachets for authentic flavour.',
    nutrition: [
      { label: 'Calories', value: '380 kcal per pack' },
      { label: 'Carbohydrates', value: '64 g' },
      { label: 'Protein', value: '8 g' },
      { label: 'Sodium', value: '1,200 mg' },
    ],
    tags: ['pantry', 'noodles', 'instant'],
    variants: [
      { id: 119, title: 'Single Pack (70g)', price: 350, discounted_price: 300, stock: 500, unit: '70g' },
      { id: 120, title: 'Carton of 40 Packs', price: 14000, discounted_price: 12000, stock: 80, unit: '40 packs' },
    ],
  },
  {
    id: 12,
    name: 'Dangote Bag Flour (Golden Penny)',
    slug: 'golden-penny-flour',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500',
    category: 'pantry',
    brand: 'Dangote Flour Mills',
    rating: 4.5,
    rating_count: 341,
    description:
      'Premium wheat flour milled from high-quality grains. Perfect for baking bread, pastries, chin-chin, meat pies, and other Nigerian recipes.',
    nutrition: [
      { label: 'Calories', value: '364 kcal per 100g' },
      { label: 'Protein', value: '10.3 g' },
      { label: 'Carbohydrates', value: '76.3 g' },
      { label: 'Iron', value: '4.6 mg' },
    ],
    tags: ['pantry', 'flour', 'baking'],
    variants: [
      { id: 121, title: '1 kg Pack', price: 1800, discounted_price: 1500, stock: 200, unit: '1 kg' },
      { id: 122, title: '5 kg Bag', price: 8500, discounted_price: 7000, stock: 80, unit: '5 kg' },
    ],
  },
];

/**
 * Get product by numeric id
 */
export function getProductById(id: number): CatalogProduct | undefined {
  return PRODUCTS_CATALOG.find((p) => p.id === id);
}

/**
 * Get products by category slug
 */
export function getProductsByCategory(slug: string): CatalogProduct[] {
  return PRODUCTS_CATALOG.filter((p) => p.category === slug.toLowerCase());
}

/**
 * Search products by query string (name, tags, brand)
 */
export function searchProducts(query: string): CatalogProduct[] {
  const q = query.toLowerCase();
  return PRODUCTS_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.includes(q))
  );
}
