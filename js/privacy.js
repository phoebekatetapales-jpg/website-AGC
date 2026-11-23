/* =====================================================================
   AGC Tutorials — Privacy Policy page script (privacy.html).
   ===================================================================== */
(function(){
document.querySelectorAll('.agc-nav .agc-dd').forEach(function(dd){
  var b=dd.querySelector('.agc-dd-btn');
  function set(o){dd.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');}
  b.addEventListener('click',function(e){e.stopPropagation();set(!dd.classList.contains('open'));});
  dd.querySelectorAll('.agc-dd-list a').forEach(function(a){a.addEventListener('click',function(){set(false);});});
  document.addEventListener('click',function(e){if(!dd.contains(e.target))set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dd.classList.contains('open')){set(false);b.focus();}});
  dd.addEventListener('focusout',function(e){if(!dd.contains(e.relatedTarget))set(false);});
});
})();
