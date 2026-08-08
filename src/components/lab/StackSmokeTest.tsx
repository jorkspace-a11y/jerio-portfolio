import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/data/taxonomy';

// First real React + Tailwind + shadcn/ui + Motion component on the site.
// Proves the Release B interactive stack actually works, end to end, using
// the real taxonomy data rather than placeholder content. Toggling a
// category is meaningless here (nothing filters), the point is the
// hydration + styling + animation pipeline, not a shipped feature.
export function StackSmokeTest() {
  const [active, setActive] = useState<string>(CATEGORIES[0]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-mono uppercase tracking-widest text-text-faint">
        React + Tailwind v4 + shadcn/ui + Motion, wired this release
      </p>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={active === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActive(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="rounded-lg border border-border-soft bg-surface px-4 py-3 text-sm text-text-dim"
      >
        Selected: <span className="text-text">{active}</span>
      </motion.div>
    </div>
  );
}
