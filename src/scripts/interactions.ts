const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const bar = document.getElementById('scroll-progress');
function updateProgress() {
  if (!bar) return;
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  bar.style.width = (isFinite(pct) ? pct : 0) + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.rail-nav a, .mobile-bar a'));
const currentPath = window.location.pathname;

// A nav href is same-page-navigable only if it's a bare "#..." hash, or
// "path#hash" where path matches the current page. Anything else is a
// normal cross-page link — querySelector must never see a raw href
// starting with "/", which is not a valid CSS selector and throws.
function sameHashTarget(href: string): Element | null {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return null;
  const path = href.slice(0, hashIndex) || '/';
  if (path !== currentPath) return null;
  const hash = href.slice(hashIndex);
  return hash.length > 1 ? document.querySelector(hash) : null;
}

const sections = navLinks
  .map((a) => sameHashTarget(a.getAttribute('href') ?? ''))
  .filter((el): el is Element => el !== null);

function updateActive() {
  const pos = window.scrollY + 120;
  let current: Element | undefined = sections[0];
  sections.forEach((s) => {
    if ((s as HTMLElement).offsetTop <= pos) current = s;
  });
  navLinks.forEach((a) => {
    const href = a.getAttribute('href') ?? '';
    const hashIndex = href.indexOf('#');
    const linkPath = hashIndex === -1 ? href : href.slice(0, hashIndex) || '/';
    const isCurrentPage = linkPath.replace(/\/+$/, '') === currentPath.replace(/\/+$/, '') || (linkPath === '/' && currentPath === '/');
    if (hashIndex === -1) {
      a.classList.toggle('active', isCurrentPage);
    } else {
      a.classList.toggle('active', sameHashTarget(href) === current && current !== undefined);
    }
  });
}
document.addEventListener('scroll', updateActive, { passive: true });
window.addEventListener('load', updateActive);
window.addEventListener('resize', updateActive);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(updateActive);
}
updateActive();
setTimeout(updateActive, 300);

if (!reduced && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.cap, .case, .g-card, .motion-reveal');
  targets.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  targets.forEach((el) => io.observe(el));
}

// The homepage borrows Allo Society's sense of depth while keeping WMB's
// editorial layout. Motion is driven through custom properties so component
// transforms remain composable and reduced-motion visitors get a still page.
if (!reduced) {
  const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-x], [data-parallax-y]'));
  let scrollFrame: number | null = null;

  function updateParallax() {
    const viewportCenter = window.innerHeight / 2;
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < -160 || rect.top > window.innerHeight + 160) return;
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewportCenter) / window.innerHeight));
      const xStrength = Number(item.dataset.parallaxX ?? 0);
      const yStrength = Number(item.dataset.parallaxY ?? 0);
      item.style.setProperty('--parallax-x', `${progress * xStrength * 34}px`);
      item.style.setProperty('--parallax-y', `${progress * yStrength * 34}px`);
    });
    scrollFrame = null;
  }

  function requestParallax() {
    if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateParallax);
  }

  document.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax);
  updateParallax();

  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', `${y * -5}deg`);
        card.style.setProperty('--tilt-y', `${x * 5}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });

    document.querySelectorAll<HTMLElement>('.pointer-scene').forEach((scene) => {
      const depthItems = Array.from(scene.querySelectorAll<HTMLElement>('[data-depth]'));
      scene.addEventListener('pointermove', (event) => {
        const rect = scene.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        depthItems.forEach((item) => {
          const depth = Number(item.dataset.depth ?? 1);
          item.style.translate = `${x * depth * 14}px ${y * depth * 14}px`;
        });
      });
      scene.addEventListener('pointerleave', () => depthItems.forEach((item) => { item.style.translate = '0 0'; }));
    });
  }
}

document.querySelectorAll<HTMLImageElement>('.thumb-frame img').forEach((img) => {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => img.classList.add('loaded'));
  }
});

navLinks.forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = sameHashTarget(a.getAttribute('href') ?? '');
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
});
