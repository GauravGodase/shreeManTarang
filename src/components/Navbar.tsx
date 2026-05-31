import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Menu, X, Search } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleCart, cartCount, wishlist } = useStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'All Products' },
    { href: '/shop?category=tshirts', label: 'T-Shirts' },
    { href: '/shop?category=kids', label: 'Kids' },
    { href: '/shop?category=mugs', label: 'Mugs & Gifts' },
    { href: '/wishlist', label: 'Wishlist' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ink-900/95 backdrop-blur-md border-b border-ink-600 shadow-dark-lg'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-all duration-300">
                <span className="text-ink-900 font-black text-xs">SM</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg md:text-xl font-bold tracking-widest text-ink-50 group-hover:text-gold transition-colors duration-300">
                  SHREE MANRANG
                </span>
                <span className="text-gold text-[9px] tracking-[0.25em] uppercase hidden md:block">
                  Custom Prints
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`nav-link relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300 ${
                    location.pathname === link.href
                      ? 'text-gold after:w-full'
                      : 'after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setSearchOpen((p) => !p)}
                className="p-2 text-ink-100 hover:text-gold transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <Link
                to="/wishlist"
                className="relative p-2 text-ink-100 hover:text-gold transition-colors duration-200"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-ink-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleCart}
                className="relative p-2 text-ink-100 hover:text-gold transition-colors duration-200"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartCount() > 0 && (
                  <motion.span
                    key={cartCount()}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-ink-900 text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount()}
                  </motion.span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className="md:hidden p-2 text-ink-100 hover:text-gold transition-colors duration-200"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-ink-600 bg-ink-900/98 backdrop-blur-md overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                <div className="flex items-center gap-3 border border-ink-400 focus-within:border-gold transition-colors duration-200">
                  <Search size={16} className="ml-3 text-ink-200" />
                  <input
                    autoFocus
                    placeholder="Search T-shirts, sublimation, DTF prints..."
                    className="flex-1 bg-transparent py-3 pr-4 text-sm text-ink-50 placeholder-ink-300 outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-4/5 max-w-xs bg-ink-800 border-l border-ink-600 flex flex-col pt-20"
          >
            <div className="flex flex-col gap-1 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="block py-4 border-b border-ink-600 text-ink-100 hover:text-gold font-medium tracking-wider uppercase text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto px-6 pb-8">
              <p className="text-ink-300 text-xs tracking-widest uppercase">
                Custom Prints · Mahad, Raigad
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-ink-900/70 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
