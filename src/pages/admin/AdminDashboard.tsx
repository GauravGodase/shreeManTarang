import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, AlertTriangle, TrendingUp,
  ArrowRight, Star, Clock, CheckCircle2, XCircle, Truck,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { config } from '../../config';

const statusIcon = { pending: Clock, confirmed: CheckCircle2, delivered: Truck, cancelled: XCircle };
const statusColor = { pending: 'text-amber-400', confirmed: 'text-blue-400', delivered: 'text-green-400', cancelled: 'text-red-400' };
const statusBg    = { pending: 'bg-amber-400/10 border-amber-400/30', confirmed: 'bg-blue-400/10 border-blue-400/30', delivered: 'bg-green-400/10 border-green-400/30', cancelled: 'bg-red-400/10 border-red-400/30' };

function StatCard({ label, value, sub, icon: Icon, color, delay = 0 }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-ink-800 border border-ink-600 p-5 hover:border-ink-400 transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-ink-200 text-xs tracking-wider uppercase font-medium mb-2">{label}</p>
          <p className={`font-display text-3xl font-black ${color}`}>{value}</p>
          {sub && <p className="text-ink-300 text-xs mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 border flex items-center justify-center shrink-0 ${color.replace('text-', 'border-').replace('400', '400/40')} bg-current/5`}
          style={{ background: `rgba(var(--tw-${color.split('-')[1]}-${color.split('-')[2]}-rgb, 255 255 255) / 0.06)` }}
        >
          <Icon size={18} className={color} />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const products = useAdminStore((s) => s.products);
  const orders   = useAdminStore((s) => s.orders);

  const lowStock    = products.filter((p) => p.stock <= 20).length;
  const newProducts = products.filter((p) => p.isNew).length;

  const pendingOrders   = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenue    = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);

  const recentOrders = orders.slice(0, 5);
  const topProducts  = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-ink-200 text-sm mt-1">Welcome back, {config.store.owner.split(" ")[0]}. Here's your store overview.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products"  value={products.length}  sub={`${newProducts} new`}      icon={Package}      color="text-gold"        delay={0} />
        <StatCard label="Total Orders"    value={orders.length}    sub={`${pendingOrders} pending`} icon={ShoppingBag}  color="text-blue-400"    delay={0.05} />
        <StatCard label="Low Stock Items" value={lowStock}         sub="Below 20 units"             icon={AlertTriangle} color="text-amber-400"  delay={0.1} />
        <StatCard label="Est. Revenue"    value={`₹${totalRevenue.toLocaleString()}`} sub={`${deliveredOrders} delivered`} icon={TrendingUp} color="text-green-400" delay={0.15} />
      </div>

      {/* Order status chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['pending', 'confirmed', 'delivered', 'cancelled'] as const).map((status) => {
          const Icon = statusIcon[status];
          const count = orders.filter((o) => o.status === status).length;
          return (
            <div key={status} className={`flex items-center gap-3 px-4 py-3 border ${statusBg[status]}`}>
              <Icon size={15} className={statusColor[status]} />
              <div>
                <p className="text-white text-sm font-bold">{count}</p>
                <p className="text-ink-200 text-[10px] uppercase tracking-wider capitalize">{status}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-ink-800 border border-ink-600"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-600">
            <h3 className="text-white font-semibold text-sm">Recent Orders</h3>
            <Link to="/admin/orders" className="text-gold text-xs flex items-center gap-1 hover:underline">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-ink-700">
            {recentOrders.length === 0 ? (
              <p className="text-ink-300 text-sm text-center py-8">No orders yet</p>
            ) : recentOrders.map((order) => {
              const Icon  = statusIcon[order.status];
              const color = statusColor[order.status];
              return (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3">
                  <Icon size={14} className={color} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{order.id}</p>
                    <p className="text-ink-300 text-[10px]">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
                      {new Date(order.timestamp).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <p className="text-gold text-xs font-bold">₹{order.total.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-ink-800 border border-ink-600"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-600">
            <h3 className="text-white font-semibold text-sm">Top Products</h3>
            <Link to="/admin/products" className="text-gold text-xs flex items-center gap-1 hover:underline">
              Manage <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-ink-700">
            {topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 px-5 py-3">
                <span className="text-ink-400 text-xs w-4 shrink-0">#{i + 1}</span>
                <img src={product.images[0]} alt="" className="w-10 h-10 object-cover bg-ink-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{product.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={9} className="text-gold" fill="currentColor" />
                    <span className="text-ink-300 text-[10px]">{product.rating} ({product.reviewCount})</span>
                  </div>
                </div>
                <p className="text-gold text-xs font-bold">₹{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Low Stock Warning */}
      {lowStock > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-start gap-4 bg-amber-400/10 border border-amber-400/30 px-5 py-4"
        >
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-sm">Low Stock Warning</p>
            <p className="text-ink-200 text-xs mt-1">
              {products.filter((p) => p.stock <= 20).map((p) => p.name).join(', ')} — below 20 units.{' '}
              <Link to="/admin/products" className="text-gold hover:underline">Update stock →</Link>
            </p>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Add New Product', href: '/admin/products/new', color: 'border-gold/40 hover:border-gold bg-gold/5' },
          { label: 'View All Orders', href: '/admin/orders',       color: 'border-blue-400/40 hover:border-blue-400 bg-blue-400/5' },
          { label: 'Manage Products', href: '/admin/products',     color: 'border-ink-500 hover:border-ink-300 bg-ink-700/50' },
        ].map((action) => (
          <Link key={action.label} to={action.href}
            className={`flex items-center justify-between px-4 py-3.5 border text-sm font-medium text-white transition-all duration-200 ${action.color}`}
          >
            {action.label}
            <ArrowRight size={14} className="text-ink-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
