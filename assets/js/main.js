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
