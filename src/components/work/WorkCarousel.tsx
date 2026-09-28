import { useState } from 'react';
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
  onActiveChange?: (index:number)=>void;
}
export function WorkCarousel({slides, initialIndex=0, onActiveChange}:WorkCarouselProps) {
  const [index,setIndex]=useState(Math.max(0,Math.min(initialIndex,slides.length-1)));
  const reduced=useReducedMotion();
  if(!slides.length)return null;
  const slide=slides[index];
  const goTo=(next:number)=>{const i=Math.max(0,Math.min(slides.length-1,next));setIndex(i);onActiveChange?.(i);};
  const swipe=(_:unknown,info:PanInfo)=>{if(info.offset.x < -60)goTo(index+1);else if(info.offset.x > 60)goTo(index-1);};
  return <div role="group" aria-roledescription="carousel" aria-label="Project media" tabIndex={0}
    onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();goTo(index+1);}else if(event.key==='ArrowLeft'){event.preventDefault();goTo(index-1);}}}
    className="w-full min-w-0 focus-visible:outline-2 focus-visible:outline-accent">
    <div className="overflow-hidden bg-surface">
      <motion.div key={index} drag="x" dragConstraints={{left:0,right:0}} dragElastic={.15} onDragEnd={swipe}
        initial={reduced?false:{opacity:0}} animate={{opacity:1}} transition={{duration:reduced?0:.25}} className="cursor-grab active:cursor-grabbing">
        <img src={slide.image} alt={slide.alt} draggable={false} className="aspect-[4/5] max-h-[620px] w-full object-contain" />
      </motion.div>
    </div>
    <div className="mt-4 flex items-center justify-between gap-4 text-sm">
      <p className="text-text-dim" aria-live="polite">{slide.label || slide.title || `Image ${index+1}`} <span className="ml-3 text-text-dimmer">{index+1} / {slides.length}</span></p>
      <div className="flex gap-2">
        <button type="button" aria-label="Previous" onClick={()=>goTo(index-1)} disabled={index===0} className="min-h-11 min-w-11 border border-border hover:border-text disabled:opacity-30">←</button>
        <button type="button" aria-label="Next" onClick={()=>goTo(index+1)} disabled={index===slides.length-1} className="min-h-11 min-w-11 border border-border hover:border-text disabled:opacity-30">→</button>
      </div>
    </div>
    {slide.description && <p className="mt-3 text-sm leading-relaxed text-text-dim">{slide.description}</p>}
    {slide.href && <a className="mt-3 inline-block text-sm underline" href={slide.href}>Open project ↗</a>}
  </div>;
}
