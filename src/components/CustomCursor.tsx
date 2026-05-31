import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const ringX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }
    document.documentElement.style.cursor = 'none';

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        'a, button, [role="button"], input, select, textarea, label'
      );
      setHovering(!!el);
    };

    const down = () => setClicking(true);
    const up   = () => setClicking(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [mouseX, mouseY]);

  if (isTouch) return null;

  return (
    <>
      {/* Dot — snaps to cursor instantly */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: clicking ? 0.6 : 1 }}
        transition={{ duration: 0.1 }}
      >
        <div
          className={`rounded-full bg-gold transition-all duration-150 ${
            hovering ? 'w-3 h-3' : 'w-2 h-2'
          }`}
        />
      </motion.div>

      {/* Ring — lags behind with spring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: clicking ? 0.8 : hovering ? 1.6 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-8 h-8 rounded-full border border-gold/40" />
      </motion.div>
    </>
  );
}
