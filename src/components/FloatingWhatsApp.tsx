import { useState } from 'react';
import { config } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ShoppingBag, Phone } from 'lucide-react';

const WA = config.contact.whatsapp;

const quickMessages = [
  { label: 'Place an Order',  icon: ShoppingBag, text: 'Hi Shree Manrang! I would like to place an order. Can you help me?' },
  { label: 'Custom Design',   icon: MessageCircle, text: 'Hi! I have a custom print idea. Can you help me create it?' },
  { label: 'Bulk / Corporate',icon: ShoppingBag, text: 'Hi! I need bulk printing for my team/company. Please share pricing.' },
  { label: 'Call Us',         icon: Phone, text: null },
];

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  const handleClick = (text: string | null) => {
    if (!text) {
      window.location.href = 'tel:+' + config.contact.whatsapp;
      return;
    }
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank');
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Quick-message options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex flex-col gap-2 items-end"
          >
            {/* Label bubble */}
            <div className="bg-ink-700 border border-ink-500 px-4 py-2 text-ink-50 text-xs tracking-wider uppercase font-semibold">
              How can we help?
            </div>

            {quickMessages.map((msg, i) => (
              <motion.button
                key={msg.label}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleClick(msg.text)}
                className="flex items-center gap-3 bg-ink-800 border border-ink-500 hover:border-green-400 hover:bg-green-900/20 px-4 py-3 text-ink-50 text-sm font-medium transition-all duration-200 group"
              >
                <msg.icon size={14} className="text-green-400 shrink-0" />
                {msg.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp button */}
      <div className="relative">
        {/* Pulse rings */}
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-ping" style={{ animationDelay: '0.3s' }} />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen(p => !p)}
          className="relative w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-900/50 transition-colors duration-200"
          aria-label="Chat on WhatsApp"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} className="text-white" />
              </motion.div>
            ) : (
              <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle size={24} className="text-white" fill="white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Tooltip label when closed */}
      <AnimatePresence>
        {!open && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-16 bottom-3 bg-ink-800 border border-green-500/30 text-green-300 text-xs px-3 py-1.5 whitespace-nowrap pointer-events-none font-medium"
          >
            Chat with us
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
