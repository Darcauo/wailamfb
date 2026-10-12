const root = document.documentElement;
const savedTheme = localStorage.getItem('waila-theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
}

const themeToggle = document.querySelector('[data-theme-toggle]');
if (themeToggle) {
  const updateToggleLabel = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.textContent = isDark ? '☀' : '☾';
  };

  updateToggleLabel();

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('waila-theme', nextTheme);
    updateToggleLabel();
  });
}

const menuToggle = document.querySelector('[data-menu-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
}

const navItems = document.querySelectorAll('.nav-item');
const closeNavItems = () => {
  navItems.forEach((item) => {
    item.classList.remove('open');
    item.querySelector('button')?.setAttribute('aria-expanded', 'false');
  });
};

navItems.forEach((item) => {
  const trigger = item.querySelector('button');
  if (!trigger) return;

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = item.classList.contains('open');

    closeNavItems();
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-item')) {
    closeNavItems();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980 && navMenu) {
    navMenu.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }
});

const heroSlider = document.querySelector('[data-hero-slider]');
if (heroSlider) {
  const slides = Array.from(heroSlider.querySelectorAll('[data-hero-slide]'));
  const indicators = Array.from(heroSlider.querySelectorAll('[data-hero-indicator]'));
  const count = heroSlider.querySelector('[data-hero-count]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeSlide = 0;
  let slideTimer;

  const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
    });
    indicators.forEach((indicator, indicatorIndex) => {
      indicator.setAttribute('aria-current', String(indicatorIndex === activeSlide));
    });
    if (count) count.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  const stopTimer = () => window.clearInterval(slideTimer);
  const startTimer = () => {
    stopTimer();
    if (!prefersReducedMotion && !heroSlider.matches(':hover') && !heroSlider.contains(document.activeElement)) {
      slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 7000);
    }
  };

  heroSlider.querySelector('[data-hero-previous]')?.addEventListener('click', () => {
    showSlide(activeSlide - 1);
    startTimer();
  });
  heroSlider.querySelector('[data-hero-next]')?.addEventListener('click', () => {
    showSlide(activeSlide + 1);
    startTimer();
  });
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      showSlide(Number(indicator.dataset.heroIndicator));
      startTimer();
    });
  });
  heroSlider.addEventListener('mouseenter', stopTimer);
  heroSlider.addEventListener('mouseleave', startTimer);
  heroSlider.addEventListener('focusin', stopTimer);
  heroSlider.addEventListener('focusout', (event) => {
    if (!heroSlider.contains(event.relatedTarget)) startTimer();
  });
  heroSlider.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      showSlide(activeSlide - 1);
      startTimer();
    } else if (event.key === 'ArrowRight') {
      showSlide(activeSlide + 1);
      startTimer();
    }
  });
  showSlide(0);
  startTimer();
}

const contactForm = document.querySelector('#contact-form');
const contactSubject = contactForm?.querySelector('#subject');
if (contactSubject) {
  const packageSubjects = {
    education: 'Apply for School Fees Loan',
    business: 'Open Business Account',
    farming: 'Get Farm Support',
    equipment: 'Get Equipment Financing'
  };
  const requestedPackage = new URLSearchParams(window.location.search).get('package');
  if (requestedPackage && packageSubjects[requestedPackage]) {
    contactSubject.value = packageSubjects[requestedPackage];
  }
}
