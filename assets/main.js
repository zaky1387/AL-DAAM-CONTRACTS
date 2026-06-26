(function(){
  'use strict';

  // assets/main.js (updated)
  // Bootstraps UI and lazily loads print module on demand.

  function loadScript(src, opts) {
    return new Promise(function(resolve, reject){
      var s = document.createElement('script');
      s.src = src;
      s.async = !!(opts && opts.async);
      s.defer = !!(opts && opts.defer);
      if (opts && opts.crossorigin) s.crossOrigin = opts.crossorigin;
      s.onload = function(){ resolve(s); };
      s.onerror = function(e){ reject(e); };
      document.head.appendChild(s);
    });
  }

  function initUI() {
    // restore theme toggle behavior if present
    var themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function(){
        var cur = document.documentElement.getAttribute('data-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', cur === 'light' ? 'dark' : 'light');
      });
    }

    // basic nav handlers (non-exhaustive placeholder)
    var tabs = document.querySelectorAll('.step-tab');
    tabs.forEach(function(t){ t.addEventListener('click', function(){
      var idx = Array.prototype.indexOf.call(t.parentNode.children, t);
      document.querySelectorAll('.step-panel').forEach(function(p){ p.classList.remove('active'); });
      var target = document.querySelectorAll('.step-panel')[idx]; if (target) target.classList.add('active');
      document.querySelectorAll('.step-tab').forEach(function(x){ x.classList.remove('active'); });
      t.classList.add('active');
    }); });

    // preview/print button lazy loader: load assets/print.js only when user attempts preview/print
    var previewSelector = '.preview-btn, .preview, [data-action="preview"]';
    var loadedPrint = false;
    var loadingPrint = null;

    function ensurePrintLoaded() {
      if (loadedPrint) return Promise.resolve();
      if (loadingPrint) return loadingPrint;
      loadingPrint = loadScript('assets/print.js', {defer: true}).then(function(){
        loadedPrint = true;
      }).catch(function(err){
        console.warn('Failed to load print.js', err);
      });
      return loadingPrint;
    }

    document.addEventListener('click', function (ev) {
      var el = ev.target;
      if (!el) return;
      var btn = el.closest && el.closest(previewSelector);
      if (btn) {
        // prevent default and ensure print module is loaded
        ev.preventDefault();
        ensurePrintLoaded().then(function(){
          try { if (typeof window.paginateForPrint === 'function') window.paginateForPrint(); }
          catch(e){ console.warn('paginateForPrint failed', e); }
        });
      }
    }, {capture: false});
  }

  function init() {
    try { initUI(); } catch(e){ console.warn('initUI failed', e); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
