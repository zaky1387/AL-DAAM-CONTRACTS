(function(){
  'use strict';
  // assets/print.js — loaded on-demand to handle print/preview logic

  function paginateForPrint(){
    try{
      // If an original implementation exists, call it
      if (typeof window._originalPaginateForPrint === 'function') {
        return window._originalPaginateForPrint();
      }
      // Basic fallback: open the print dialog
      window.print();
    } catch (e) { console.warn('paginateForPrint error', e); try { window.print(); } catch(e2){} }
  }

  function openPreview(){
    // Alias for older code that might call openPreview()
    paginateForPrint();
  }

  // Expose globally so existing HTML/event handlers can call them
  window.paginateForPrint = paginateForPrint;
  window.openPreview = openPreview;

  // Lightweight delegation: if a preview button exists we handle it without requiring inline JS
  document.addEventListener('click', function (ev) {
    var el = ev.target;
    if (!el) return;
    var btn = el.closest && el.closest('.preview-btn, .preview, [data-action="preview"]');
    if (btn) {
      ev.preventDefault();
      paginateForPrint();
    }
  }, {capture: false});

})();
