/* ===================================================
   Portfolio — Resume Button
   Opens the PDF resume in a new browser tab
   =================================================== */
(function () {
    'use strict';

    function init() {
        document.getElementById('resumeBtn').addEventListener('click', function (e) {
            e.preventDefault();
            window.open('./sources/resume/Kent_Sabayday_FullStack_Resume.pdf', '_blank');
        });
    }

    if (window.componentsLoaded) {
        init();
    } else {
        document.addEventListener('componentsLoaded', init);
    }
})();
