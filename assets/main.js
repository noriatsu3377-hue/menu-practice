// Content and native FAQ remain fully available without JavaScript.
// Only hide the optional mobile shortcut when its destinations are visible.
const sticky = document.querySelector('.sticky-cta');
if (sticky && 'IntersectionObserver' in window) {
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    // Never remove a focused link from the keyboard navigation context.
    sticky.hidden = visible.size > 0 && !sticky.contains(document.activeElement);
  });
  for (const id of ['hero', 'overview']) {
    const target = document.getElementById(id);
    if (target) observer.observe(target);
  }
}

// ---- Motion: progressive enhancement only. Without JS or with reduced motion, everything is visible as-is.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce && 'IntersectionObserver' in window) {
  const root = document.documentElement;
  root.classList.add('motion');
  // Scroll progress bar
  const bar = document.createElement('div');
  bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);
  let ticking = false;
  const update = () => {
    const max = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  // Reveal on scroll with a light stagger inside each group
  const groups = 'section:not(.hero) h2, .closing, .note, .split > div > p, .worries li, .diagram li, .worksheet li, .steps li, .target-card, figure, .policy, .timeline li, .timetable li, .materials, .overview > div, details, .final .price, .final .course-name, .cta-group';
  const items = [...document.querySelectorAll(groups)];
  items.forEach(el => {
    const sibs = [...el.parentElement.children].filter(x => items.includes(x));
    el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 8) * 70}ms`);
    el.classList.add('rv');
  });
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(el => io.observe(el));
  // Anything already above the fold or jumped to via #hash shows immediately
  addEventListener('hashchange', () => items.forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }));
}
