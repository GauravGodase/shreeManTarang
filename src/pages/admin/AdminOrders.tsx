import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Clock, CheckCircle2, Truck, XCircle,
  ChevronDown, Trash2, MessageCircle, Search,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { config } from '../../config';
import type { Order } from '../../store/useAdminStore';
import toast from 'react-hot-toast';

const statusConfig = {
  pending:   { icon: Clock,         color: 'text-amber-400',  bg: 'bg-amber-400/10  border-amber-400/40',  label: 'Pending'   },
  confirmed: { icon: CheckCircle2,  color: 'text-blue-400',   bg: 'bg-blue-400/10   border-blue-400/40',   label: 'Confirmed' },
  delivered: { icon: Truck,         color: 'text-green-400',  bg: 'bg-green-400/10  border-green-400/40',  label: 'Delivered' },
  cancelled: { icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-400/10    border-red-400/40',    label: 'Cancelled' },
};

function OrderCard({ order, onStatusChange, onDelete }: {
  order: Order;
  onStatusChange: (id: string, s: Order['status']) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[order.status];
  const Icon = cfg.icon;
  const waText = `Hi! Regarding your order ${order.id} — your order has been confirmed and is being processed. Total: ₹${order.total.toLocaleString()}. We'll update you shortly!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-ink-800 border border-ink-600 overflow-hidden"
    >
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold shrink-0 ${cfg.bg} ${cfg.color}`}>
          <Icon size={11} />
          {cfg.label}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-bold">{order.id}</p>
          <p className="text-ink-200 text-xs">
            {new Date(order.timestamp).toLocaleString('en-IN')} ·{' '}
            {order.items.length} item{order.items.length > 1 ? 's' : ''}
          </p>
        </div>

        <p className="text-gold font-bold text-sm shrink-0">₹{order.total.toLocaleString()}</p>

        <button onClick={() => setExpanded((p) => !p)}
          className="p-1.5 text-ink-300 hover:text-gold transition-colors">
          <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink-600"
          >
            <div className="px-5 py-4 space-y-4">
              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.productImage} alt="" className="w-12 h-12 object-cover bg-ink-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-ink-200 text-xs">
                        Size: {item.size} · Colour: {item.colorName} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-gold text-sm font-semibold shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-ink-600 pt-3 space-y-1.5">
                <div className="flex justify-between text-xs text-ink-200">
                  <span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-ink-200">
                  <span>Shipping</span>
                  <span className={order.shipping === 0 ? 'text-green-400' : ''}>
                    {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white border-t border-ink-600 pt-1.5">
                  <span>Total</span><span className="text-gold">₹{order.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-ink-600 pt-3">
                {/* Status dropdown */}
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                  className="bg-ink-700 border border-ink-500 focus:border-gold text-ink-100 text-xs px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* WhatsApp follow-up */}
                <a href={`https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(waText)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-500/40 text-green-300 text-xs hover:bg-green-600/30 transition-colors">
                  <MessageCircle size={12} /> Follow up
                </a>

                {/* Delete */}
                <button onClick={() => onDelete(order.id)}
                  className="flex items-center gap-2 px-3 py-2 border border-ink-500 text-red-400 text-xs hover:border-red-400 transition-colors ml-auto">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useAdminStore();
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = search === '' || o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const handleStatusChange = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
    toast.success(`Order ${status}`, {
      style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #d4af37', borderRadius: '0' },
    });
  };

  const handleDelete = (id: string) => {
    deleteOrder(id);
    toast.success('Order deleted', {
      style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #d4af37', borderRadius: '0' },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Orders</h2>
        <p className="text-ink-200 text-sm mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'pending', 'confirmed', 'delivered', 'cancelled'] as const).map((s) => {
          const count = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length;
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold border transition-all duration-200 ${
                filterStatus === s
                  ? 'bg-gold text-ink-900 border-gold'
                  : 'border-ink-500 text-ink-200 hover:border-gold hover:text-gold'}`}>
              {s === 'all' ? 'All' : s} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID or product..."
          className="w-full bg-ink-800 border border-ink-500 focus:border-gold pl-9 pr-4 py-2.5 text-sm text-white placeholder-ink-400 outline-none transition-colors max-w-md" />
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-24 text-center bg-ink-800 border border-ink-600">
            <ShoppingBag size={40} className="text-ink-500 mx-auto mb-4" strokeWidth={1} />
            <p className="text-ink-200 text-sm">
              {orders.length === 0
                ? 'No orders yet. Orders placed via WhatsApp checkout will appear here.'
                : 'No orders matching your filter.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
