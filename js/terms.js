/* =====================================================================
   AGC Tutorials — Terms of Use page script (terms.html).
   ===================================================================== */
/* Image folder, found next to this script, so it works on Vercel and when loaded from a GHL page. */
var AGC_IMG=new URL('../images/',document.currentScript.src).href;
var AGC_LOGO=AGC_IMG+'logo.jpg';
(function(){
document.querySelectorAll('.agc-site [data-agc-img="logo"]').forEach(function(img){img.src=AGC_LOGO;});
/* header shadow once scrolled */
var nav=document.querySelector('.agc-site .agc-nav');
function stuck(){nav.classList.toggle('agc-stuck',window.scrollY>4);}
window.addEventListener('scroll',stuck,{passive:true});stuck();
/* highlight the current section in "On this page" */
var links=[].slice.call(document.querySelectorAll('.agc-legal .toc a'));
if(!('IntersectionObserver' in window))return;
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(!e.isIntersecting)return;
    links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id);});});
},{rootMargin:'-120px 0px -60% 0px'});
links.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s);});
})();
