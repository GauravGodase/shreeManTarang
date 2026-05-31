import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const messages = [
  '🎉 FREE Shipping on orders above ₹1499 — Pan India Delivery',
  '✨ New Drops Every Week — Follow us for updates',
  '🧢 Custom caps, mugs, bottles & frames — WhatsApp: 8087632982',
  '🔥 Bulk / Corporate orders? Get special pricing. Min. 10 pcs.',
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), 3500);
    return () => clearInterval(id);
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gold flex items-center justify-center h-8 px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-ink-900 text-[11px] font-bold tracking-[0.15em] uppercase text-center"
        >
          {messages[idx]}
        </motion.p>
      </AnimatePresence>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 text-ink-900/60 hover:text-ink-900 transition-colors"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
}
