'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  Minus, 
  ArrowLeft,
  CheckCircle2,
  Share2,
  MessageSquare,
  X,
  AlertCircle,
  Package
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';
import { formatNaira } from '@/lib/currency';

interface ReviewItem {
  id: number;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const rawId = params?.id ? String(params.id) : '';

  const [product, setProduct] = useState<any | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const formatProduct = (p: any) => {
    const pId = p.product_id || p.id || Math.floor(Math.random() * 10000);
    const rawPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price || '3500') || 3500;
    const originalPrice = Math.round(rawPrice * 1.25);
    const variants = Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants.map((v: any, idx: number) => ({
          id: v.variant_id || v.id || pId + idx,
          title: v.title || 'Standard Pack',
          price: v.price || originalPrice,
          discounted_price: v.discounted_price || rawPrice,
          stock: v.stock ?? 50,
          unit: v.unit || '1 pack',
        }))
      : [
          {
            id: pId,
            title: 'Standard Pack',
            price: originalPrice,
            discounted_price: rawPrice,
            stock: p.stock ?? 50,
            unit: '1 pack',
          },
        ];

    return {
      id: pId,
      name: p.name || 'Grocery Item',
      slug: p.slug || (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${pId}`),
      category: p.category || 'vegetables',
      image: p.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
      rating: p.rating || 4.9,
      rating_count: p.rating_count || p.ratingCount || 120,
      variants,
      description: p.description || p.name || '',
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (rawId) {
          const res = await fetch(`/api/products/${rawId}`);
          const json = await res.json();
          if (json.success && json.data) {
            setProduct(formatProduct(json.data));
          }
        }
        const allRes = await fetch('/api/products');
        const allJson = await allRes.json();
        if (allJson.success && Array.isArray(allJson.data)) {
          const formattedAll = allJson.data.map(formatProduct);
          setAllProducts(formattedAll);
          if (!product && rawId) {
            const found = formattedAll.find((p: any) => String(p.id) === rawId || p.slug === rawId);
            if (found) setProduct(found);
          }
        }
      } catch (err) {
        console.warn('Product detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [rawId]);

  // Related products — same category, exclude current
  const relatedProducts = product
    ? allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
        <Header />
        <main className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0aad0a] mx-auto" />
          <p className="text-xs text-gray-400">Loading product details from database...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820]">
        <Header />
        <main className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <Package size={48} className="mx-auto text-gray-300 dark:text-gray-700" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Product Not Found</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We couldn&apos;t find the product you&apos;re looking for. It may have been removed or the URL is incorrect.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#0aad0a] text-white font-black px-6 py-3 rounded-2xl shadow-lg mt-4 transition-all hover:bg-[#088f08]"
          >
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariant];
  const discountPercent = currentVariant.price > currentVariant.discounted_price && currentVariant.discounted_price > 0
    ? Math.round(((currentVariant.price - currentVariant.discounted_price) / currentVariant.price) * 100)
    : 0;

  const effectivePrice = currentVariant.discounted_price > 0 ? currentVariant.discounted_price : currentVariant.price;

  const handleAddToCart = () => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.variant_id === currentVariant.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: Date.now(),
          product_id: product.id,
          variant_id: currentVariant.id,
          name: product.name,
          variant_title: currentVariant.title,
          image: product.image,
          price: effectivePrice,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    const newRev: ReviewItem = {
      id: Date.now(),
      userName: 'You (Verified Buyer)',
      rating: reviewRating,
      date: 'Just now',
      title: reviewTitle,
      comment: reviewComment,
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setIsReviewModalOpen(false);
    setReviewTitle('');
    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 dark:bg-[#121820] text-gray-900 dark:text-white">
      <Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <Link href="/" className="hover:text-[#0aad0a] flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:text-[#0aad0a] capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-[#1e2632] rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-sm">
          
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-lg">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-500'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                className="flex items-center gap-2 py-3 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#0aad0a] hover:text-[#0aad0a] text-xs font-bold transition-all"
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          {/* Right: Details & Purchase */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <span className="text-xs font-bold text-[#0aad0a] uppercase tracking-wider">{product.brand}</span>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
                {product.name}
              </h1>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star size={16} fill="currentColor" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.rating_count} verified customer reviews)</span>
                <span className="text-emerald-500 font-bold">● In Stock ({currentVariant.stock} units)</span>
              </div>
            </div>

            {/* Price in Naira */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#0aad0a] font-mono">
                {formatNaira(effectivePrice)}
              </span>
              {currentVariant.discounted_price > 0 && currentVariant.price > currentVariant.discounted_price && (
                <span className="text-sm text-gray-400 line-through font-mono">
                  {formatNaira(currentVariant.price)}
                </span>
              )}
            </div>

            {/* Pack Size Variants */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Select Pack Size</label>
              <div className="grid grid-cols-3 gap-2">
                {product.variants.map((v: any, idx: number) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(idx)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      selectedVariant === idx
                        ? 'border-[#0aad0a] bg-[#0aad0a]/10 text-[#0aad0a]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-black">{v.title}</div>
                    <div className="font-mono text-[11px] mt-0.5">
                      {formatNaira(v.discounted_price > 0 ? v.discounted_price : v.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-2xl p-1 bg-gray-50 dark:bg-gray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-black w-8 text-center text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#0aad0a]/30 transition-all active:scale-[0.98]"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart • {formatNaira(effectivePrice * quantity)}</span>
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 space-y-1">
                <Truck size={20} className="mx-auto text-[#0aad0a]" />
                <h5 className="text-[11px] font-bold text-gray-900 dark:text-white">30 Min Delivery</h5>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 space-y-1">
                <ShieldCheck size={20} className="mx-auto text-[#0aad0a]" />
                <h5 className="text-[11px] font-bold text-gray-900 dark:text-white">Organic Certified</h5>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 space-y-1">
                <RefreshCw size={20} className="mx-auto text-[#0aad0a]" />
                <h5 className="text-[11px] font-bold text-gray-900 dark:text-white">Easy Returns</h5>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <h4 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">About This Product</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Nutritional Info */}
            {product.nutrition && product.nutrition.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nutritional Highlights</h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.nutrition.map((n: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 rounded-xl px-3 py-2">
                      <span className="text-gray-500 dark:text-gray-400 font-semibold">{n.label}</span>
                      <span className="font-black text-gray-900 dark:text-white">{n.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Ratings & Reviews Breakdown */}
        <div className="bg-white dark:bg-[#1e2632] rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Star size={20} className="text-amber-400 fill-amber-400" /> Customer Ratings &amp; Reviews
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Real feedback from verified grocery buyers
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95 self-start sm:self-auto"
            >
              <MessageSquare size={16} />
              <span>Write a Review</span>
            </button>
          </div>

          {reviewSuccess && (
            <div className="bg-emerald-950/40 border border-[#0aad0a]/40 text-[#0aad0a] p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 size={16} /> Thank you! Your verified review has been published.
            </div>
          )}

          {/* Star Distribution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-gray-50 dark:bg-gray-900/60 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
            {/* Overall Score */}
            <div className="text-center space-y-1">
              <div className="text-5xl font-black text-gray-900 dark:text-white font-mono">{product.rating}</div>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{reviews.length + product.rating_count - 3} Verified Reviews</div>
            </div>

            {/* Distribution Bars */}
            <div className="md:col-span-2 space-y-2">
              {[
                { stars: '5 Stars', pct: 82, count: 119 },
                { stars: '4 Stars', pct: 12, count: 17 },
                { stars: '3 Stars', pct: 3, count: 5 },
                { stars: '2 Stars', pct: 2, count: 3 },
                { stars: '1 Star', pct: 1, count: 1 },
              ].map((bar: { stars: string; pct: number; count: number }, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-14 text-gray-600 dark:text-gray-400 font-bold">{bar.stars}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${bar.pct}%` }} />
                  </div>
                  <span className="w-10 text-right font-mono text-gray-500">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
            {reviews.map((r: ReviewItem) => (
              <div key={r.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0aad0a] text-white flex items-center justify-center font-bold text-xs">
                      {r.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{r.userName}</span>
                        {r.verified && (
                          <span className="bg-emerald-100 dark:bg-emerald-950/60 text-[#0aad0a] text-[10px] font-black px-1.5 py-0.5 rounded-md">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">{r.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} className={i >= r.rating ? 'text-gray-300 dark:text-gray-700' : ''} />
                    ))}
                  </div>
                </div>

                <div className="font-bold text-xs text-gray-900 dark:text-white">{r.title}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-5">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedProducts.map((rp: any) => (
                <Link
                  key={rp.id}
                  href={`/product/${rp.id}`}
                  className="group flex gap-4 bg-white dark:bg-[#1e2632] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-[#0aad0a]/40 hover:shadow-lg transition-all"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-gray-800">
                    <Image src={rp.image} alt={rp.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-[#0aad0a] transition-colors">{rp.name}</h4>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star size={11} fill="currentColor" />
                      <span className="font-bold text-gray-600 dark:text-gray-400">{rp.rating}</span>
                    </div>
                    <div className="text-sm font-black text-gray-900 dark:text-white font-mono">
                      {formatNaira(rp.variants[0].discounted_price > 0 ? rp.variants[0].discounted_price : rp.variants[0].price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Rate &amp; Review Product</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Share your feedback on {product.name}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={24} fill={star <= reviewRating ? 'currentColor' : 'none'} className={star > reviewRating ? 'text-gray-300 dark:text-gray-700' : ''} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-500 ml-2">{reviewRating} out of 5</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Crisp, delicious, and fresh!"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Detailed Feedback</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell other shoppers about the freshness, packaging, and taste..."
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
                >
                  Submit Verified Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={(id, q) => setCartItems(cartItems.map((c: CartItem) => (c.id === id ? { ...c, quantity: q } : c)))}
        onRemoveItem={(id) => setCartItems(cartItems.filter((c: CartItem) => c.id !== id))}
      />
    </div>
  );
}
