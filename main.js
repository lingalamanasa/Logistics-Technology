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

// ---- Mobile menu toggle ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
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
      clearInterval(timer);
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

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
if (sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}` ||
              link.getAttribute('href') === `${entry.target.id}.html` ||
              link.getAttribute('href') === `html/${entry.target.id}.html`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => navObserver.observe(s));
}
