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

  /* --- Contact Form Handler → sends SMS via Twilio Function --- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Collect form data
      var data = new FormData(contactForm);
      var payload = {};
      data.forEach(function (value, key) { payload[key] = value; });

      // Format the interest and timeline for readability
      var interestMap = {
        buying: 'Buying a Home', selling: 'Selling a Home', land: 'Buying Land',
        investing: 'Real Estate Investing', relocating: 'Relocating to WNC', other: 'Something Else'
      };
      var timelineMap = {
        asap: 'ASAP', '1-3months': '1-3 months', '3-6months': '3-6 months',
        '6-12months': '6-12 months', exploring: 'Just exploring'
      };

      payload.interest_label = interestMap[payload.interest] || '';
      payload.timeline_label = timelineMap[payload.timeline] || '';

      // POST to Twilio Function endpoint
      // SETUP: Replace this URL with your Twilio Function URL
      var ENDPOINT = 'https://YOUR-TWILIO-FUNCTION-URL.twil.io/contact-sms';

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then(function () {
        contactForm.style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
      })
      .catch(function () {
        contactForm.style.display = 'none';
        document.getElementById('form-error').style.display = 'block';
      });
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
