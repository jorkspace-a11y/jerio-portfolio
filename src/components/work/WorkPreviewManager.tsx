import { useEffect, useRef, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { trackEvent } from '@/scripts/analytics';

export interface WorkPreviewItem {
  id: string;
  title: string;
  organisation: string;
  role?: string;
  summary: string;
  categories: string[];
  status: 'delivered' | 'ongoing';
  image?: { src: string; alt: string; fit?: 'contain' | 'cover' };
}

interface Props {
  items: WorkPreviewItem[];
}

const HOVER_ANALYTICS_DELAY = 500;

// P2 UI/UX Remediation, Direction B: desktop no longer opens a Dialog on
// click (PRD "no modal required for ordinary archive browsing"). This
// component now owns two different things depending on viewport:
//   - Desktop: an always-visible sticky preview panel, updated by
//     hover/focus on the static row list. Click/Enter on a row is a real
//     <a href>, it navigates directly, this component never intercepts it.
//   - Mobile: a Drawer, opened by tapping a row (intercepted, since tap
//     opens the quick preview first, not the full page).
// One island manages every row via event delegation rather than 18
// separate islands (PRD section 23).
export function WorkPreviewManager({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const hoverTimers = useRef<Map<string, number>>(new Map());
  const announcedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-work-row]'));

    const setActive = (id: string) => {
      setActiveId(id);
      if (!announcedIds.current.has(id)) {
        const t = window.setTimeout(() => {
          announcedIds.current.add(id);
          trackEvent('work_preview_open', { work: id, via: 'hover' });
        }, HOVER_ANALYTICS_DELAY);
        hoverTimers.current.set(id, t);
      }
    };
    const clearTimer = (id: string) => {
      const t = hoverTimers.current.get(id);
      if (t) window.clearTimeout(t);
    };

    const onEnter = (e: Event) => {
      const id = (e.currentTarget as HTMLElement).dataset.workRow;
      if (id) setActive(id);
    };
    const onLeave = (e: Event) => {
      const id = (e.currentTarget as HTMLElement).dataset.workRow;
      if (id) clearTimer(id);
    };
    const onFocus = (e: Event) => {
      const id = (e.currentTarget as HTMLElement).dataset.workRow;
      if (id) setActive(id);
    };
    const onClick = (e: Event) => {
      if (isDesktop) return; // real link, let it navigate
      const id = (e.currentTarget as HTMLElement).dataset.workRow;
      if (!id) return;
      e.preventDefault();
      setActiveId(id);
      setDrawerOpen(true);
      trackEvent('work_preview_open', { work: id, via: 'tap' });
    };

    rows.forEach((row) => {
      row.addEventListener('mouseenter', onEnter);
      row.addEventListener('mouseleave', onLeave);
      row.addEventListener('focus', onFocus);
      row.addEventListener('click', onClick);
    });

    return () => {
      rows.forEach((row) => {
        row.removeEventListener('mouseenter', onEnter);
        row.removeEventListener('mouseleave', onLeave);
        row.removeEventListener('focus', onFocus);
        row.removeEventListener('click', onClick);
      });
    };
  }, [isDesktop]);

  const active = items.find((item) => item.id === activeId) ?? items[0] ?? null;
  if (!active) return null;

  const meta = `${active.categories.join(', ')} · ${active.status === 'delivered' ? 'Delivered' : 'Ongoing'}`;
  const showOrg = active.organisation !== active.title;

  const media = active.image ? (
    <img
      src={active.image.src}
      alt={active.image.alt}
      className={
        active.image.fit === 'contain'
          ? 'aspect-[4/3] w-full object-contain bg-surface p-6'
          : 'aspect-[4/3] w-full object-cover'
      }
      loading="eager"
    />
  ) : (
    <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface">
      <span className="font-mono text-sm text-text-faint">{active.title}</span>
    </div>
  );

  return (
    <>
      {/* Desktop sticky preview — structural border (Direction B), no card
          shadow, no rounded corners. Hidden entirely on mobile, the Drawer
          below is mobile's preview surface instead. */}
      <div className="sticky top-6 hidden self-start border border-text lg:block">
        {media}
        <div className="p-6">
          <div className="font-mono text-2xl font-medium">{active.title}</div>
          {showOrg && <div className="mt-1 text-sm text-text-dim">{active.organisation}</div>}
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-faint">{meta}</div>
          {active.role && <p className="mt-3 text-sm text-text-dim">{active.role}</p>}
          <p className="mt-2 text-sm leading-relaxed text-text-dim">{active.summary}</p>
          <a
            href={`/work/${active.id}/`}
            className="mt-5 inline-flex items-center gap-1.5 border-t-2 border-text pt-3 font-mono text-[11px] uppercase tracking-wider text-accent no-underline transition-transform hover:translate-x-0.5"
          >
            Open project <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-mono text-xl font-medium">{active.title}</DrawerTitle>
            {showOrg && <DrawerDescription>{active.organisation}</DrawerDescription>}
          </DrawerHeader>
          <div className="px-4 pb-4">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-text-faint">{meta}</div>
            {media}
            {active.role && <p className="mt-3 text-sm text-text-dim">{active.role}</p>}
            <p className="mt-2 text-sm leading-relaxed text-text-dim">{active.summary}</p>
            <a
              href={`/work/${active.id}/`}
              className="mt-4 inline-flex items-center gap-1.5 border-t-2 border-text pt-3 font-mono text-[11px] uppercase tracking-wider text-accent no-underline"
            >
              Open project <span aria-hidden="true">↗</span>
            </a>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
