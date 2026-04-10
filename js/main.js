/* ============================================================
   Brandi Rininger — brandirininger.com
   Main JavaScript — lightweight, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* --- Mobile Nav Toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('active');
      // Animate hamburger
      const bars = toggle.querySelectorAll('span');
      if (!expanded) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });

    // Close nav when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        var bars = toggle.querySelectorAll('span');
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      });
    });
  }

  /* --- Smooth Scroll for anchor links (fallback for Safari) --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* --- Lazy header shadow on scroll --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY > 10) {
        header.style.boxShadow = '0 2px 8px rgba(0,0,0,.08)';
      } else {
        header.style.boxShadow = '';
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  /* --- Contact Form Handler --- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // Collect form data
      var data = new FormData(contactForm);
      var payload = {};
      data.forEach(function (value, key) { payload[key] = value; });

      // TODO: Replace with actual form endpoint (Formspree, Netlify Forms, or custom)
      console.log('Form submission:', payload);

      // Show success message
      var successEl = document.getElementById('form-success');
      if (successEl) {
        contactForm.style.display = 'none';
        successEl.style.display = 'block';
      }
    });
  }

  /* --- Current year in footer --- */
  var yearEls = document.querySelectorAll('.current-year');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) { el.textContent = year; });

  /* --- Active nav link --- */
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    if (link.getAttribute('href') === currentPath ||
        (currentPath !== '/' && link.getAttribute('href') !== '/' && currentPath.startsWith(link.getAttribute('href')))) {
      link.setAttribute('aria-current', 'page');
    }
  });

})();
