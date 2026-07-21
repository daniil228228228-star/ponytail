(() => {
  'use strict';

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    // Below the header's 1200px collapse breakpoint (see styles.css) the nav
    // becomes an off-canvas panel that is visually collapsed (max-height: 0)
    // but its links stay in the DOM, so without this they'd remain
    // keyboard-focusable while invisible. `inert` removes them from the tab
    // order and AT tree while collapsed.
    const navCollapsesMql = window.matchMedia('(max-width: 1200px)');
    const syncNavInert = () => {
      const isOpen = mainNav.classList.contains('is-open');
      mainNav.toggleAttribute('inert', navCollapsesMql.matches && !isOpen);
    };
    navCollapsesMql.addEventListener('change', syncNavInert);
    syncNavInert();

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
      mainNav.classList.toggle('is-open', !isOpen);
      syncNavInert();
    });
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Открыть меню');
        mainNav.classList.remove('is-open');
        syncNavInert();
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-trigger').forEach((trigger) => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      item.classList.toggle('is-open', !isOpen);
      // Panel content stays in the DOM at all times for the CSS grid-row
      // collapse animation, so keep it out of the AT tree while closed.
      if (panel) panel.setAttribute('aria-hidden', String(isOpen));
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  const reduceMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Hero parallax: the 3D/blueprint layer drifts and fades slightly slower
  // than the page as the hero scrolls out, so it reads as sitting behind
  // the copy rather than pinned flat to it.
  const heroSection = document.querySelector('.hero');
  const heroBlueprint = document.querySelector('.hero-blueprint');
  if (heroSection && heroBlueprint && !reduceMotionMql.matches) {
    let parallaxTicking = false;
    const updateParallax = () => {
      const rect = heroSection.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
      heroBlueprint.style.transform = `translateY(${(progress * 48).toFixed(1)}px) scale(${(1 - progress * 0.08).toFixed(3)})`;
      heroBlueprint.style.opacity = (1 - progress * 0.6).toFixed(2);
      parallaxTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // Process spine: fills the vertical line as the section scrolls through
  // the reading line (~62% of viewport height), lighting up each step's
  // number once the fill passes it.
  const spine = document.querySelector('.spine');
  if (spine) {
    const spineItems = Array.from(spine.querySelectorAll('.spine-item'));
    let spineTicking = false;
    const updateSpine = () => {
      const rect = spine.getBoundingClientRect();
      const readingLine = window.innerHeight * 0.62;
      const trackHeight = Math.max(0, spine.clientHeight - 16);
      const raw = readingLine - rect.top - 8;
      const fillPx = Math.min(trackHeight, Math.max(0, raw));
      spine.style.setProperty('--spine-fill', `${fillPx.toFixed(1)}px`);
      spineItems.forEach((item) => {
        const passed = item.offsetTop + item.offsetHeight * 0.4 <= fillPx;
        item.classList.toggle('is-passed', passed);
      });
      spineTicking = false;
    };
    window.addEventListener('scroll', () => {
      if (!spineTicking) {
        requestAnimationFrame(updateSpine);
        spineTicking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateSpine);
    updateSpine();
  }

  // Bento tiles: cursor-tracked spotlight glow (CSS reads --mx/--my).
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.bento-tile').forEach((tile) => {
      tile.addEventListener('pointermove', (event) => {
        const rect = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        tile.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });

    // Portfolio cards: a subtle pointer-tracked 3D tilt, reset on leave.
    const TILT_MAX_DEG = 6;
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        const rx = (-py * TILT_MAX_DEG).toFixed(2);
        const ry = (px * TILT_MAX_DEG).toFixed(2);
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.015)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Hero quick-calc: hands its selection off to the real contact form
  // instead of pretending to submit on its own.
  const quickCalc = document.getElementById('quick-calc');
  const contactMessage = document.getElementById('f-message');
  if (quickCalc && contactMessage) {
    quickCalc.addEventListener('submit', (event) => {
      event.preventDefault();
      const type = quickCalc.querySelector('#qc-type').value;
      const area = quickCalc.querySelector('#qc-area').value.trim();
      contactMessage.value = area ? `Тип кровли: ${type}, площадь: ${area} м²` : `Тип кровли: ${type}`;
      document.getElementById('contact').scrollIntoView({ behavior: reduceMotionMql.matches ? 'auto' : 'smooth' });
      document.getElementById('f-name').focus();
    });
  }

  // Contact form: client-side validation + placeholder submit handling.
  // NOTE: no backend is wired up yet — replace the submit handler below with
  // a real endpoint (fetch/POST, CRM webhook, etc.) before launch.
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form && status) {
    const phonePattern = /^[+]?[\d\s().-]{7,20}$/;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.classList.remove('is-success', 'is-error');

      const name = form.querySelector('#f-name');
      const phone = form.querySelector('#f-phone');
      const consent = form.querySelector('#f-consent');

      let firstInvalid = null;
      [name, phone, consent].forEach((el) => el.closest('.form-row, .form-consent')?.classList.remove('has-error'));

      if (!name.value.trim()) {
        name.closest('.form-row').classList.add('has-error');
        firstInvalid ??= name;
      }
      if (!phonePattern.test(phone.value.trim())) {
        phone.closest('.form-row').classList.add('has-error');
        firstInvalid ??= phone;
      }
      if (!consent.checked) {
        consent.closest('.form-consent').classList.add('has-error');
        firstInvalid ??= consent;
      }

      if (firstInvalid) {
        status.textContent = 'Проверьте, пожалуйста, поля формы: имя, телефон и согласие на обработку данных.';
        status.classList.add('is-error');
        firstInvalid.focus();
        return;
      }

      // Placeholder success state — no data is actually sent anywhere yet.
      status.textContent = 'Заявка принята. Мы перезвоним вам в ближайшее рабочее время.';
      status.classList.add('is-success');
      form.reset();
    });
  }
})();
