import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

export interface WorkPreviewItem {
  id: string;
  title: string;
  organisation: string;
  role?: string;
  summary: string;
  categories: string[];
  status: 'delivered' | 'ongoing';
  image?: { src: string; alt: string };
}

interface Props {
  items: WorkPreviewItem[];
}

// One hydrated island manages every card's Preview trigger, rather than 18
// separate islands, one per Work card. The archive grid itself stays plain
// static <a> elements (PRD requires every important route stay crawlable
// without JS) — this component only listens for clicks on the small
// Preview button layered on top of each card and shows a shared dialog.
// PRD section 24.1: the preview never replaces the URL, "View Work" always
// links to the real page.
export function WorkPreviewManager({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const isDesktop = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-preview-trigger]');
      if (!target) return;
      e.preventDefault();
      const id = target.dataset.previewTrigger;
      if (id) setOpenId(id);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const active = items.find((item) => item.id === openId) ?? null;
  const open = active !== null;

  const body = active && (
    <>
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-text-faint">
        <span>{active.categories.join(', ')}</span>
        <span aria-hidden="true">&middot;</span>
        <span className={active.status === 'delivered' ? 'text-accent-2' : 'text-[#8A6512]'}>
          {active.status === 'delivered' ? 'Delivered' : 'Ongoing'}
        </span>
      </div>
      {active.image && (
        <img
          src={active.image.src}
          alt={active.image.alt}
          className="mt-3 aspect-video w-full rounded-lg object-cover"
          loading="lazy"
        />
      )}
      {active.role && <p className="mt-3 text-sm text-text-dim">{active.role}</p>}
      <p className="mt-2 text-sm leading-relaxed text-text-dim">{active.summary}</p>
      <Button className="mt-4 w-fit" nativeButton={false} render={<a href={`/work/${active.id}/`} />}>
        View Work &rarr;
      </Button>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(next) => !next && setOpenId(null)}>
        <DialogContent className="sm:max-w-md">
          {active && (
            <DialogHeader>
              <DialogTitle className="font-serif text-xl italic">{active.title}</DialogTitle>
              <DialogDescription>{active.organisation}</DialogDescription>
            </DialogHeader>
          )}
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(next) => !next && setOpenId(null)}>
      <DrawerContent>
        {active && (
          <DrawerHeader>
            <DrawerTitle className="font-serif text-xl italic">{active.title}</DrawerTitle>
            <DrawerDescription>{active.organisation}</DrawerDescription>
          </DrawerHeader>
        )}
        <div className="px-4 pb-4">{body}</div>
      </DrawerContent>
    </Drawer>
  );
}
