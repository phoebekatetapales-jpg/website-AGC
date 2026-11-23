/* =====================================================================
   AGC Tutorials — Plans & Pricing page script (plans.html).
   ===================================================================== */
/* Image folder, found next to this script, so it works on Vercel and when loaded from a GHL page. */
var AGC_IMG=new URL('../images/',document.currentScript.src).href;
var AGC_LOGO=AGC_IMG+'logo.jpg';
(function(){
document.querySelectorAll('.agc-site [data-agc-img="logo"]').forEach(function(img){img.src=AGC_LOGO;});
var nav=document.querySelector('.agc-site .agc-nav');
function stuck(){nav.classList.toggle('agc-stuck',window.scrollY>4);}
window.addEventListener('scroll',stuck,{passive:true});stuck();
})();

/* ---- Enroll buttons ----
   Each plan card with data-plan gets an "Enroll now" button that opens /enroll with that package preselected.
   A program card's "View plans" link (data-agc-program) also preselects that program. */
(function(){
var picked='';
document.querySelectorAll('[data-agc-program]').forEach(function(a){a.addEventListener('click',function(){picked=a.getAttribute('data-agc-program');});});
document.querySelectorAll('.agc-pricing .plan[data-plan]').forEach(function(card){
  var a=document.createElement('a'),base='/enroll?plan='+encodeURIComponent(card.getAttribute('data-plan'));
  a.className='agc-btn '+(card.classList.contains('dark')?'agc-btn-gold':'agc-btn-navy')+' agc-add';
  a.href=base;a.textContent='Enroll now';
  a.addEventListener('click',function(){a.href=base+(picked?'&program='+encodeURIComponent(picked):'');});
  card.appendChild(a);
});
})();
