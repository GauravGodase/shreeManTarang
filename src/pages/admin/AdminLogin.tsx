import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login, isAuthenticated } = useAdminStore();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // small delay for UX

    const ok = login(email, password);
    setLoading(false);

    if (ok) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-gold">
            <span className="text-ink-900 font-black text-lg">SM</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Shree Manrang</h1>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-ink-800 border border-ink-600 p-8">
          <p className="text-ink-100 text-sm mb-6 text-center">Sign in to manage your store</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-ink-100 text-xs tracking-wider uppercase font-semibold block">
                Email
              </label>
              <div className="relative flex items-center border border-ink-500 focus-within:border-gold transition-colors duration-200">
                <Mail size={15} className="absolute left-3 text-ink-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-ink-400 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-ink-100 text-xs tracking-wider uppercase font-semibold block">
                Password
              </label>
              <div className="relative flex items-center border border-ink-500 focus-within:border-gold transition-colors duration-200">
                <Lock size={15} className="absolute left-3 text-ink-300" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full bg-transparent pl-10 pr-10 py-3 text-sm text-white placeholder-ink-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 text-ink-300 hover:text-gold transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-2.5 text-red-400 text-sm"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold justify-center py-3.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <p className="text-center text-ink-300 text-xs mt-6">
          <a href="/" className="hover:text-gold transition-colors">← Back to Shree Manrang</a>
        </p>
      </motion.div>
    </div>
  );
}
