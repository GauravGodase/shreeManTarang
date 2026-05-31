import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Grid2x2, LayoutGrid } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import { useAdminStore } from '../store/useAdminStore';
import type { Category } from '../types';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [grid, setGrid] = useState<2 | 3>(3);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2500]);

  const activeCategory = searchParams.get('category') as Category | null;

  const setCategory = (cat: Category | null) => {
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  const allProducts = useAdminStore((s) => s.products);
  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (activeCategory) {
      list = list.filter((p) => p.category === activeCategory);
    }

    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
    }

    return list;
  }, [activeCategory, priceRange, sortBy, allProducts]);

  const sortLabels: Record<SortOption, string> = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    newest: 'Newest First',
    rating: 'Highest Rated',
  };

  return (
    <main className="min-h-screen bg-ink-900 pt-20">
      {/* Page header */}
      <div className="bg-ink-800 border-b border-ink-700 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— Shree Manrang</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-50">
              {activeCategory
                ? categories.find((c) => c.id === activeCategory)?.label ?? 'All Products'
                : 'All Products'}
            </h1>
            <p className="text-ink-100 text-sm mt-2">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'} · Custom printing available — WhatsApp to order
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Category chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            <button
              onClick={() => setCategory(null)}
              className={`shrink-0 px-4 py-2 text-xs tracking-wider uppercase font-medium transition-all duration-200 ${
                !activeCategory
                  ? 'bg-gold text-ink-900'
                  : 'border border-ink-500 text-ink-300 hover:border-gold hover:text-gold'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id as Category)}
                className={`shrink-0 px-4 py-2 text-xs tracking-wider uppercase font-medium transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-gold text-ink-900'
                    : 'border border-ink-500 text-ink-300 hover:border-gold hover:text-gold'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort + view toggles */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((p) => !p)}
                className="hidden md:flex items-center gap-2 px-4 py-2 border border-ink-500 text-ink-200 hover:border-gold text-xs tracking-wider uppercase transition-colors duration-200"
              >
                {sortLabels[sortBy]}
                <ChevronDown size={12} className={sortOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full mt-1 w-52 bg-ink-700 border border-ink-500 z-20 py-1 shadow-dark-lg"
                  >
                    {(Object.entries(sortLabels) as [SortOption, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => { setSortBy(val); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs tracking-wider hover:bg-gold/10 hover:text-gold transition-colors duration-200 ${
                          sortBy === val ? 'text-gold' : 'text-ink-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filters button */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-ink-500 text-ink-200 hover:border-gold text-xs tracking-wider uppercase transition-colors duration-200"
            >
              <SlidersHorizontal size={13} />
              Filter
            </button>

            {/* Grid toggle (desktop) */}
            <div className="hidden md:flex border border-ink-500">
              <button
                onClick={() => setGrid(3)}
                className={`p-2 transition-colors duration-200 ${
                  grid === 3 ? 'bg-gold text-ink-900' : 'text-ink-400 hover:text-gold'
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setGrid(2)}
                className={`p-2 border-l border-ink-500 transition-colors duration-200 ${
                  grid === 2 ? 'bg-gold text-ink-900' : 'text-ink-400 hover:text-gold'
                }`}
              >
                <Grid2x2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 text-center"
            >
              <p className="text-4xl mb-4">🕳️</p>
              <p className="text-ink-100 tracking-wider uppercase text-sm">
                No products found for this category
              </p>
              <p className="text-ink-200 text-xs mt-2">
                Need something custom? WhatsApp us!
              </p>
              <button
                onClick={() => setCategory(null)}
                className="btn-outline-gold text-xs mt-6"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid grid-cols-2 gap-4 md:gap-6 ${
                grid === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
              }`}
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-ink-800 border-r border-ink-600 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-ink-600">
                <h2 className="font-display text-xl font-bold text-ink-50">Filters</h2>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="text-ink-300 hover:text-gold transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-6 space-y-8">
                {/* Category */}
                <div>
                  <h3 className="text-ink-100 text-xs tracking-[0.2em] uppercase font-semibold mb-4">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setCategory(null)}
                      className={`w-full text-left px-3 py-2.5 text-sm transition-all duration-200 border ${
                        !activeCategory
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-transparent text-ink-300 hover:text-gold'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id as Category)}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-all duration-200 border flex items-center gap-2 ${
                          activeCategory === cat.id
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-transparent text-ink-300 hover:text-gold'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-ink-100 text-xs tracking-[0.2em] uppercase font-semibold mb-4">
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={0}
                      max={2500}
                      step={100}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full accent-gold"
                    />
                    <div className="flex justify-between text-ink-200 text-xs">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Sort (mobile) */}
                <div className="md:hidden">
                  <h3 className="text-ink-100 text-xs tracking-[0.2em] uppercase font-semibold mb-4">
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {(Object.entries(sortLabels) as [SortOption, string][]).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => { setSortBy(val); setFiltersOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-all duration-200 border ${
                          sortBy === val
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-transparent text-ink-300 hover:text-gold'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCategory(null);
                    setPriceRange([0, 2500]);
                    setSortBy('featured');
                    setFiltersOpen(false);
                  }}
                  className="btn-outline-gold w-full justify-center text-xs"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
