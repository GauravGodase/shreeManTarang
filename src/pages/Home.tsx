import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, RotateCcw, Star, MessageCircle, Phone } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import { config, waCustomOrder } from '../config';
import { useAdminStore } from '../store/useAdminStore';

function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: v => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, to]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

const WHATSAPP_NUMBER = config.contact.whatsapp;
const WHATSAPP_CUSTOM = waCustomOrder;



export default function Home() {
  const products = useAdminStore((s) => s.products);
  const featuredProducts = products.filter((p) => p.isBestseller || p.isNew).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main>
      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink-900"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/8 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-5xl mx-auto px-4"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 border border-gold/40 text-gold text-xs tracking-[0.3em] uppercase px-5 py-2 mb-8"
          >
            <Zap size={10} fill="currentColor" />
            Mahad, Raigad · Custom Prints Since Day One
            <Zap size={10} fill="currentColor" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-ink-50 leading-none tracking-tight mb-6"
          >
            YOUR DESIGN
            <br />
            <span className="relative inline-block">
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                OUR CRAFT
              </span>
              <motion.span
                className="absolute bottom-1 left-0 h-1 bg-gold-gradient"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-ink-100 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
          >
            Shree Manrang specializes in premium T-shirt printing, sublimation, DTF prints,
            and personalized gifts. Quality that speaks for itself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Link to="/shop" className="btn-gold text-sm px-8 py-4 group">
              Browse Catalogue
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={WHATSAPP_CUSTOM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-4 text-xs tracking-widest uppercase transition-colors duration-200"
            >
              <MessageCircle size={14} />
              Custom Order on WhatsApp
            </a>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto"
          >
            {[
              { to: 500, suffix: '+', label: 'Happy Clients' },
              { to: 5,   suffix: '+', label: 'Print Techniques' },
              { to: 24,  suffix: 'h', label: 'Quick Turnaround' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-black text-gold">
                  <AnimatedCounter to={s.to} suffix={s.suffix} />
                </p>
                <p className="text-ink-100 text-xs tracking-wider uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-200"
        >
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </section>

      {/* ─── Services / Categories Strip ─── */}
      <section className="py-16 bg-ink-800 border-y border-ink-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">— What We Do</p>
            <h2 className="section-title text-2xl md:text-3xl">Our Printing Services</h2>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="flex flex-col items-center gap-3 p-4 border border-ink-600 hover:border-gold hover:bg-gold/5 transition-all duration-300 group text-center"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-ink-100 text-xs tracking-[0.1em] uppercase font-medium group-hover:text-gold transition-colors duration-300 leading-tight">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="py-24 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
                — Top Sellers
              </p>
              <h2 className="section-title">Most Ordered Prints</h2>
            </div>
            <Link to="/shop" className="btn-outline-gold text-xs self-start md:self-auto">
              View All <ArrowRight size={12} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 bg-ink-800 border-y border-ink-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">— Simple Process</p>
            <h2 className="section-title">How to Order</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '🛍️', title: 'Browse & Pick', desc: 'Choose a product from our catalogue or tell us your custom idea.' },
              { step: '02', icon: '💬', title: 'WhatsApp Us', desc: 'Send your design, size, and quantity details on WhatsApp.' },
              { step: '03', icon: '🎨', title: 'We Print', desc: 'Our team prints your order with premium DTF or sublimation technique.' },
              { step: '04', icon: '📦', title: 'Delivered', desc: 'Packed carefully and delivered to your doorstep across India.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center gap-4"
              >
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-50%] h-px bg-gold/20" />
                )}
                <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex flex-col items-center justify-center relative">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="absolute -top-2 -right-2 bg-gold text-ink-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-ink-50 font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-ink-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href={WHATSAPP_CUSTOM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 text-sm tracking-widest uppercase transition-colors duration-200"
            >
              <MessageCircle size={16} />
              Start Your Custom Order
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── Fullwidth Promo Banner ─── */}
      <section className="relative py-32 overflow-hidden bg-ink-900">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(212,175,55,0.1) 40px, rgba(212,175,55,0.1) 41px)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-6">Bulk Orders Welcome</p>
            <h2 className="font-display text-4xl md:text-6xl font-black text-ink-50 mb-6 leading-tight">
              CORPORATE & TEAM
              <br />
              <span className="bg-gold-gradient bg-clip-text text-transparent">
                BULK PRINTING
              </span>
            </h2>
            <p className="text-ink-100 mb-3 max-w-md mx-auto">
              Special pricing for orders of 10+ pieces. Companies, schools, events, cricket teams — we print for all.
            </p>
            <p className="text-gold text-sm font-semibold mb-8">
              Min. 10 pcs · Custom logo + name · Pan India delivery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%27d%20like%20to%20enquire%20about%20bulk%20printing%20for%20my%20team%2Fcompany.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 text-xs tracking-widest uppercase transition-colors duration-200"
              >
                <MessageCircle size={14} />
                Get Bulk Quote
              </a>
              <a
                href={"tel:+" + WHATSAPP_NUMBER}
                className="inline-flex items-center gap-2 border border-gold text-gold font-semibold px-8 py-4 text-xs tracking-widest uppercase hover:bg-gold hover:text-ink-900 transition-all duration-200"
              >
                <Phone size={14} />
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── New Arrivals ─── */}
      <section className="py-24 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">— Just Added</p>
            <h2 className="section-title">New Arrivals</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Us ─── */}
      <section className="py-20 bg-ink-800 border-y border-ink-700">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Premium Quality', desc: 'DTF & sublimation prints that last 50+ washes' },
              { icon: Truck, title: 'Fast Delivery', desc: '3–5 days delivery across India' },
              { icon: RotateCcw, title: 'Easy Returns', desc: 'Reprint guarantee if quality falls short' },
              { icon: Star, title: 'Trusted by 500+', desc: '4.9★ rated by customers across Maharashtra' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4 p-6 border border-ink-600 hover:border-gold/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <Icon size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-ink-50 font-semibold text-sm tracking-wide">{title}</h3>
                  <p className="text-ink-400 text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">— Customer Love</p>
            <h2 className="section-title">What Our Clients Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rohan S.',
                text: "Ordered 50 sublimation jerseys for our cricket team. Delivery was on time and the print quality was excellent. Everyone loved it!",
                rating: 5,
                product: 'Team Jersey Order',
                location: 'Pune',
              },
              {
                name: 'Priya M.',
                text: "Got a couple photo T-shirt as an anniversary gift. Yash bhai took the order on WhatsApp, the print came out super crisp. Highly recommend!",
                rating: 5,
                product: 'Couple Photo T-Shirt',
                location: 'Mahad',
              },
              {
                name: 'Amol K.',
                text: "We got our company t-shirts done for 30 employees. Amazing quality and very reasonable pricing for bulk. Will order again for next year's event.",
                rating: 5,
                product: 'Corporate Bulk Order',
                location: 'Raigad',
              },
            ].map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-ink-800 border border-ink-600 hover:border-gold/40 transition-colors duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={12} className="text-gold" fill="currentColor" />
                  ))}
                </div>
                <p className="text-ink-200 text-sm leading-relaxed mb-4">"{review.text}"</p>
                <div className="flex items-center justify-between border-t border-ink-600 pt-4">
                  <div>
                    <p className="text-ink-50 font-semibold text-sm">{review.name}</p>
                    <p className="text-ink-200 text-xs mt-0.5">{review.location} · Verified Buyer</p>
                  </div>
                  <p className="text-gold text-xs tracking-wider text-right max-w-[8rem]">{review.product}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact / WhatsApp CTA ─── */}
      <section className="py-20 bg-gradient-to-b from-ink-800 to-ink-900 border-t border-ink-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">
              Get In Touch
            </p>
            <h2 className="section-title mb-4">Have a Custom Idea?</h2>
            <p className="text-ink-100 mb-8 max-w-md mx-auto">
              T-shirt design, team jersey, birthday gift, corporate order — tell us your requirement on WhatsApp and we'll get back to you within 1 hour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href={WHATSAPP_CUSTOM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 text-sm tracking-widest uppercase transition-colors duration-200"
              >
                <MessageCircle size={16} />
                WhatsApp: 8087632982
              </a>
              <a
                href={"mailto:" + config.contact.email}
                className="btn-outline-gold px-8 py-4 text-sm"
              >
                Email Us
              </a>
            </div>
            <p className="text-ink-200 text-xs mt-6">
              {config.store.location}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
