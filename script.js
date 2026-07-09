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

// Showcase GIFs: if a gif hasn't been dropped in yet, show a friendly
// placeholder instead of a broken image icon.
document.querySelectorAll('.showcase-media img').forEach(img => {
  img.addEventListener('error', () => {
    const wrap = img.parentElement;
    const name = img.getAttribute('src').split('/').pop();
    wrap.classList.add('missing');
    wrap.innerHTML = '<span>Add <code>' + name + '</code> to Images/photos/Gifs/</span>';
  }, { once: true });
});

// Lightbox: click a carousel slide or showcase image to view it enlarged.
// Shared by the carousel and the "Watch It Work" showcase cards below.
const lightbox = document.getElementById('lightbox');
let openLightbox = () => {};
let closeLightbox = () => {};
if (lightbox) {
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  let onClose = null;

  openLightbox = (img, onCloseCallback) => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    onClose = onCloseCallback || null;
  };
  closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (onClose) { onClose(); onClose = null; }
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  // Showcase cards (Schedule Maker gif, Supplies Tracker, etc.) — no
  // auto-advance to pause, so no close callback needed.
  document.querySelectorAll('.showcase-media img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img));
  });
}

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

  // Carousel slides use the shared lightbox (see above), pausing
  // auto-advance while open and resuming it on close.
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img) {
      img.addEventListener('click', () => {
        clearInterval(timer);
        openLightbox(img, restart);
      });
    }
  });
}
