/* ============================================================
   Brandi Rininger — brandirininger.com
   Main JavaScript — lightweight, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* --- Gate CSS animations behind JS readiness --- */
  document.documentElement.classList.add('js-ready');

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
    var BRANDI_PHONE = '+18283716980';

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

/* ===== BACK TO TOP BUTTON ===== */
(function(){
  var btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', function(){
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });
  btn.addEventListener('click', function(){
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();

/* ===== SCROLL PROGRESS INDICATOR ===== */
(function(){
  var bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', function(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  });
})();

/* ===== FADE-IN ON SCROLL (Intersection Observer) ===== */
(function(){
  var reveals = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if (!reveals.length || !('IntersectionObserver' in window)) {
    reveals.forEach(function(el){ el.classList.add('active'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.15, rootMargin: '0px 0px -40px 0px'});
  reveals.forEach(function(el){ observer.observe(el); });
})();

/* ===== DARK MODE TOGGLE ===== */
(function(){
  var toggle = document.querySelector('.dark-toggle');
  if (!toggle) return;
  var stored = localStorage.getItem('theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
    document.documentElement.setAttribute('data-theme','dark');
    toggle.textContent = '☀️';
  }
  toggle.addEventListener('click', function(){
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      toggle.textContent = '🌙';
      localStorage.setItem('theme','light');
    } else {
      document.documentElement.setAttribute('data-theme','dark');
      toggle.textContent = '☀️';
      localStorage.setItem('theme','dark');
    }
  });
})();

/* ===== READING PROGRESS BAR (Blog Posts) ===== */
(function(){
  var bar = document.querySelector('.reading-progress');
  if (!bar) return;
  var article = document.querySelector('article') || document.querySelector('main');
  if (!article) return;
  window.addEventListener('scroll', function(){
    var rect = article.getBoundingClientRect();
    var total = article.offsetHeight - window.innerHeight;
    var progress = Math.min(Math.max(-rect.top / total * 100, 0), 100);
    bar.style.width = progress + '%';
  });
})();

/* ===== SHARE BUTTONS ===== */
(function(){
  document.querySelectorAll('.share-btn[data-action]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var action = this.getAttribute('data-action');
      var url = encodeURIComponent(window.location.href);
      var title = encodeURIComponent(document.title);
      if (action === 'twitter') window.open('https://twitter.com/intent/tweet?url='+url+'&text='+title,'_blank','width=550,height=420');
      else if (action === 'facebook') window.open('https://www.facebook.com/sharer/sharer.php?u='+url,'_blank','width=550,height=420');
      else if (action === 'linkedin') window.open('https://www.linkedin.com/sharing/share-offsite/?url='+url,'_blank','width=550,height=420');
      else if (action === 'copy') {
        navigator.clipboard.writeText(window.location.href).then(function(){
          var orig = btn.textContent;
          btn.textContent = '✓';
          setTimeout(function(){ btn.textContent = orig; }, 2000);
        });
      }
    });
  });
})();

/* ===== FAQ ACCORDION ===== */
(function(){
  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click', function(){
      var answer = this.nextElementSibling;
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      if (expanded) answer.classList.remove('open');
      else answer.classList.add('open');
    });
  });
})();

/* ===== MORTGAGE CALCULATOR ===== */
(function(){
  var form = document.getElementById('mortgage-calc');
  if (!form) return;
  function calc(){
    var price = parseFloat(document.getElementById('calc-price').value) || 0;
    var down = parseFloat(document.getElementById('calc-down').value) || 20;
    var rate = parseFloat(document.getElementById('calc-rate').value) || 6.5;
    var years = parseFloat(document.getElementById('calc-years').value) || 30;
    var principal = price * (1 - down/100);
    var monthlyRate = rate / 100 / 12;
    var payments = years * 12;
    var monthly = monthlyRate > 0 ? principal * (monthlyRate * Math.pow(1+monthlyRate,payments)) / (Math.pow(1+monthlyRate,payments)-1) : principal / payments;
    var result = document.getElementById('calc-result');
    if (result) result.textContent = '$' + Math.round(monthly).toLocaleString() + '/mo';
  }
  form.querySelectorAll('input').forEach(function(input){
    input.addEventListener('input', calc);
  });
  calc();
})();

/* ===== PAGE TRANSITION ===== */
document.body.classList.add('page-transition');
