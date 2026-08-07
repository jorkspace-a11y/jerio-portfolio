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
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute('href') ?? ''))
  .filter((el): el is Element => el !== null);

function updateActive() {
  const pos = window.scrollY + 120;
  let current: Element | undefined = sections[0];
  sections.forEach((s) => {
    if ((s as HTMLElement).offsetTop <= pos) current = s;
  });
  navLinks.forEach((a) => {
    a.classList.toggle('active', document.querySelector(a.getAttribute('href') ?? '') === current);
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
  const targets = document.querySelectorAll('.cap, .case, .g-card');
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
    const target = document.querySelector(a.getAttribute('href') ?? '');
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
});
