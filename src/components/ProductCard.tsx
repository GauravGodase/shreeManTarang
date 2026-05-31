import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const wishlisted = isWishlisted(product.id);

  /* ── 3-D tilt ─────────────────────────────────────────────────── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -7, y: x * 7 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  /* ── Handlers ─────────────────────────────────────────────────── */
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)];
    addToCart(product, defaultSize, product.colors[0]);
    toast.success(`${product.name} added!`, {
      style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #d4af37', borderRadius: '0', fontSize: '13px' },
      iconTheme: { primary: '#d4af37', secondary: '#0a0a0a' },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', {
      icon: wishlisted ? '💔' : '❤️',
      style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #3d3d3d', borderRadius: '0', fontSize: '13px' },
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div
          ref={cardRef}
          className="relative bg-ink-700 overflow-hidden cursor-pointer transition-shadow duration-500 hover:shadow-gold-lg"
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: hovered ? 'transform 0.08s linear, box-shadow 0.4s' : 'transform 0.5s ease, box-shadow 0.4s',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); resetTilt(); }}
        >
          {/* Image area */}
          <div className="relative aspect-[4/5] overflow-hidden bg-ink-600">
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ duration: 0.5 }}
            />
            {product.images[1] && (
              <motion.img
                src={product.images[1]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              />
            )}
            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-ink-900/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && (
                <span className="bg-gold text-ink-900 text-[10px] font-black px-2 py-0.5 tracking-[0.2em] uppercase">
                  New
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-ink-900/80 text-gold text-[10px] font-bold px-2 py-0.5 tracking-[0.15em] uppercase border border-gold/40">
                  Best Seller
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                wishlisted
                  ? 'bg-gold text-ink-900'
                  : 'bg-ink-900/70 text-white opacity-0 group-hover:opacity-100 hover:bg-gold hover:text-ink-900'
              }`}
            >
              <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>

            {/* Slide-up action bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 flex gap-0"
              initial={{ y: '100%' }}
              animate={{ y: hovered ? '0%' : '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <button
                onClick={handleQuickAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-gold text-ink-900 py-3 text-xs font-black tracking-[0.2em] uppercase hover:bg-gold-light transition-colors duration-200"
              >
                <ShoppingBag size={12} />
                Add to Cart
              </button>
              <Link
                to={`/product/${product.id}`}
                onClick={e => e.stopPropagation()}
                className="w-12 flex items-center justify-center bg-ink-900/90 border-l border-gold/30 text-white hover:bg-gold hover:text-ink-900 transition-all duration-200"
              >
                <Eye size={14} />
              </Link>
            </motion.div>

            {/* Low stock */}
            {product.stock <= 20 && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500/70 group-hover:hidden" />
            )}
          </div>

          {/* Info panel */}
          <div className="p-4 bg-ink-700 border-t border-ink-600">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-gold/80 text-[10px] tracking-[0.25em] uppercase mb-1 font-medium">
                  {product.category.replace('-', ' ')}
                </p>
                <h3 className="text-white font-semibold text-sm font-display leading-snug group-hover:text-gold transition-colors duration-300">
                  {product.name}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gold font-bold text-sm">₹{product.price.toLocaleString()}</p>
                {product.originalPrice && (
                  <p className="text-ink-300 text-xs line-through mt-0.5">
                    ₹{product.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={10}
                    className={star <= Math.floor(product.rating) ? 'text-gold' : 'text-ink-500'}
                    fill={star <= Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-ink-200 text-xs">({product.reviewCount})</span>
            </div>

            {/* Color swatches */}
            <div className="flex gap-1.5 mt-3">
              {product.colors.map(color => (
                <div
                  key={color.name}
                  title={color.name}
                  className="w-4 h-4 rounded-full border border-ink-400 hover:border-gold transition-colors duration-200 cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.stock <= 20 && (
                <span className="ml-auto text-red-400 text-[10px] font-semibold">
                  Only {product.stock} left
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
