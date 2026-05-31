import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Star,
  Ruler,
  Package,
  Shield,
  ChevronDown,
  Share2,
  Zap,
} from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { useStore } from '../store/useStore';
import type { Size, Color } from '../types';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allProducts = useAdminStore((s) => s.products);
  const product = allProducts.find((p) => p.id === id);

  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(product?.colors[0] ?? null);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const wishlisted = product ? isWishlisted(product.id) : false;

  if (!product) {
    return (
      <main className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">😵</p>
          <p className="text-ink-100 mb-6">Product not found</p>
          <Link to="/shop" className="btn-gold">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size', {
        style: {
          background: '#1a1a1a',
          color: '#e5e5e5',
          border: '1px solid #ef4444',
          borderRadius: '0',
          fontSize: '13px',
        },
      });
      return;
    }
    addToCart(product, selectedSize, selectedColor ?? product.colors[0]);
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#1a1a1a',
        color: '#e5e5e5',
        border: '1px solid #d4af37',
        borderRadius: '0',
        fontSize: '13px',
      },
      iconTheme: { primary: '#d4af37', secondary: '#0a0a0a' },
    });
  };

  const related = allProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const accordionItems = [
    {
      id: 'description',
      label: 'Description',
      content: product.description,
    },
    {
      id: 'details',
      label: 'Product Details',
      content:
        'Fabric: 100% premium ringspun cotton · Weight: 240 GSM · Fit: Relaxed/Oversized · Print: DTG (Direct-to-Garment), wash-resistant · Care: Machine wash cold, inside out · Country of origin: India',
    },
    {
      id: 'shipping',
      label: 'Shipping & Returns',
      content:
        'Free shipping on orders above ₹1499. Standard delivery 3–5 business days across India. For custom print orders, production takes 1–2 days before dispatch. Reprint guarantee if print quality is unsatisfactory.',
    },
  ];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-ink-900 pt-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 text-ink-200 text-xs tracking-wider">
          <button onClick={() => navigate(-1)} className="hover:text-gold transition-colors flex items-center gap-1">
            <ArrowLeft size={12} />
            Back
          </button>
          <span>/</span>
          <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-ink-200">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-[4/5] bg-ink-700 overflow-hidden relative"
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-gold text-ink-900 text-xs font-bold px-3 py-1 tracking-widest uppercase">
                  New
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1">
                  -{discount}%
                </div>
              )}
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === i ? 'border-gold' : 'border-ink-600 hover:border-ink-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <p className="text-gold text-xs tracking-[0.3em] uppercase">
              {product.category.replace('-', ' ')}
            </p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink-50"
            >
              {product.name}
            </motion.h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= Math.floor(product.rating) ? 'text-gold' : 'text-ink-600'}
                    fill={star <= Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-ink-100 text-sm">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-gold">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-ink-200 line-through text-lg">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 border border-red-500/30">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            {product.stock <= 20 && (
              <div className="flex items-center gap-2 text-amber-400 text-xs">
                <Zap size={12} fill="currentColor" />
                <span className="tracking-wider uppercase">
                  Only {product.stock} left — selling fast
                </span>
              </div>
            )}

            {/* Color */}
            <div>
              <p className="text-ink-200 text-xs tracking-[0.2em] uppercase mb-3 font-semibold">
                Color: <span className="text-gold normal-case tracking-normal">{selectedColor?.name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor?.name === color.name
                        ? 'border-gold scale-110 shadow-gold'
                        : 'border-ink-500 hover:border-ink-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-ink-200 text-xs tracking-[0.2em] uppercase font-semibold">
                  Size: <span className="text-gold normal-case tracking-normal">{selectedSize ?? 'Select'}</span>
                </p>
                <button className="flex items-center gap-1 text-ink-200 hover:text-gold text-xs transition-colors duration-200">
                  <Ruler size={12} />
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as Size[]).map((size) => {
                  const available = product.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => available && setSelectedSize(size)}
                      disabled={!available}
                      className={`w-12 h-12 text-sm font-medium border transition-all duration-200 ${
                        !available
                          ? 'border-ink-700 text-ink-600 cursor-not-allowed relative overflow-hidden'
                          : selectedSize === size
                          ? 'bg-gold text-ink-900 border-gold font-bold'
                          : 'border-ink-500 text-ink-200 hover:border-gold hover:text-gold'
                      }`}
                    >
                      {size}
                      {!available && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-full h-px bg-ink-600 rotate-45 absolute" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-gold justify-center py-4 text-sm"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', {
                    icon: wishlisted ? '💔' : '❤️',
                    style: {
                      background: '#1a1a1a',
                      color: '#e5e5e5',
                      border: '1px solid #3d3d3d',
                      borderRadius: '0',
                      fontSize: '13px',
                    },
                  });
                }}
                className={`w-14 border flex items-center justify-center transition-all duration-300 ${
                  wishlisted
                    ? 'bg-gold border-gold text-ink-900'
                    : 'border-ink-500 text-ink-200 hover:border-gold hover:text-gold'
                }`}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button className="w-12 border border-ink-500 flex items-center justify-center text-ink-300 hover:border-gold hover:text-gold transition-all duration-200">
                <Share2 size={16} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Package, label: 'Premium Packaging' },
                { icon: Shield, label: 'Secure Checkout' },
                { icon: ArrowLeft, label: '15-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 p-3 border border-ink-600 text-center"
                >
                  <Icon size={14} className="text-gold" />
                  <span className="text-ink-100 text-xs leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="border-t border-ink-700 pt-6 space-y-0">
              {accordionItems.map((item) => (
                <div key={item.id} className="border-b border-ink-700">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-ink-100 text-sm font-semibold tracking-wide">
                      {item.label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gold transition-transform duration-300 ${
                        openAccordion === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-ink-100 text-sm pb-4 leading-relaxed">
                          {item.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">— More Like This</p>
              <h2 className="font-display text-3xl font-bold text-ink-50">You May Also Like</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
