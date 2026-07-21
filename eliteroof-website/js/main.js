(() => {
  'use strict';

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    // Below the 900px breakpoint the nav becomes an off-canvas panel that is
    // visually collapsed (max-height: 0) but its links stay in the DOM, so
    // without this they'd remain keyboard-focusable while invisible. `inert`
    // removes them from the tab order and AT tree while collapsed.
    const navCollapsesMql = window.matchMedia('(max-width: 900px)');
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
