/* ===================================================
   CantiumCode Portfolio — Typewriter Effect
   "I build things for the web." types out
   letter by letter with a blinking cursor
   =================================================== */
(function () {
    'use strict';

    function init() {
        const tagline = document.querySelector('.hero-tagline');
        if (!tagline) return;

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

    if (window.componentsLoaded) {
        init();
    } else {
        document.addEventListener('componentsLoaded', init);
    }
})();
