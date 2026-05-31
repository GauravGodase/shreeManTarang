import { motion } from 'framer-motion';
import { config } from '../../config';
import { Shield, Store, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Settings</h2>
        <p className="text-ink-200 text-sm mt-0.5">Store configuration</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="bg-ink-800 border border-ink-600 p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm border-b border-ink-600 pb-3 flex items-center gap-2">
          <Store size={15} className="text-gold" /> Store Info
        </h3>
        {[
          { icon: Store,   label: 'Business Name',  value: config.store.name },
          { icon: Phone,   label: 'WhatsApp',        value: config.contact.phoneDisplay },
          { icon: Mail,    label: 'Email',            value: config.contact.email },
          { icon: MapPin,  label: 'Location',        value: config.store.location },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon size={14} className="text-gold mt-0.5 shrink-0" />
            <div>
              <p className="text-ink-300 text-xs uppercase tracking-wider">{label}</p>
              <p className="text-white text-sm font-medium">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-ink-800 border border-ink-600 p-5 space-y-3">
        <h3 className="text-white font-semibold text-sm border-b border-ink-600 pb-3 flex items-center gap-2">
          <Shield size={15} className="text-gold" /> Admin Credentials
        </h3>
        <p className="text-ink-200 text-sm">
          Email: <span className="text-white font-medium">{config.admin.email}</span>
        </p>
        <p className="text-ink-200 text-sm">
          Password: <span className="text-white font-medium">••••••••••••••</span>
        </p>
        <p className="text-ink-400 text-xs mt-2">
          Credentials are hardcoded. Contact the developer to update them.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-ink-800 border border-gold/30 p-5 space-y-3">
        <h3 className="text-gold font-semibold text-sm pb-2">Developer Info</h3>
        <p className="text-ink-100 text-sm">
          Website designed & developed by <span className="text-gold font-bold">{config.developer.name}</span>
        </p>
        <div className="flex flex-col gap-1 text-ink-200 text-sm">
          <span>📧 {config.developer.email}</span>
          <span>📱 {config.developer.phone}</span>
        </div>
        <p className="text-ink-300 text-xs">
          Want to add more features, change design, or need a new website? Feel free to reach out!
        </p>
      </motion.div>
    </div>
  );
}
