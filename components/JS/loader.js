/* ===================================================
   Portfolio — Loader
   Shows <C /> logo animation, then fades away
   =================================================== */
(function () {
    'use strict';

    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.classList.add('hidden');
            loader.addEventListener('transitionend', () => loader.remove());
        }, 800);
    });
})();
