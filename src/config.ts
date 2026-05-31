/**
 * Central config — reads from .env (VITE_ variables).
 * Import this instead of using import.meta.env directly in components.
 */

export const config = {
  store: {
    name:     import.meta.env.VITE_STORE_NAME     ?? 'Shree Manrang',
    tagline:  import.meta.env.VITE_STORE_TAGLINE  ?? 'Custom Prints',
    owner:    import.meta.env.VITE_OWNER_NAME     ?? 'Yash Golambade',
    location: import.meta.env.VITE_STORE_LOCATION ?? 'Mahad, Raigad, Maharashtra',
  },
  contact: {
    whatsapp:     import.meta.env.VITE_WHATSAPP_NUMBER ?? '918087632982',
    phoneDisplay: import.meta.env.VITE_PHONE_DISPLAY   ?? '+91 8087632982',
    email:        import.meta.env.VITE_STORE_EMAIL      ?? 'shreemanrang@gmail.com',
  },
  admin: {
    email:    import.meta.env.VITE_ADMIN_EMAIL    ?? 'shreemanrang@gmail.com',
    password: import.meta.env.VITE_ADMIN_PASSWORD ?? 'shreemanrang1234',
  },
  developer: {
    name:    import.meta.env.VITE_DEV_NAME    ?? 'Gaurav Godase',
    email:   import.meta.env.VITE_DEV_EMAIL   ?? 'Gauravgodase21@gmail.com',
    phone:   import.meta.env.VITE_DEV_PHONE   ?? '8600965456',
    tagline: import.meta.env.VITE_DEV_TAGLINE ?? 'Want a professional website at minimum price?',
  },
} as const;

/** Pre-built WhatsApp URL helpers */
export const wa = (message: string) =>
  `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(message)}`;

export const waCustomOrder = wa(
  `Hi ${config.store.name}! I would like to place a custom print order. Can you help?`
);
export const waBulkOrder = wa(
  `Hi! I need bulk printing for my team/company. Please share pricing.`
);
