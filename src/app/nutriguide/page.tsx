'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  Leaf, 
  HeartPulse, 
  Apple, 
  ShieldCheck, 
  ShoppingCart, 
  Bot, 
  User, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import CartDrawer, { CartItem } from '@/components/website/CartDrawer';

interface SuggestedProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  benefit: string;
}

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  products?: SuggestedProduct[];
  time: string;
}

const PRESET_TOPICS = [
  { label: '💪 High Protein Diet', query: 'What are the best high-protein groceries for muscle building?' },
  { label: '🍊 Immunity & Vitamin C', query: 'Recommend foods high in Vitamin C to boost my immune system' },
  { label: '🥑 Keto & Low Carb', query: 'What fresh low-carb and keto-friendly produce do you have?' },
  { label: '🥬 Iron & Energy Boost', query: 'I feel low on energy, what iron-rich foods should I buy?' },
];

const KNOWLEDGE_BASE: Record<string, { reply: string; products: SuggestedProduct[] }> = {
  protein: {
    reply: "For optimal muscle recovery and daily energy, focus on lean bioavailable proteins, whole dairy, and nutrient-dense greens:",
    products: [
      { id: 3, name: 'Farm Fresh Pure Whole Milk', category: 'Dairy & Eggs', price: 3.89, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200', benefit: '8g protein per cup with essential calcium' },
      { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', price: 3.49, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200', benefit: 'Rich in amino acids and fiber' },
    ],
  },
  vitamin: {
    reply: "To strengthen immune defense and collagen synthesis, incorporate natural citrus, fresh apples, and dark leafy greens:",
    products: [
      { id: 2, name: 'Red Sweet Crisp Apples (Washington)', category: 'Fruits', price: 4.29, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200', benefit: 'Rich in Vitamin C and natural antioxidants' },
      { id: 5, name: 'Fresh Ripe Hass Avocados (Pack of 3)', category: 'Vegetables', price: 4.99, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200', benefit: 'Heart-healthy monounsaturated fats & Vitamin E' },
    ],
  },
  keto: {
    reply: "For a ketogenic lifestyle, prioritize healthy dietary fats, high-fiber avocados, and crisp zero-sugar vegetables:",
    products: [
      { id: 5, name: 'Fresh Ripe Hass Avocados (Pack of 3)', category: 'Vegetables', price: 4.99, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200', benefit: 'Only 2g net carbs with high healthy fats' },
      { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', price: 3.49, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200', benefit: 'High in sulforaphane and keto-friendly fiber' },
    ],
  },
  iron: {
    reply: "Iron deficiency can cause chronic fatigue. Boost your red blood cell count with dark cruciferous veggies and whole farm essentials:",
    products: [
      { id: 1, name: 'Fresh Organic Farm Broccoli', category: 'Vegetables', price: 3.49, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200', benefit: 'Plant-based non-heme iron and folate' },
      { id: 2, name: 'Red Sweet Crisp Apples (Washington)', category: 'Fruits', price: 4.29, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200', benefit: 'Vitamin C synergistically accelerates iron absorption' },
    ],
  },
};

export default function NutriGuidePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hello! I am **NutriGuide**, your AI Nutrition & Meal Planning Assistant. Ask me about nutritional deficiencies, healthy grocery lists, or dietary goals!",
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (userQuery?: string) => {
    const textToSend = userQuery || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userQuery) setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let match = KNOWLEDGE_BASE.protein;
      if (lower.includes('vitamin') || lower.includes('immunit') || lower.includes('citrus')) {
        match = KNOWLEDGE_BASE.vitamin;
      } else if (lower.includes('keto') || lower.includes('carb') || lower.includes('fat')) {
        match = KNOWLEDGE_BASE.keto;
      } else if (lower.includes('iron') || lower.includes('energy') || lower.includes('tired')) {
        match = KNOWLEDGE_BASE.iron;
      }

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: match.reply,
        products: match.products,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 900);
  };

  const handleAddToCart = (product: SuggestedProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const newItem: CartItem = {
        id: Date.now(),
        product_id: product.id,
        variant_id: product.id,
        name: product.name,
        variant_title: '500g Pack',
        image: product.image,
        price: product.price,
        quantity: 1,
      };
      return [...prev, newItem];
    });

    setAddedItemName(product.name);
    setTimeout(() => setAddedItemName(''), 2500);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121820] text-gray-900 dark:text-white flex flex-col justify-between">
      <Header cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {/* Header Title */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
              <Sparkles size={14} /> AI Powered Health & Nutrition
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">NutriGuide Assistant</h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg leading-relaxed">
              Get personalized meal recommendations, discover nutrient-rich produce, and add verified groceries directly to your cart.
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20">
            <HeartPulse size={36} className="text-white animate-pulse" />
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PRESET_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(topic.query)}
              className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 hover:border-[#0aad0a] text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap shadow-sm active:scale-95"
            >
              {topic.label}
            </button>
          ))}
        </div>

        {addedItemName && (
          <div className="bg-emerald-950/60 border border-[#0aad0a]/40 text-[#0aad0a] text-xs font-bold p-3 rounded-2xl flex items-center gap-2 animate-fade-in shadow-md">
            <CheckCircle2 size={16} /> Added <strong>{addedItemName}</strong> to your checkout cart!
          </div>
        )}

        {/* Chat Stream */}
        <div className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 space-y-6 min-h-[420px] shadow-sm">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  m.sender === 'user'
                    ? 'bg-gray-800 text-white'
                    : 'bg-[#0aad0a] text-white'
                }`}
              >
                {m.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              <div
                className={`space-y-3 max-w-xl ${
                  m.sender === 'user' ? 'items-end' : ''
                }`}
              >
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#0aad0a] text-white rounded-tr-none'
                      : 'bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Attached Product Recommendations */}
                {m.products && m.products.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {m.products.map((p) => (
                      <div
                        key={p.id}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-[#0aad0a]/40 transition-colors group"
                      >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-[#0aad0a] font-semibold block">
                            ${p.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate">
                            {p.benefit}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(p)}
                          className="p-2 bg-[#0aad0a] hover:bg-[#088f08] text-white rounded-xl shadow-md transition-all active:scale-95 flex-shrink-0"
                          title="Add to Cart"
                        >
                          <ShoppingCart size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-gray-400 block px-1">
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0aad0a] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot size={18} />
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 text-gray-400">
                <Sparkles size={14} className="animate-spin text-[#0aad0a]" />
                <span>NutriGuide is formulating dietary recommendations...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-white dark:bg-[#1e2632] border border-gray-200 dark:border-gray-800 rounded-2xl p-2 flex items-center gap-3 shadow-lg"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about healthy recipes, vitamins, nutritional deficiencies..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white px-4 py-2.5 text-xs sm:text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#0aad0a] hover:bg-[#088f08] disabled:opacity-40 text-white font-bold p-3 rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={(itemId, newQty) => {
          if (newQty <= 0) {
            setCartItems((prev) => prev.filter((it) => it.id !== itemId));
          } else {
            setCartItems((prev) =>
              prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
            );
          }
        }}
        onRemoveItem={(itemId) => setCartItems((prev) => prev.filter((it) => it.id !== itemId))}
      />

      <Footer />
    </div>
  );
}
