import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useMediaQuery } from '@/hooks/use-media-query';

// Ruixen-style atmospheric footer glow (PRD section 22), adapted for WMB:
// the interaction logic is real (scroll-linked reveal, blurred SVG bars),
// the content is not — this component renders zero text and zero links,
// the actual footer (Footer.astro) is untouched, real, and fully static.
// This is a purely decorative, pointer-events-none overlay sitting behind
// it, so it can never block a click or trap scroll regardless of z-index.
export function GradientFooterEffect() {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { scrollYProgress } = useScroll();

  const maxHeight = isMobile ? 90 : 160;
  const height = useTransform(scrollYProgress, [0.85, 1], [16, maxHeight]);
  const opacity = useTransform(scrollYProgress, [0.85, 1], [0, 0.6]);

  if (reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0"
        style={{ height: isMobile ? 40 : 60, opacity: 0.25 }}
      >
        <GlowBars />
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0"
      style={{ height, opacity }}
    >
      <GlowBars />
    </motion.div>
  );
}

function GlowBars() {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      className="h-full w-full"
      focusable="false"
    >
      <defs>
        <filter id="wmb-footer-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
        <linearGradient id="wmb-footer-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1200" height="200" fill="url(#wmb-footer-fade)" />
      <ellipse cx="200" cy="200" rx="260" ry="90" fill="var(--accent)" opacity="0.18" filter="url(#wmb-footer-blur)" />
      <ellipse cx="900" cy="200" rx="300" ry="100" fill="var(--accent-2)" opacity="0.12" filter="url(#wmb-footer-blur)" />
    </svg>
  );
}
