// assets/main.js
// Extracted interactive logic from index.html (non-printing behavior)
// NOTE: This file is intentionally minimal for the perf branch. It should be expanded
// with the original JS modules as needed and can be split further.

(function(){
  'use strict';

  // Example bootstrap: keep original global initializers that are needed early
  function initUI() {
    // restore theme toggle behavior if present
    var themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function(){
        var cur = document.documentElement.getAttribute('data-theme');
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
  }

  function init() {
    try { initUI(); } catch(e){ console.warn('initUI failed', e); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
