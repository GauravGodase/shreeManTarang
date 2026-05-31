import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Pencil, Trash2, AlertTriangle, Star,
  RotateCcw, ChevronUp, ChevronDown,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const { products, deleteProduct, resetProducts } = useAdminStore();
  const [search, setSearch]         = useState('');
  const [filterCat, setFilterCat]   = useState('all');
  const [sortBy, setSortBy]         = useState<'name' | 'price' | 'stock'>('name');
  const [sortAsc, setSortAsc]       = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        (filterCat === 'all' || p.category === filterCat) &&
        (p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)))
      );
    })
    .sort((a, b) => {
      let val = 0;
      if (sortBy === 'name')  val = a.name.localeCompare(b.name);
      if (sortBy === 'price') val = a.price - b.price;
      if (sortBy === 'stock') val = a.stock - b.stock;
      return sortAsc ? val : -val;
    });

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setConfirmDelete(null);
    toast.success('Product deleted', {
      style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #d4af37', borderRadius: '0' },
    });
  };

  const handleReset = () => {
    resetProducts();
    toast.success('Products reset to default', {
      style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #d4af37', borderRadius: '0' },
    });
  };

  const SortBtn = ({ col, label }: { col: typeof sortBy; label: string }) => (
    <button onClick={() => { if (sortBy === col) setSortAsc((p) => !p); else { setSortBy(col); setSortAsc(true); } }}
      className="flex items-center gap-1 text-ink-200 hover:text-gold transition-colors text-xs uppercase tracking-wider"
    >
      {label}
      {sortBy === col ? (sortAsc ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : null}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Products</h2>
          <p className="text-ink-200 text-sm mt-0.5">{products.length} products total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 border border-ink-500 text-ink-200 hover:border-gold hover:text-gold text-xs tracking-wider uppercase transition-all duration-200"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <Link to="/admin/products/new"
            className="btn-gold text-xs px-5 py-2.5 flex items-center gap-2"
          >
            <Plus size={14} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tag..."
            className="w-full bg-ink-800 border border-ink-500 focus:border-gold pl-9 pr-4 py-2.5 text-sm text-white placeholder-ink-400 outline-none transition-colors"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-ink-800 border border-ink-500 focus:border-gold text-ink-100 text-sm px-3 py-2.5 outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-ink-800 border border-ink-600 overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2.5rem_1fr_8rem_6rem_5rem_6rem_5rem] gap-4 px-4 py-3 border-b border-ink-600 bg-ink-700">
          <span />
          <SortBtn col="name"  label="Product" />
          <span className="text-ink-200 text-xs uppercase tracking-wider">Category</span>
          <SortBtn col="price" label="Price" />
          <SortBtn col="stock" label="Stock" />
          <span className="text-ink-200 text-xs uppercase tracking-wider">Status</span>
          <span className="text-ink-200 text-xs uppercase tracking-wider">Actions</span>
        </div>

        <div className="divide-y divide-ink-700">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-ink-300">No products found.</div>
            ) : (
              filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="grid grid-cols-1 md:grid-cols-[2.5rem_1fr_8rem_6rem_5rem_6rem_5rem] gap-4 px-4 py-3 hover:bg-ink-700/50 transition-colors items-center"
                >
                  {/* Image */}
                  <img src={product.images[0]} alt="" className="w-10 h-10 object-cover bg-ink-600 hidden md:block" />

                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={product.images[0]} alt="" className="w-10 h-10 object-cover bg-ink-600 md:hidden shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={9} className="text-gold" fill="currentColor" />
                        <span className="text-ink-300 text-[10px]">{product.rating} ({product.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="text-ink-200 text-xs capitalize bg-ink-700 border border-ink-500 px-2 py-1 w-fit md:w-auto">
                    {product.category}
                  </span>

                  {/* Price */}
                  <div>
                    <p className="text-gold text-sm font-bold">₹{product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                      <p className="text-ink-400 text-[10px] line-through">₹{product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-1.5">
                    {product.stock <= 20 && <AlertTriangle size={11} className="text-amber-400 shrink-0" />}
                    <span className={`text-sm font-semibold ${product.stock <= 20 ? 'text-amber-400' : 'text-white'}`}>
                      {product.stock}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-1 flex-wrap">
                    {product.isNew && (
                      <span className="bg-gold text-ink-900 text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider">New</span>
                    )}
                    {product.isBestseller && (
                      <span className="bg-ink-600 border border-gold/40 text-gold text-[9px] font-bold px-1.5 py-0.5 uppercase">Best</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/admin/products/edit/${product.id}`}
                      className="p-2 bg-ink-700 border border-ink-500 text-ink-200 hover:border-gold hover:text-gold transition-all duration-200"
                    >
                      <Pencil size={13} />
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      className="p-2 bg-ink-700 border border-ink-500 text-ink-200 hover:border-red-400 hover:text-red-400 transition-all duration-200"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink-800 border border-ink-600 p-6 w-80 shadow-dark-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <Trash2 size={18} className="text-red-400" />
                <h3 className="text-white font-semibold">Delete Product?</h3>
              </div>
              <p className="text-ink-200 text-sm mb-6">
                "{products.find(p => p.id === confirmDelete)?.name}" will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 border border-ink-500 text-ink-100 text-sm hover:border-ink-300 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
