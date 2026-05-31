import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { Product, Size, Category } from '../../types';
import toast from 'react-hot-toast';

const ALL_SIZES: Size[]     = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const ALL_CATS: Category[]  = ['tshirts', 'kids', 'corporate', 'caps', 'mugs', 'sublimation', 'frames'];

function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-ink-100 text-xs tracking-wider uppercase font-semibold block">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full bg-ink-700 border border-ink-500 focus:border-gold px-3 py-2.5 text-sm text-white placeholder-ink-400 outline-none transition-colors';

export default function AdminProductForm() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const { products, addProduct, updateProduct } = useAdminStore();
  const isEdit     = Boolean(id);
  const existing   = isEdit ? products.find((p) => p.id === id) : undefined;

  const [form, setForm] = useState<Omit<Product, 'id'>>({
    name: '', price: 0, originalPrice: undefined, category: 'tshirts',
    tags: [], sizes: ['M'], colors: [{ name: 'Black', hex: '#111111' }],
    images: [''], description: '', rating: 5.0, reviewCount: 0,
    isNew: false, isBestseller: false, stock: 50,
  });
  const [newTag,   setNewTag]   = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');

  useEffect(() => {
    if (existing) {
      const { id: _id, ...rest } = existing as Product;
      setForm(rest);
    }
  }, [existing]);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleSize = (size: Size) =>
    set('sizes', form.sizes.includes(size)
      ? form.sizes.filter((s) => s !== size)
      : [...form.sizes, size]);

  const addTag = () => {
    const t = newTag.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setNewTag('');
  };

  const addImage = () => {
    if (newImgUrl.trim()) { set('images', [...form.images, newImgUrl.trim()]); setNewImgUrl(''); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Product name is required'); return; }
    if (form.price <= 0)   { toast.error('Price must be greater than 0'); return; }
    if (form.images.filter(Boolean).length === 0) { toast.error('At least one image is required'); return; }

    if (isEdit && id) {
      updateProduct(id, form);
      toast.success('Product updated!', { style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #d4af37', borderRadius: '0' } });
    } else {
      const newId = `p-${Date.now()}`;
      addProduct({ id: newId, ...form, images: form.images.filter(Boolean) });
      toast.success('Product added!', { style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #d4af37', borderRadius: '0' } });
    }
    navigate('/admin/products');
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="p-2 border border-ink-500 text-ink-200 hover:border-gold hover:text-gold transition-all duration-200">
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-ink-200 text-sm mt-0.5">
            {isEdit ? `Editing: ${existing?.name}` : 'Fill in the product details below'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-ink-800 border border-ink-600 p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm border-b border-ink-600 pb-3">Basic Information</h3>

          <InputField label="Product Name *">
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Hitman Forever Tee" required />
          </InputField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Category *">
              <select className={inputCls + ' cursor-pointer'} value={form.category}
                onChange={(e) => set('category', e.target.value as Category)}>
                {ALL_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </InputField>
            <InputField label="Stock Quantity *">
              <input type="number" className={inputCls} value={form.stock} min={0}
                onChange={(e) => set('stock', Number(e.target.value))} />
            </InputField>
          </div>

          <InputField label="Description">
            <textarea className={inputCls + ' resize-none h-24'} value={form.description}
              onChange={(e) => set('description', e.target.value)} placeholder="Describe the product..." />
          </InputField>
        </motion.section>

        {/* Pricing */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-ink-800 border border-ink-600 p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm border-b border-ink-600 pb-3">Pricing</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Selling Price (₹) *">
              <input type="number" className={inputCls} value={form.price} min={0}
                onChange={(e) => set('price', Number(e.target.value))} required />
            </InputField>
            <InputField label="Original Price (₹) — for strikethrough">
              <input type="number" className={inputCls} value={form.originalPrice ?? ''}
                min={0} placeholder="Leave blank if no discount"
                onChange={(e) => set('originalPrice', e.target.value ? Number(e.target.value) : undefined)} />
            </InputField>
          </div>
        </motion.section>

        {/* Images */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-ink-800 border border-ink-600 p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm border-b border-ink-600 pb-3">Product Images (URLs)</h3>

          <div className="space-y-3">
            {form.images.map((url, i) => (
              <div key={i} className="flex gap-2 items-center">
                {url && <img src={url} alt="" className="w-12 h-12 object-cover bg-ink-600 shrink-0 border border-ink-500" />}
                <input className={inputCls + ' flex-1'} value={url}
                  onChange={(e) => { const imgs = [...form.images]; imgs[i] = e.target.value; set('images', imgs); }}
                  placeholder="https://example.com/image.jpg" />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                    className="p-2.5 border border-ink-500 text-red-400 hover:border-red-400 transition-colors shrink-0">
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input className={inputCls + ' flex-1'} value={newImgUrl}
              onChange={(e) => setNewImgUrl(e.target.value)}
              placeholder="Paste image URL and click +" />
            <button type="button" onClick={addImage}
              className="px-4 border border-ink-500 text-ink-200 hover:border-gold hover:text-gold transition-all">
              <Plus size={15} />
            </button>
          </div>
        </motion.section>

        {/* Variants */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-ink-800 border border-ink-600 p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm border-b border-ink-600 pb-3">Sizes & Colors</h3>

          <InputField label="Available Sizes">
            <div className="flex gap-2 flex-wrap">
              {ALL_SIZES.map((size) => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className={`w-12 h-10 text-sm font-semibold border transition-all ${
                    form.sizes.includes(size)
                      ? 'bg-gold text-ink-900 border-gold'
                      : 'border-ink-500 text-ink-200 hover:border-gold hover:text-gold'}`}>
                  {size}
                </button>
              ))}
            </div>
          </InputField>

          <InputField label="Colors">
            <div className="space-y-2">
              {form.colors.map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-ink-500 shrink-0" style={{ background: color.hex }} />
                  <input className={inputCls + ' flex-1'} value={color.name}
                    onChange={(e) => { const cols = [...form.colors]; cols[i] = { ...cols[i], name: e.target.value }; set('colors', cols); }}
                    placeholder="Color name" />
                  <input type="color" value={color.hex}
                    onChange={(e) => { const cols = [...form.colors]; cols[i] = { ...cols[i], hex: e.target.value }; set('colors', cols); }}
                    className="w-10 h-10 bg-ink-700 border border-ink-500 cursor-pointer p-0.5" />
                  {form.colors.length > 1 && (
                    <button type="button" onClick={() => set('colors', form.colors.filter((_, idx) => idx !== i))}
                      className="p-2 border border-ink-500 text-red-400 hover:border-red-400 transition-colors">
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button"
                onClick={() => set('colors', [...form.colors, { name: '', hex: '#111111' }])}
                className="flex items-center gap-2 text-gold text-xs hover:underline mt-1">
                <Plus size={12} /> Add Color
              </button>
            </div>
          </InputField>
        </motion.section>

        {/* Tags & Status */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-ink-800 border border-ink-600 p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm border-b border-ink-600 pb-3">Tags & Visibility</h3>

          <InputField label="Tags">
            <div className="flex flex-wrap gap-2 mb-2">
              {form.tags.map((t) => (
                <span key={t} className="flex items-center gap-1 bg-ink-700 border border-ink-500 px-2.5 py-1 text-ink-100 text-xs">
                  {t}
                  <button type="button" onClick={() => set('tags', form.tags.filter((x) => x !== t))}
                    className="text-ink-400 hover:text-red-400 transition-colors ml-1">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={inputCls + ' flex-1'} value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Type tag and press Enter" />
              <button type="button" onClick={addTag}
                className="px-4 border border-ink-500 text-ink-200 hover:border-gold hover:text-gold transition-all">
                <Plus size={15} />
              </button>
            </div>
          </InputField>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-ink-600 hover:border-ink-400 transition-colors">
              <div onClick={() => set('isNew', !form.isNew)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.isNew ? 'bg-gold' : 'bg-ink-600'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isNew ? 'left-5.5' : 'left-0.5'}`}
                  style={{ left: form.isNew ? '22px' : '2px' }} />
              </div>
              <span className="text-ink-100 text-sm">Mark as New</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 border border-ink-600 hover:border-ink-400 transition-colors">
              <div onClick={() => set('isBestseller', !form.isBestseller)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.isBestseller ? 'bg-gold' : 'bg-ink-600'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all`}
                  style={{ left: form.isBestseller ? '22px' : '2px' }} />
              </div>
              <span className="text-ink-100 text-sm">Best Seller</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Rating (0–5)">
              <input type="number" className={inputCls} value={form.rating} min={0} max={5} step={0.1}
                onChange={(e) => set('rating', Number(e.target.value))} />
            </InputField>
            <InputField label="Review Count">
              <input type="number" className={inputCls} value={form.reviewCount} min={0}
                onChange={(e) => set('reviewCount', Number(e.target.value))} />
            </InputField>
          </div>
        </motion.section>

        {/* Submit */}
        <div className="flex gap-4">
          <Link to="/admin/products"
            className="flex-1 py-3.5 border border-ink-500 text-ink-100 text-sm font-semibold text-center hover:border-ink-300 transition-colors">
            Cancel
          </Link>
          <button type="submit"
            className="flex-1 btn-gold justify-center py-3.5 text-sm gap-2">
            <Save size={15} />
            {isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
