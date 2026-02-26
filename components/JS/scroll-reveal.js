/* ===================================================
   CantiumCode Portfolio — Scroll Reveal
   Elements with class .fade-up animate in as
   they enter the viewport (Intersection Observer)
   =================================================== */
(function () {
    'use strict';

    function init() {
        const reveals = document.querySelectorAll('.fade-up');

        // Skip hero elements — they animate via CSS keyframes
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
    }

    if (window.componentsLoaded) {
        init();
    } else {
        document.addEventListener('componentsLoaded', init);
    }
})();
