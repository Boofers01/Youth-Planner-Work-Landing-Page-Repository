// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

// Navbar: fade from transparent to solid white once the user scrolls
// past the top of the landing page hero.
const navbar = document.querySelector('.navbar');
if (navbar && document.body.classList.contains('home')) {
  const setScrolled = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });
}

// Section-to-section scroll navigation. Any element with the
// .snap-section class becomes a stop — add/remove/reorder sections in
// the markup and this keeps working with no code changes needed here.
(function () {
  const getSections = () => Array.from(document.querySelectorAll('.snap-section'));

  // Whichever section's own midpoint is closest to the viewport's midpoint
  // is "current". Using live, viewport-relative positions (instead of
  // offsetTop, which is relative to the nearest positioned ancestor and can
  // silently give the wrong number depending on nesting) keeps this correct
  // for every section regardless of alignment (start- or center-snapped).
  function currentIndex(sections) {
    const viewportMid = window.innerHeight / 2;
    let idx = 0;
    let bestDist = Infinity;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      const dist = Math.abs((rect.top + rect.bottom) / 2 - viewportMid);
      if (dist < bestDist) {
        bestDist = dist;
        idx = i;
      }
    });
    return idx;
  }

  function goToSection(i) {
    const sections = getSections();
    if (!sections.length) return;
    const clamped = Math.max(0, Math.min(sections.length - 1, i));
    const target = sections[clamped];
    // Match whatever alignment the target actually snaps to (start/center/
    // end), so the jump lands in the right spot instead of assuming "start".
    const align = getComputedStyle(target).scrollSnapAlign;
    const block = align === 'center' ? 'center' : align === 'end' ? 'end' : 'start';
    target.scrollIntoView({ behavior: 'smooth', block });
  }

  document.addEventListener('keydown', (e) => {
    const sections = getSections();
    if (!sections.length) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goToSection(currentIndex(sections) + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToSection(currentIndex(sections) - 1);
    }
  });

  const scrollBtn = document.getElementById('heroScrollDown');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => goToSection(currentIndex(getSections()) + 1));
  }
})();

// Showcase GIFs: if a gif hasn't been dropped in yet, show a friendly
// placeholder instead of a broken image icon.
document.querySelectorAll('.showcase-media img').forEach(img => {
  img.addEventListener('error', () => {
    const wrap = img.parentElement;
    const name = img.getAttribute('src').split('/').pop();
    wrap.classList.add('missing');
    wrap.innerHTML = '<span>Add <code>' + name + '</code> to Images/photos/Showcase/</span>';
  }, { once: true });
});

// Image carousel
const track = document.querySelector('.carousel-track');
if (track) {
  const slides = Array.from(track.children);
  const dotsWrap = document.querySelector('.carousel-dots');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + index * 100 + '%)';
    dots.forEach((d, j) => d.classList.toggle('active', j === index));
    restart();
  }
  document.querySelector('.carousel-btn.prev').addEventListener('click', () => go(index - 1));
  document.querySelector('.carousel-btn.next').addEventListener('click', () => go(index + 1));

  // Swipe support
  let startX = null;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  // Auto-advance
  let timer;
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 5000);
  }
  go(0);
}
