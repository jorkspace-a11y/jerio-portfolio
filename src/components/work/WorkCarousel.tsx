import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type PanInfo } from 'motion/react';

export interface WorkMediaSlide {
  image: string;
  alt: string;
  title?: string;
  description?: string;
  label?: string;
  href?: string;
  fit?: 'contain' | 'cover';
}

export interface WorkCarouselProps {
  slides: WorkMediaSlide[];
  initialIndex?: number;
  onActiveChange?: (index: number) => void;
}

const SWIPE_THRESHOLD = 60;
const STACK_DEPTH = 3;

// Real project media only (PRD 23.3) — this component never receives
// stock imagery, callers only pass slides built from actual Work
// media/archive data. A project with no media simply doesn't render this
// component at all, a clean text-only state beats a fake image.
export function WorkCarousel({ slides, initialIndex = 0, onActiveChange }: WorkCarouselProps) {
  const [index, setIndex] = useState(Math.min(initialIndex, slides.length - 1));
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      setIndex(clamped);
      onActiveChange?.(clamped);
    },
    [slides.length, onActiveChange]
  );

  useEffect(() => {
    onActiveChange?.(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goTo(index + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) goTo(index - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    else if (e.key === 'Enter') {
      const active = slides[index];
      if (active.href) window.location.href = active.href;
    }
  };

  if (slides.length === 0) return null;

  const visible = slides
    .map((slide, i) => ({ slide, i, offset: i - index }))
    .filter(({ offset }) => offset >= 0 && offset < STACK_DEPTH);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Project media"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative h-72 w-full max-w-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      {visible.reverse().map(({ slide, i, offset }) => {
        const isActive = offset === 0;
        const Card = (
          <motion.div
            key={i}
            drag={isActive && !reducedMotion ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={isActive ? handleDragEnd : undefined}
            initial={false}
            animate={{
              scale: 1 - offset * 0.05,
              y: offset * 10,
              rotate: reducedMotion ? 0 : offset * -2,
              opacity: 1 - offset * 0.15,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ zIndex: STACK_DEPTH - offset }}
            className={`absolute inset-0 overflow-hidden rounded-xl border border-border-soft bg-surface shadow-lg ${
              isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className={
                slide.fit === 'contain'
                  ? 'h-full w-full object-contain bg-surface p-4'
                  : 'h-full w-full object-cover'
              }
              loading={offset === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
            {(slide.label || slide.title) && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                {slide.label && (
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/80">{slide.label}</span>
                )}
                {slide.title && <p className="text-sm text-white">{slide.title}</p>}
              </div>
            )}
          </motion.div>
        );
        return Card;
      })}
      <div className="absolute -bottom-8 left-0 flex items-center gap-3 text-xs font-mono text-text-faint">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="rounded-full border border-border px-2 py-1 disabled:opacity-30"
        >
          &larr;
        </button>
        <span>{index + 1} / {slides.length}</span>
        <button
          type="button"
          aria-label="Next"
          onClick={() => goTo(index + 1)}
          disabled={index === slides.length - 1}
          className="rounded-full border border-border px-2 py-1 disabled:opacity-30"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
