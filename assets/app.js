// assets/app.js
// Small runtime performance improvements applied dynamically so we don't need to modify the huge inline HTML immediately.
// - Add lazy loading for images that don't explicitly opt-out
// - Add resource hints for Google fonts (preconnect to fonts.gstatic.com)
// - Throttle / pause heavy background animations on slow connections or when user prefers reduced motion

(function () {
  'use strict';

  function addFontPreconnect() {
    try {
      if (!document.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]')) {
        var l = document.createElement('link');
        l.rel = 'preconnect';
        l.href = 'https://fonts.gstatic.com';
        l.crossOrigin = '';
        document.head.appendChild(l);
      }
    } catch (e) { console.warn('preconnect failed', e); }
  }

  function lazyLoadImages() {
    try {
      // Add loading="lazy" to images that do not explicitly request `loading="eager"`
      var imgs = document.querySelectorAll('img:not([loading])');
      imgs.forEach(function (img) {
        // Don't change images that already have important attributes or role of decoration
        img.setAttribute('loading', 'lazy');
        // Ensure width/height are set where possible to avoid layout shift
        if (!img.hasAttribute('width') && img.naturalWidth) {
          img.setAttribute('width', img.naturalWidth);
        }
        if (!img.hasAttribute('height') && img.naturalHeight) {
          img.setAttribute('height', img.naturalHeight);
        }
      });
    } catch (e) { console.warn('lazyLoadImages failed', e); }
  }

  function throttleAnimationsOnSlowConnections() {
    try {
      var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      var slow = false;
      if (connection && connection.effectiveType) {
        var et = connection.effectiveType || '';
        if (et.indexOf('2g') !== -1 || et === 'slow-2g') slow = true;
      }
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) slow = true;

      if (slow) {
        // Reduce or pause heavy background animations
        var bgGrid = document.querySelector('.bg-grid');
        if (bgGrid) bgGrid.style.animation = 'none';
        var orbs = document.querySelectorAll('.bg-orb, .orb1, .orb2');
        orbs.forEach(function (o) { o.style.animation = 'none'; });

        // Also remove heavy box-shadows / backdrop-filters that are expensive on some devices
        var bkels = document.querySelectorAll('.bg-canvas, .app, .wizard-panel, .doc-panel');
        bkels.forEach(function (el) {
          if (el.style.backdropFilter) el.style.backdropFilter = 'none';
          if (el.style.filter) el.style.filter = 'none';
          // reduce transitions
          el.style.transition = 'none';
        });
      }
    } catch (e) { console.warn('throttleAnimationsOnSlowConnections failed', e); }
  }

  function deferNonCriticalWork() {
    // Use requestIdleCallback where available
    var work = function () {
      lazyLoadImages();
      throttleAnimationsOnSlowConnections();
    };
    if ('requestIdleCallback' in window) requestIdleCallback(work, {timeout: 1500});
    else setTimeout(work, 700);
  }

  function init() {
    addFontPreconnect();
    // Run minimal fast work now
    try { lazyLoadImages(); } catch (e) {}
    // Defer other tweaks
    deferNonCriticalWork();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
