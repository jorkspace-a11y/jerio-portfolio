const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const bar = document.getElementById('scroll-progress');
let progressFrame = 0;
function updateProgress() {
  const root = document.documentElement;
  const distance = root.scrollHeight - root.clientHeight;
  if (bar) bar.style.transform = `scaleX(${distance > 0 ? root.scrollTop / distance : 0})`;
  progressFrame = 0;
}
document.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}, { passive: true });
updateProgress();

// Progressive enhancement: content remains visible without JavaScript or with reduced motion.
if (!reduced.matches) {
  const targets = document.querySelectorAll('.evidence-heading, .evidence-story, .method-intro, .exp-row, .writing-teaser-card, .studies-teaser-card, .about');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  targets.forEach(target => { target.classList.add('reveal'); observer.observe(target); });
  reduced.addEventListener('change', () => {
    if (reduced.matches) targets.forEach(target => target.classList.add('in'));
  });
}

document.querySelectorAll<HTMLImageElement>('.thumb-frame img').forEach(img => {
  if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
  else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
});
