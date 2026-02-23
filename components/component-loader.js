/* ===================================================
   Component Loader — component-loader.js
   Fetches HTML component files and injects them into
   placeholder elements, then signals readiness via
   a 'componentsLoaded' custom event.
   =================================================== */
(async function () {
  'use strict';

  const components = [
    { id: 'hero-component',         path: './components/hero.html' },
    { id: 'about-component',        path: './components/about.html' },
    { id: 'experience-component',   path: './components/experience.html' },
    { id: 'projects-component',     path: './components/projects.html' },
    { id: 'achievements-component', path: './components/achievements.html' },
    { id: 'contact-component',      path: './components/contact.html' },
  ];

  try {
    await Promise.all(
      components.map(async ({ id, path }) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load component: ${path} (${response.status})`);
        const html = await response.text();
        const placeholder = document.getElementById(id);
        if (placeholder) {
          placeholder.outerHTML = html;
        }
      })
    );
  } catch (error) {
    console.error('[ComponentLoader]', error);
  }

  // Signal that all components have been injected into the DOM
  window.componentsLoaded = true;
  document.dispatchEvent(new CustomEvent('componentsLoaded'));
})();
