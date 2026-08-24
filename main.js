// =====================================================
//  LogiTech - Main JavaScript
// =====================================================

// Helper to get correct 404 page URL depending on current path
function get404Url() {
  const path = window.location.pathname;
  if (path.includes('/html/')) {
    return '404.html';
  }
  return '404.html';
}

// ---- Navbar scroll behavior ----
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ---- Global Mobile Navigation Handler ----
function initMobileNavigation() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);

    newHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = newHamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      newHamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !newHamburger.contains(e.target)) {
        newHamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        newHamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        newHamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        newHamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileNavigation);
} else {
  initMobileNavigation();
}

// ---- Scroll Reveal Animation ----
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Feature Items Interaction ----
const featureItems = document.querySelectorAll('.feature-item');
featureItems.forEach(item => {
  item.addEventListener('click', () => {
    featureItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

// ---- Animated Counters ----
function animateCounter(el, target, suffix = '', duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
    }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

const statsSection = document.getElementById('stats');
if (statsSection) {
  let animated = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      const statNums = document.querySelectorAll('.stat-num');
      const targets = [12, 500, 60, 98];
      const suffixes = ['K+', '+', '+', '%'];
      statNums.forEach((el, i) => {
        el.textContent = '0';
        animateCounter(el, targets[i], suffixes[i]);
      });
    }
  }, { threshold: 0.3 });
  statsObserver.observe(statsSection);
}

// ---- Newsletter form ----
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    if (input && input.value) {
      const btn = document.getElementById('newsletter-submit');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Subscribed!';
        btn.style.background = '#16a34a';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          input.value = '';
        }, 3000);
      }
    }
  });
}

// ---- Smooth anchor scrolling for valid in-page targets ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.length > 1) {
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      } catch (err) {
        // invalid selector
      }
    }
    // If it's a dead '#' link or not found, navigate to 404
    if (href === '#' || href === '') {
      e.preventDefault();
      window.location.href = get404Url();
    }
  });
});

// ---- Generic Metric Counters ----
const metricCards = document.querySelectorAll('.metric-number[data-target]');
if (metricCards.length) {
  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        let start = 0;
        const duration = 1800;
        const steps = 50;
        const increment = target / steps;
        const stepTime = duration / steps;
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          entry.target.textContent = prefix + (isDecimal ? start.toFixed(1) : Math.floor(start).toLocaleString()) + suffix;
        }, stepTime);
      }
    });
  }, { threshold: 0.2 });
  metricCards.forEach(card => metricObserver.observe(card));
}

// ---- Slide In Observer ----
const slideEls = document.querySelectorAll('.slide-left, .slide-right, .slide-up');
if (slideEls.length) {
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        slideObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  slideEls.forEach(el => slideObserver.observe(el));
}

// ---- FAQ Accordion Toggle ----
document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
});
