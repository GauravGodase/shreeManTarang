import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAdminStore } from '../store/useAdminStore';
import { config } from '../config';

const WHATSAPP_NUMBER = config.contact.whatsapp;

function buildWhatsAppMessage(
  items: ReturnType<typeof useStore.getState>['cartItems'],
  total: number
): string {
  const lines = items.map(
    (i) =>
      `- ${i.product.name} x${i.quantity} (Size: ${i.size}, Colour: ${i.color.name}) - Rs.${(i.product.price * i.quantity).toLocaleString()}`
  );
  const shipping = total >= 1499 ? 'FREE' : 'Rs.99';
  const grandTotal = total + (total >= 1499 ? 0 : 99);

  return (
    `Hi Shree Manrang! I would like to place the following order:\n\n` +
    lines.join('\n') +
    `\n\nSubtotal: Rs.${total.toLocaleString()}\nShipping: ${shipping}\nTotal: Rs.${grandTotal.toLocaleString()}\n\nPlease confirm my order. Thank you!`
  );
}

export default function CartSidebar() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } =
    useStore();
  const addOrder = useAdminStore((s) => s.addOrder);

  const total = cartTotal();

  const handleWhatsAppCheckout = () => {
    const shipping = total >= 1499 ? 0 : 99;
    // Save order to admin panel
    addOrder(
      cartItems.map((i) => ({
        productId:    i.product.id,
        productName:  i.product.name,
        productImage: i.product.images[0],
        size:         i.size,
        colorName:    i.color.name,
        quantity:     i.quantity,
        price:        i.product.price,
      })),
      total,
      shipping
    );
    const message = buildWhatsAppMessage(cartItems, total);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-ink-800 border-l border-ink-600 flex flex-col shadow-dark-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink-600">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="font-display text-xl font-bold text-ink-50">Your Cart</h2>
                {cartItems.length > 0 && (
                  <span className="bg-gold text-ink-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-ink-300 hover:text-red-400 transition-colors duration-200 text-xs tracking-wider uppercase"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-1.5 text-ink-200 hover:text-gold transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
              <AnimatePresence>
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-64 gap-4"
                  >
                    <ShoppingBag size={48} className="text-ink-300" strokeWidth={1} />
                    <p className="text-ink-100 text-sm tracking-wider uppercase">
                      Your cart is empty
                    </p>
                    <button onClick={closeCart} className="btn-outline-gold text-xs">
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}-${item.color.name}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 p-3 bg-ink-700 border border-ink-600 hover:border-ink-400 transition-colors duration-200"
                    >
                      <div
                        className="w-20 h-20 flex-shrink-0 bg-ink-600 overflow-hidden"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink-50 font-semibold text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-ink-200 text-xs mt-0.5">
                          {item.size} · {item.color.name}
                        </p>
                        <p className="text-gold font-bold text-sm mt-1">
                          ₹{item.product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-ink-500">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color.name,
                                  item.quantity - 1
                                )
                              }
                              className="px-2 py-1 text-ink-200 hover:text-gold transition-colors duration-200"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 py-1 text-ink-50 text-xs font-medium border-x border-ink-500 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.color.name,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 py-1 text-ink-200 hover:text-gold transition-colors duration-200"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.size, item.color.name)
                            }
                            className="text-ink-200 hover:text-red-400 transition-colors duration-200"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-ink-600 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-100 tracking-wider uppercase font-medium">Subtotal</span>
                  <span className="text-ink-50 font-semibold">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-100 tracking-wider uppercase font-medium">Shipping</span>
                  <span className="text-green-400 text-xs font-medium">
                    {total >= 1499 ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="h-px bg-ink-600" />
                <div className="flex items-center justify-between">
                  <span className="text-ink-100 font-semibold tracking-wider uppercase text-sm">
                    Total
                  </span>
                  <span className="font-display text-xl font-bold text-gold">
                    ₹{(total + (total >= 1499 ? 0 : 99)).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 text-xs tracking-widest uppercase transition-colors duration-200"
                >
                  <MessageCircle size={15} />
                  Order on WhatsApp
                </button>
                <p className="text-center text-xs text-ink-200">
                  Tap to send your order to Shree Manrang on WhatsApp. We'll confirm &amp; arrange payment.
                </p>
                {total < 1499 && (
                  <p className="text-center text-xs text-ink-300">
                    Add ₹{(1499 - total).toLocaleString()} more for free shipping
                  </p>
                )}
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
