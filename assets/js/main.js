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
  });
}

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach((item) => {
  const trigger = item.querySelector('button');
  if (!trigger) return;

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = item.classList.contains('open');

    navItems.forEach((other) => other.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-item')) {
    navItems.forEach((item) => item.classList.remove('open'));
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980 && navMenu) {
    navMenu.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});
