import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/useAdminStore';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const allProducts = useAdminStore((s) => s.products);
  const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: typeof allProducts[0]) => {
    const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)];
    addToCart(product, defaultSize, product.colors[0]);
    toast.success(`Moved to cart!`, {
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

  return (
    <main className="min-h-screen bg-ink-900 pt-20">
      {/* Header */}
      <div className="bg-ink-800 border-b border-ink-700 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— Your Saves</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-50 flex items-center gap-4">
              Wishlist
              {wishlistProducts.length > 0 && (
                <span className="bg-gold text-ink-900 font-bold text-lg px-3 py-1 rounded-full">
                  {wishlistProducts.length}
                </span>
              )}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <AnimatePresence mode="wait">
          {wishlistProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 border-2 border-ink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={36} className="text-ink-300" strokeWidth={1.5} />
              </div>
              <p className="text-ink-200 text-lg font-semibold mb-2">Your wishlist is empty</p>
              <p className="text-ink-100 text-sm mb-8 max-w-xs mx-auto">
                Save your favourite pieces and come back to them anytime.
              </p>
              <Link to="/shop" className="btn-gold">
                Explore Collection <ArrowRight size={14} />
              </Link>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <AnimatePresence>
                  {wishlistProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      className="group relative"
                    >
                      <Link to={`/product/${product.id}`}>
                        <div className="product-card">
                          <div className="relative aspect-[4/5] overflow-hidden bg-ink-700">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {product.isNew && (
                              <span className="absolute top-3 left-3 bg-gold text-ink-900 text-xs font-bold px-2 py-0.5 tracking-widest uppercase">
                                New
                              </span>
                            )}
                            {/* Remove from wishlist */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product.id);
                                toast('Removed from wishlist', {
                                  icon: '💔',
                                  style: {
                                    background: '#1a1a1a',
                                    color: '#e5e5e5',
                                    border: '1px solid #3d3d3d',
                                    borderRadius: '0',
                                    fontSize: '13px',
                                  },
                                });
                              }}
                              className="absolute top-3 right-3 w-8 h-8 bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="p-4 bg-ink-700 border-t border-ink-600">
                            <p className="text-gold/70 text-xs tracking-[0.2em] uppercase mb-1">
                              {product.category.replace('-', ' ')}
                            </p>
                            <h3 className="text-ink-50 font-semibold text-sm font-display group-hover:text-gold transition-colors duration-300">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-gold font-bold text-sm">
                                ₹{product.price.toLocaleString()}
                              </p>
                              {product.originalPrice && (
                                <p className="text-ink-200 text-xs line-through">
                                  ₹{product.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleMoveToCart(product);
                              }}
                              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-gold/10 border border-gold/40 text-gold text-xs tracking-wider uppercase font-medium hover:bg-gold hover:text-ink-900 transition-all duration-300"
                            >
                              <ShoppingBag size={12} />
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 text-center">
                <Link to="/shop" className="btn-outline-gold">
                  Continue Shopping <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
