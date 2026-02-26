/* ===================================================
   Portfolio — Contact Form
   Sends form data to Formspree API via fetch(),
   shows loading spinner, success/error messages
   =================================================== */
(function () {
    'use strict';

    function init() {
        const contactForm = document.getElementById('contactForm');
        const contactStatus = document.getElementById('contactStatus');

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            // Show loading state
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            contactStatus.style.display = 'none';

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: new FormData(this),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                    contactStatus.className = 'contact-status fade-up visible status-success';
                    contactStatus.style.display = 'block';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    const errorMsg = (data.errors && data.errors.map(err => err.message).join(', ')) || 'Something went wrong.';
                    contactStatus.textContent = '✗ ' + errorMsg;
                    contactStatus.className = 'contact-status fade-up visible status-error';
                    contactStatus.style.display = 'block';
                }
            } catch {
                contactStatus.textContent = '✗ Network error. Please check your connection and try again.';
                contactStatus.className = 'contact-status fade-up visible status-error';
                contactStatus.style.display = 'block';
            } finally {
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
            }
        });
    }

    if (window.componentsLoaded) {
        init();
    } else {
        document.addEventListener('componentsLoaded', init);
    }
})();
