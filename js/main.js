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

  /* --- Contact Form Handler → opens SMS app or shows copy fallback --- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var BRANDI_PHONE = '+18139247366';

    var interestMap = {
      buying: 'Buying a Home', selling: 'Selling a Home', land: 'Buying Land',
      investing: 'Real Estate Investing', relocating: 'Relocating to WNC', other: 'Something Else'
    };
    var timelineMap = {
      asap: 'ASAP', '1-3months': '1-3 months', '3-6months': '3-6 months',
      '6-12months': '6-12 months', exploring: 'Just exploring'
    };

    function buildSmsBody(d) {
      var lines = ['Hi Brandi! I found you on brandirininger.com.', ''];
      lines.push('Name: ' + d.name);
      if (d.phone) lines.push('Phone: ' + d.phone);
      if (d.email) lines.push('Email: ' + d.email);
      if (d.interest && interestMap[d.interest]) lines.push('Interest: ' + interestMap[d.interest]);
      if (d.timeline && timelineMap[d.timeline]) lines.push('Timeline: ' + timelineMap[d.timeline]);
      if (d.message) { lines.push(''); lines.push(d.message); }
      return lines.join('\n');
    }

    function isMobileDevice() {
      return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      var data = new FormData(contactForm);
      var payload = {};
      data.forEach(function (value, key) { payload[key] = value; });

      var body = buildSmsBody(payload);

      if (isMobileDevice()) {
        // Mobile: open native SMS app with prefilled number & message
        // Use &body= for iOS, ?body= for Android; &body= works on both modern versions
        var smsUrl = 'sms:' + BRANDI_PHONE + '?&body=' + encodeURIComponent(body);
        window.location.href = smsUrl;
      } else {
        // Desktop: show formatted message with copy button
        contactForm.style.display = 'none';
        var fallback = document.getElementById('form-copy-fallback');
        var preview = document.getElementById('sms-preview');
        preview.textContent = body;
        fallback.style.display = 'block';

        document.getElementById('copy-sms-btn').addEventListener('click', function () {
          navigator.clipboard.writeText(body).then(function () {
            document.getElementById('copy-confirm').style.display = 'block';
            setTimeout(function () {
              document.getElementById('copy-confirm').style.display = 'none';
            }, 2000);
          });
        });
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
