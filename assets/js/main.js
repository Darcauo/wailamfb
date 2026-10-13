const searchPages = [
  {
    url: 'index.html',
    title: 'Home',
    keywords: 'home school fees education financing personal banking business growth farming agriculture agricultural equipment artisans community support accounts loans'
  },
  {
    url: 'personal-banking.html',
    title: 'Personal Banking',
    keywords: 'personal savings deposit convenient everyday banking personal loans financial planning customers individuals account'
  },
  {
    url: 'business-banking.html',
    title: 'Business Banking',
    keywords: 'business traders SMEs entrepreneurs growing enterprises business accounts working capital micro SME loans business growth support'
  },
  {
    url: 'corporate-banking.html',
    title: 'Corporate Banking',
    keywords: 'corporate institutions organizations corporate accounts business financing cash management strategic partnerships tailored solutions'
  },
  {
    url: 'loans.html',
    title: 'Loans',
    keywords: 'loans flexible financing personal micro SME business agricultural farming funding apply'
  },
  {
    url: 'services.html',
    title: 'Services',
    keywords: 'services education school fees make a move farming equipment savings deposit microfinance SME banking personal business loans agricultural digital alternative financial advisory'
  },
  {
    url: 'partnerships.html',
    title: 'Partnerships',
    keywords: 'partnership fintech agent agency SME ecosystem institutional partnership opportunities become partner'
  },
  {
    url: 'about.html',
    title: 'About Waila',
    keywords: 'about mission trust practical support financial inclusion community development accessible banking small business agricultural finance'
  },
  {
    url: 'contact.html',
    title: 'Contact',
    keywords: 'contact enquiries support branch location customer assistance message phone email address'
  }
];

const searchToggle = document.querySelector('[data-search-toggle]');
const searchForm = document.querySelector('[data-search-form]');
const searchInput = document.querySelector('[data-search-input]');
const searchResults = document.querySelector('[data-search-results]');
let searchIndexPromise;

const loadSearchIndex = () => {
  if (!searchIndexPromise) {
    searchIndexPromise = Promise.all(searchPages.map(async (page) => {
      try {
        const response = await fetch(page.url);
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
        const html = await response.text();
        const documentPage = new DOMParser().parseFromString(html, 'text/html');
        const summary = documentPage.querySelector('meta[name="description"]')?.content || page.keywords;
        return {
          ...page,
          title: documentPage.querySelector('h1')?.textContent.trim() || page.title,
          summary,
          text: `${documentPage.title} ${summary} ${documentPage.querySelector('main')?.textContent || documentPage.body.textContent} ${page.keywords}`
            .toLocaleLowerCase()
            .replace(/\s+/g, ' ')
            .trim()
        };
      } catch {
        return { ...page, summary: page.keywords, text: `${page.title} ${page.keywords}`.toLocaleLowerCase() };
      }
    }));
  }
  return searchIndexPromise;
};

const renderSearchResults = async (query) => {
  if (!searchResults) return;
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  searchResults.replaceChildren();
  if (!terms.length) return;

  const pages = await loadSearchIndex();
  const matches = pages
    .map((page) => {
      const matchedTerms = terms.filter((term) => page.text.includes(term)).length;
      const phraseBonus = page.text.includes(terms.join(' ')) ? 2 : 0;
      return { ...page, score: matchedTerms + phraseBonus, matchedTerms };
    })
    .filter((page) => page.matchedTerms === terms.length)
    .sort((first, second) => second.score - first.score);

  if (!matches.length) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'search-empty';
    emptyMessage.textContent = 'No matches found. Try another keyword.';
    searchResults.append(emptyMessage);
    return;
  }

  matches.slice(0, 6).forEach((page) => {
    const link = document.createElement('a');
    link.className = 'search-result';
    link.href = page.url;
    const title = document.createElement('strong');
    title.textContent = page.title;
    const description = document.createElement('span');
    description.textContent = page.summary;
    link.append(title, description);
    searchResults.append(link);
  });
};

if (searchToggle && searchForm && searchInput) {
  searchToggle.addEventListener('click', () => {
    const isOpen = !searchForm.hidden;
    searchForm.hidden = isOpen;
    searchToggle.setAttribute('aria-expanded', String(!isOpen));
    searchToggle.setAttribute('aria-label', isOpen ? 'Open site search' : 'Close site search');
    if (!isOpen) searchInput.focus();
  });

  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    renderSearchResults(searchInput.value);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-site-search]')) {
      searchForm.hidden = true;
      searchToggle.setAttribute('aria-expanded', 'false');
      searchToggle.setAttribute('aria-label', 'Open site search');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !searchForm.hidden) {
      searchForm.hidden = true;
      searchToggle.setAttribute('aria-expanded', 'false');
      searchToggle.setAttribute('aria-label', 'Open site search');
      searchToggle.focus();
    }
  });
}

const backToTop = document.querySelector('[data-back-to-top]');
if (backToTop) {
  const updateBackToTopVisibility = () => {
    backToTop.hidden = window.scrollY < 360;
  };

  window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const phoneLink = document.querySelector('.contact-information-card a[href^="tel:"]');
    if (!phoneLink) {
      window.alert('The WhatsApp contact number is unavailable. Please contact Waila by email.');
      return;
    }

    const phoneDigits = phoneLink.getAttribute('href').slice(4).replace(/\D/g, '');
    const whatsappNumber = phoneDigits.startsWith('0')
      ? `234${phoneDigits.slice(1)}`
      : phoneDigits;
    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      window.alert('The WhatsApp contact number is invalid. Please contact Waila by email.');
      return;
    }

    const formData = new FormData(contactForm);
    const enquiryFields = [
      ['Name', 'name'],
      ['Email', 'email'],
      ['Phone', 'phone'],
      ['Subject', 'subject'],
      ['Message', 'message']
    ];
    const enquiry = enquiryFields
      .map(([label, name]) => {
        const value = formData.get(name)?.toString().trim();
        return value ? `${label}: ${value}` : null;
      })
      .filter(Boolean);
    const message = `Hello Waila, I would like to make an enquiry.\n\n${enquiry.join('\n')}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.location.assign(whatsappUrl);
  });
}

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

const partnershipForm = document.querySelector('#partnership-form');
if (partnershipForm) {
  partnershipForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const phoneLink = document.querySelector('footer a[href^="tel:"]');
    if (!phoneLink) {
      window.alert('The WhatsApp contact number is unavailable. Please contact Waila by email.');
      return;
    }

    const phoneDigits = phoneLink.getAttribute('href').slice(4).replace(/\D/g, '');
    const whatsappNumber = phoneDigits.startsWith('0')
      ? `234${phoneDigits.slice(1)}`
      : phoneDigits;
    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      window.alert('The WhatsApp contact number is invalid. Please contact Waila by email.');
      return;
    }

    const formData = new FormData(partnershipForm);
    const enquiryFields = [
      ['Full Name', 'full-name'],
      ['Organization', 'organization'],
      ['Email', 'email'],
      ['Phone Number', 'phone'],
      ['Partnership Type', 'partnership-type'],
      ['Message', 'message']
    ];
    const enquiry = enquiryFields
      .map(([label, name]) => {
        const value = formData.get(name)?.toString().trim();
        return value ? `${label}: ${value}` : null;
      })
      .filter(Boolean);
    const message = `Hello Waila, I would like to make a partnership enquiry.\n\n${enquiry.join('\n')}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, '_blank');

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    } else {
      window.location.assign(whatsappUrl);
    }
  });
}
