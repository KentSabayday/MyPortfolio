/* ===================================================
   CantiumCode Portfolio — Experience Tabs
   Click a tab → shows corresponding work experience
   with animated indicator bar
   =================================================== */
(function () {
    'use strict';

    function init() {
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
    }

    if (window.componentsLoaded) {
        init();
    } else {
        document.addEventListener('componentsLoaded', init);
    }
})();
