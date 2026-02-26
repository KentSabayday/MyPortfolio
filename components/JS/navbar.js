/* ===================================================
   CantiumCode Portfolio — Navbar
   Handles: scroll hide/show, shadow on scroll,
   hamburger menu toggle, active nav link highlight
   =================================================== */
(function () {
    'use strict';

    function init() {

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

        // ————— Mobile hamburger menu —————
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
    }

    if (window.componentsLoaded) {
        init();
    } else {
        document.addEventListener('componentsLoaded', init);
    }
})();
