/* ===================================================
   CantiumCode Portfolio — app.js
   Handles: loader, navbar, hamburger, tabs,
            scroll animations, contact form
   =================================================== */

(function () {
  'use strict';

  // ————— Loader —————
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove());
    }, 800);
  });

  // ————— Wait for components to be injected before initializing —————
  if (window.componentsLoaded) {
    initApp();
  } else {
    document.addEventListener('componentsLoaded', initApp);
  }

  function initApp() {

  // ————— Navbar scroll behaviour —————
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Add/remove shadow
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.classList.add('hidden-nav');
    } else {
      navbar.classList.remove('hidden-nav');
    }

    lastScroll = currentScroll;
  });

  // ————— Mobile menu —————
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ————— Experience Tabs —————
  const tabs = document.querySelectorAll('.exp-tab');
  const panels = document.querySelectorAll('.exp-panel');
  const indicator = document.querySelector('.tab-indicator');

  function setActiveTab(index) {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tabs[index].classList.add('active');
    panels[index].classList.add('active');

    // Move indicator
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      indicator.style.transform = `translateX(${tabs[index].offsetLeft}px)`;
      indicator.style.width = `${tabs[index].offsetWidth}px`;
    } else {
      indicator.style.transform = `translateY(${index * 42}px)`;
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setActiveTab(i));
  });

  // Init first tab
  setActiveTab(0);

  // Re-calc indicator on resize
  window.addEventListener('resize', () => {
    const activeIndex = [...tabs].findIndex(t => t.classList.contains('active'));
    setActiveTab(activeIndex);
  });

  // ————— Scroll Reveal (Intersection Observer) —————
  const reveals = document.querySelectorAll('.fade-up');

  // Skip hero elements – they animate via CSS keyframes
  const observeTargets = [...reveals].filter(el => !el.closest('.hero'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  observeTargets.forEach(el => revealObserver.observe(el));

  // ————— Smooth anchor scrolling —————
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ————— Contact Form —————
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;

    // Simple visual feedback
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate sending (replace with real API call)
    setTimeout(() => {
      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.background = '#45e6c0';

      // Reset after 2s
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.background = '';
        contactForm.reset();
      }, 2000);
    }, 1200);
  });

  // ————— Resume button (placeholder) —————
  document.getElementById('resumeBtn').addEventListener('click', function (e) {
    e.preventDefault();
    // Replace this URL with a link to your actual resume PDF
    alert('Resume PDF link not set yet. Replace this handler in app.js with a link to your resume.');
    // Example: window.open('/resume.pdf', '_blank');
  });

  // ————— Active nav link highlight on scroll —————
  const sections = document.querySelectorAll('section[id]');

  function highlightNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (link) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);

  // Add style for active-link dynamically
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active-link { color: var(--accent) !important; }`;
  document.head.appendChild(style);

  // ————— Typed text effect for hero tagline —————
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const fullText = tagline.textContent;
    tagline.textContent = '';
    tagline.style.borderRight = '2px solid var(--accent)';
    tagline.style.opacity = '1';

    let i = 0;
    function typeWriter() {
      if (i < fullText.length) {
        tagline.textContent += fullText.charAt(i);
        i++;
        setTimeout(typeWriter, 55);
      } else {
        // Blink cursor then remove
        setTimeout(() => {
          tagline.style.borderRight = 'none';
        }, 2000);
      }
    }

    // Start typing after loader + hero greeting fade-in
    setTimeout(typeWriter, 1200);
  }

  } // end initApp
})();