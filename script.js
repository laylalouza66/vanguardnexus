/* =========================================================
   Vanguard Nexus — UI Interactions
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 40) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
    lastScrollY = scrollY;
  }

  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    menuToggle.classList.remove('menu-toggle--open');
    navLinks.classList.remove('nav-links--open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('nav-links--open');
    menuToggle.classList.toggle('menu-toggle--open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const headerOffset = 72;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll reveal animations ---------- */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
          setTimeout(function () {
            entry.target.classList.add('reveal--visible');
          }, delay * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  /* ---------- Animated number counters ---------- */
  function animateCounter(element) {
    const target = parseFloat(element.dataset.countTo);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      let displayValue;
      if (isDecimal) {
        displayValue = current.toFixed(1);
      } else {
        displayValue = Math.floor(current).toLocaleString();
      }

      element.textContent = prefix + displayValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const counterElements = document.querySelectorAll('[data-count-to]');
  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counterElements.forEach(function (el) {
      const target = parseFloat(el.dataset.countTo);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isDecimal = target % 1 !== 0;
      el.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
    });
  }

  /* ---------- Modal system ---------- */
  const modal = document.getElementById('infoModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalDismiss = document.getElementById('modalDismiss');
  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      modalDismiss.focus();
    }, 100);
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  document.querySelectorAll('[data-modal-trigger]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalDismiss.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });

  /* ---------- Scroll listener (passive) ---------- */
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ---------- Active nav highlighting ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + id) {
              link.classList.add('nav-link--active');
            } else {
              link.classList.remove('nav-link--active');
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-72px 0px -50% 0px' });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }
})();
