/* ================================================
   CafeConnects - Shared JavaScript
   Navbar, Footer, Animations, Utilities
   ================================================ */

// -- Navbar ------------------------------------
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// -- Mobile Menu -------------------------------
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const close = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileClose) mobileClose.addEventListener('click', close);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });
}

// -- Scroll Reveal -----------------------------
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

// -- Counter Animation -------------------------
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = 0;
  const startTime = performance.now();
  const isFloat = String(target).includes('.');

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = start + (target - start) * eased;

    el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)).toLocaleString() + suffix;

    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, 2200, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// -- FAQ Accordion -----------------------------
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });
}

// -- Parallax ----------------------------------
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

// -- Tabs --------------------------------------
function initTabs() {
  document.querySelectorAll('.tab-group').forEach(group => {
    const tabs = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });
}

// -- Smooth Anchor Scroll ----------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 88;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// -- Toast -------------------------------------
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 32px; right: 32px; z-index: 9999;
    background: ${type === 'success' ? '#3E2723' : '#B71C1C'};
    color: #fff; padding: 16px 24px; border-radius: 12px;
    font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 500;
    box-shadow: 0 16px 48px rgba(0,0,0,0.25);
    transform: translateY(20px); opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: flex; align-items: center; gap: 10px;
    max-width: 380px;
  `;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${message}`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// -- Form Handling (Web3Forms) -----------------
function initForms() {
  const formSuccess = {
    'newsletter':        "You're subscribed! We'll keep you posted.",
    'blog-newsletter':   "You're subscribed! Great stories incoming.",
    'cafe-registration': "Registration received! We'll reach out within 48 hours.",
    'collaboration':     "Message sent! We'll get back to you within 48 hours.",
    'job-application':   "Application submitted! We review every one carefully."
  };

  document.querySelectorAll('form[data-form]').forEach(form => {
    const type    = form.dataset.form;
    const success = formSuccess[type] || "Thank you! We'll be in touch soon.";

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn      = form.querySelector('[type="submit"]');
      const original = btn.textContent;

      // Dynamically update subject for job applications to include role
      if (type === 'job-application') {
        const roleEl = form.querySelector('[name="role"]');
        const nameEl = form.querySelector('[name="full_name"]');
        const subjectEl = form.querySelector('[name="subject"]');
        if (subjectEl && roleEl && roleEl.value) {
          subjectEl.value = `Job Application — ${roleEl.value} — CafeConnects`;
        }
      }

      btn.textContent = 'Sending…';
      btn.disabled    = true;

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form)
        });
        const data = await res.json();

        if (data.success) {
          btn.textContent = '✓ Sent!';
          showToast(success);
          setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 3000);
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        btn.textContent = original;
        btn.disabled    = false;
        showToast('Something went wrong. Please email cafeconnects@blueprove.com directly.', 'error');
        console.error('Form error:', err);
      }
    });
  });
}

// -- Active Nav Link ---------------------------
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Bootstrap ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initFAQ();
  initParallax();
  initTabs();
  initSmoothScroll();
  initForms();
  setActiveNavLink();
});
