'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Minus, Star, Heart } from 'lucide-react';
import { formatNaira } from '@/lib/currency';

export interface ProductVariantData {
  id: number;
  title: string;
  price: number;
  discounted_price: number;
  stock: number;
  unit: string;
}

export interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  image: string;
  rating?: number;
  rating_count?: number;
  variants: ProductVariantData[];
  onAddToCart?: (variantId: number, qty: number) => void;
}

export default function ProductCard({
  id,
  name,
  slug,
  image,
  rating = 4.8,
  rating_count = 120,
  variants = [],
  onAddToCart,
}: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentVariant = variants[selectedVariantIndex] || {
    id: 0,
    title: 'Standard',
    price: 4500,
    discounted_price: 3500,
    stock: 20,
    unit: '1 kg',
  };

  const discountPercent =
    currentVariant.price > currentVariant.discounted_price && currentVariant.discounted_price > 0
      ? Math.round(
          ((currentVariant.price - currentVariant.discounted_price) / currentVariant.price) * 100
        )
      : 0;

  const handleIncrement = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    if (onAddToCart) {
      onAddToCart(currentVariant.id, newQty);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      if (onAddToCart) {
        onAddToCart(currentVariant.id, newQty);
      }
    }
  };

  return (
    <div className="group relative bg-white dark:bg-[#1e2632] border border-gray-100 dark:border-gray-800/80 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:border-[#0aad0a]/40 flex flex-col justify-between">
      {/* Top Badges */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-10 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-0 right-0 z-10 p-1.5 rounded-full transition-colors ${
            isWishlisted
              ? 'text-red-500 bg-red-50 dark:bg-red-950/40'
              : 'text-gray-400 hover:text-red-500 bg-white/80 dark:bg-gray-800/80'
          }`}
          title="Add to Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Product Image */}
        <Link href={`/product/${id}`} className="block relative w-full h-44 mb-3 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800/40">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{rating}</span>
          <span className="text-[11px] text-gray-400">({rating_count})</span>
        </div>

        {/* Title */}
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 hover:text-[#0aad0a] dark:hover:text-[#0aad0a] line-clamp-2 min-h-[40px] transition-colors">
            {name}
          </h3>
        </Link>

        {/* Variant Dropdown */}
        {variants.length > 1 && (
          <div className="mt-2 mb-3">
            <select
              value={selectedVariantIndex}
              onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold rounded-lg px-2 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#0aad0a]"
            >
              {variants.map((v, i) => (
                <option key={v.id || i} value={i}>
                  {v.title || v.unit} - {formatNaira(v.discounted_price > 0 ? v.discounted_price : v.price)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price and Cart Action in Naira */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <div className="text-base font-black text-gray-900 dark:text-white font-mono">
              {formatNaira(currentVariant.discounted_price > 0 ? currentVariant.discounted_price : currentVariant.price)}
            </div>
            {currentVariant.discounted_price > 0 && currentVariant.discounted_price < currentVariant.price && (
              <span className="text-xs text-gray-400 line-through font-mono">
                {formatNaira(currentVariant.price)}
              </span>
            )}
          </div>

          {quantity === 0 ? (
            <button
              onClick={handleIncrement}
              className="flex items-center gap-1 bg-[#0aad0a]/10 hover:bg-[#0aad0a] text-[#0aad0a] hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#0aad0a] text-white rounded-xl p-1 shadow-md shadow-[#0aad0a]/20">
              <button
                onClick={handleDecrement}
                className="p-1 hover:bg-black/10 rounded-lg transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-bold px-1">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-1 hover:bg-black/10 rounded-lg transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
