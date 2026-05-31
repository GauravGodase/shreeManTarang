import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, LogOut,
  Menu, ChevronRight, ExternalLink, Settings,
} from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';
import { config } from '../config';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/products',  label: 'Products',    icon: Package },
  { href: '/admin/orders',    label: 'Orders',      icon: ShoppingBag },
  { href: '/admin/settings',  label: 'Settings',    icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);
  const orders = useAdminStore((s) => s.orders);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out', {
      style: { background: '#1a1a1a', color: '#e5e5e5', border: '1px solid #d4af37', borderRadius: '0' },
    });
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-ink-600">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold-gradient rounded-full flex items-center justify-center shrink-0">
            <span className="text-ink-900 font-black text-xs">SM</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-wide">Shree Manrang</p>
            <p className="text-gold text-[10px] tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = location.pathname.startsWith(href);
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-gold/15 text-gold border-l-2 border-gold'
                  : 'text-ink-100 hover:bg-ink-600/50 hover:text-gold border-l-2 border-transparent'
              }`}
            >
              <Icon size={16} className={active ? 'text-gold' : 'text-ink-300 group-hover:text-gold'} />
              {label}
              {label === 'Orders' && pendingOrders > 0 && (
                <span className="ml-auto bg-gold text-ink-900 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {pendingOrders}
                </span>
              )}
              {active && <ChevronRight size={12} className="ml-auto text-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-ink-600 space-y-1">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-200 hover:text-gold transition-colors duration-200"
        >
          <ExternalLink size={15} />
          View Live Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink-200 hover:text-red-400 transition-colors duration-200"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ink-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-ink-800 border-r border-ink-600 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-ink-900/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-60 bg-ink-800 border-r border-ink-600"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-ink-900/95 backdrop-blur-md border-b border-ink-700 px-4 md:px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 text-ink-200 hover:text-gold transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Page breadcrumb */}
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">
              {navItems.find((n) => location.pathname.startsWith(n.href))?.label ?? 'Admin'}
            </p>
          </div>

          {/* Admin badge */}
          <div className="flex items-center gap-2 bg-ink-700 border border-ink-500 px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-ink-100 text-xs font-medium">{config.store.owner}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
