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

// =====================================================
//  Advanced Background Canvas & Network Particle Engine
// =====================================================
function initLogisticsNetworkCanvas(canvasId = 'hero-particles') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, maxDist: 140 };

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
    height = canvas.height = parent ? parent.offsetHeight : 600;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 14000);
    const particleCount = Math.max(25, Math.min(count, 70));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.25,
        color: Math.random() > 0.4 ? '#FFA5A5' : '#60A5FA',
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const time = Date.now() * 0.001;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const currentAlpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color === '#FFA5A5' 
        ? `rgba(255, 165, 165, ${Math.max(0.1, currentAlpha)})`
        : `rgba(96, 165, 250, ${Math.max(0.1, currentAlpha)})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.maxDist) {
          const mAlpha = (1 - mdist / mouse.maxDist) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 165, 165, ${mAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  
  const heroSection = canvas.closest('.hero, .page-hero') || document.body;
  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  draw();
}

// =====================================================
//  Hero Showcase Image Slider Controller
// =====================================================
function initHeroShowcaseSlider() {
  const sliderWrap = document.querySelector('.hero-slider-wrap');
  if (!sliderWrap) return;

  const slides = sliderWrap.querySelectorAll('.hero-slide');
  const dots = sliderWrap.querySelectorAll('.slider-dot');
  const prevBtn = sliderWrap.querySelector('.slider-nav-btn.prev');
  const nextBtn = sliderWrap.querySelector('.slider-nav-btn.next');
  const progressBar = sliderWrap.querySelector('.slider-progress-bar');
  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideDuration = 4500;
  let slideTimer = null;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }

    resetProgress();
  }

  function resetProgress() {
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      setTimeout(() => {
        progressBar.style.transition = `width ${slideDuration}ms linear`;
        progressBar.style.width = '100%';
      }, 30);
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    resetProgress();
    slideTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function stopAutoPlay() {
    if (slideTimer) clearInterval(slideTimer);
    if (progressBar) {
      const currentWidth = progressBar.offsetWidth;
      progressBar.style.transition = 'none';
      progressBar.style.width = `${currentWidth}px`;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide + 1);
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide - 1);
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  sliderWrap.addEventListener('mouseenter', stopAutoPlay);
  sliderWrap.addEventListener('mouseleave', startAutoPlay);

  let touchStartX = 0;
  sliderWrap.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  sliderWrap.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) showSlide(currentSlide + 1);
      else showSlide(currentSlide - 1);
      startAutoPlay();
    }
  });

  showSlide(0);
  startAutoPlay();
}

// =====================================================
//  3D Parallax Tilt Effect on Cards
// =====================================================
function initCard3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card, .feature-card, .service-card, .testimonial-card, .hero-tracker-box');
  
  if (window.matchMedia('(hover: hover) and (min-width: 992px)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
}

// =====================================================
//  Interactive Fleet & Solutions Switcher
// =====================================================
function initFleetModeSwitcher() {
  const tabBtns = document.querySelectorAll('.fleet-tab-btn');
  const tabPanes = document.querySelectorAll('.fleet-tab-pane');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(targetId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

// Global Startup Initializer
function initAllEnhancements() {
  initLogisticsNetworkCanvas('hero-particles');
  initHeroShowcaseSlider();
  initCard3DTilt();
  initFleetModeSwitcher();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllEnhancements);
} else {
  initAllEnhancements();
}


