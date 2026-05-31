import { Link } from 'react-router-dom';
import { config } from '../config';
import { Mail, MapPin, ArrowRight, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = config.contact.whatsapp;

const marqueeItems = [
  'PREMIUM PRINTS',
  'T-SHIRT PRINTING',
  'CUSTOM DESIGNS',
  'SUBLIMATION PRINTS',
  'DTF PRINTING',
  'PHOTO FRAMES',
  'CORPORATE ORDERS',
  'HAND CRAFTED',
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-ink-700">
      {/* Marquee strip */}
      <div className="bg-gold overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="mx-8 text-ink-900 text-xs font-bold tracking-[0.3em] uppercase shrink-0"
            >
              {item} <span className="mx-4 opacity-50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gold-gradient rounded-full flex items-center justify-center shrink-0">
                <span className="text-ink-900 font-black text-xs">SM</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold text-ink-50 tracking-widest">
                  SHREE MANRANG
                </span>
                <span className="text-gold text-[9px] tracking-[0.2em] uppercase">
                  Custom Prints
                </span>
              </div>
            </div>
            <p className="text-ink-100 text-sm leading-relaxed">
              Premium custom printing for T-shirts, hoodies, sublimation, DTF, and more. Based in Mahad, Raigad — delivering quality prints across India.
            </p>
            {/* Contact quick links */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ink-100 hover:text-gold text-sm transition-colors duration-200 group"
              >
                <MessageCircle size={14} className="text-green-400 group-hover:text-gold shrink-0" />
                {config.contact.phoneDisplay}
              </a>
              <a
                href={`mailto:${config.contact.email}`}
                className="flex items-center gap-2 text-ink-100 hover:text-gold text-sm transition-colors duration-200"
              >
                <Mail size={14} className="text-gold shrink-0" />
                {config.contact.email}
              </a>
              <div className="flex items-start gap-2 text-ink-200 text-xs">
                <MapPin size={13} className="text-gold shrink-0 mt-0.5" />
                <span>At. Ghurupkond, Tal. Mahad,<br />Dist. Raigad, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-ink-50 font-semibold tracking-[0.2em] uppercase text-sm">
              Our Products
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'T-Shirt Printing', href: '/shop?category=tshirts' },
                { label: 'Sublimation Prints', href: '/shop?category=sublimation' },
                { label: 'DTF Prints', href: '/shop?category=dtf' },
                { label: 'Photo Frames', href: '/shop?category=frames' },
                { label: 'Custom Orders', href: '/shop?category=custom' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-ink-100 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="text-ink-50 font-semibold tracking-[0.2em] uppercase text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['About Us', 'Size Guide', 'How to Order', 'Bulk Orders', 'FAQ', 'Contact Us'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-ink-100 hover:text-gold text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* WhatsApp CTA + Newsletter */}
          <div className="space-y-6">
            {/* WhatsApp Order */}
            <div className="space-y-3">
              <h4 className="text-ink-50 font-semibold tracking-[0.2em] uppercase text-sm">
                Order on WhatsApp
              </h4>
              <p className="text-ink-100 text-sm leading-relaxed">
                Have a custom design in mind? Chat with us directly on WhatsApp for quick quotes and custom orders.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Shree%20Manrang!%20I%27d%20like%20to%20place%20a%20custom%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold tracking-widest uppercase px-5 py-3 transition-colors duration-200"
              >
                <MessageCircle size={14} />
                Chat on WhatsApp
              </a>
            </div>

            {/* Newsletter */}
            <div className="space-y-3 border-t border-ink-700 pt-5">
              <h4 className="text-ink-50 font-semibold tracking-[0.2em] uppercase text-sm">
                Stay Updated
              </h4>
              <div className="flex border border-ink-500 focus-within:border-gold transition-colors duration-300">
                <div className="p-3 text-ink-400">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent text-sm text-ink-50 placeholder-ink-400 outline-none pr-3"
                />
                <button className="px-4 bg-gold text-ink-900 hover:bg-gold-light transition-colors duration-200">
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-ink-200 text-xs">Get new design alerts. No spam.</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-ink-700 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-ink-200 text-xs">
            © 2025 Shree Manrang. All rights reserved. · {config.store.owner}, Mahad, Raigad
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((item) => (
              <a key={item} href="#"
                className="text-ink-200 hover:text-gold text-xs transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Developer Watermark */}
        <div className="mt-6 pt-5 border-t border-ink-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gold/5 border border-gold/20 px-5 py-3">
            <div className="text-center md:text-left">
              <p className="text-ink-100 text-xs">
                Designed &amp; Developed by{' '}
                <span className="text-gold font-bold">{config.developer.name}</span>
              </p>
              <p className="text-ink-300 text-[11px] mt-0.5">
                {config.developer.tagline}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a href={`mailto:${config.developer.email}`}
                className="flex items-center gap-1.5 text-ink-200 hover:text-gold text-xs transition-colors duration-200">
                <Mail size={11} />
                {config.developer.email}
              </a>
              <span className="hidden sm:block text-ink-600">·</span>
              <a href={`tel:+91${config.developer.phone}`}
                className="flex items-center gap-1.5 text-ink-200 hover:text-gold text-xs transition-colors duration-200">
                📱 {config.developer.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
