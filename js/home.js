/* =====================================================================
   AGC Tutorials — Homepage script (index.html).
   ===================================================================== */
/* Image folder, found next to this script, so it works on Vercel and when loaded from a GHL page. */
var AGC_IMG=new URL('../images/',document.currentScript.src).href;
var AGC_LOGO=AGC_IMG+'logo.jpg';
var AGC_HERO=AGC_IMG+'hero.jpg';
var AGC_HERO_CORE=AGC_IMG+'hero-core.jpg';
var AGC_HERO_ANYWHERE=AGC_IMG+'hero-anywhere.jpg';
var AGC_HERO_ASCENT=AGC_IMG+'hero-ascent.jpg';
var AGC_FOUNDER=AGC_IMG+'founder.jpg';
/* ---- Top bar + Navigation ---- */
(function(){
var root=document.currentScript?document.currentScript.previousElementSibling:null;
if(!root||!root.classList.contains('agc-nav'))root=document.querySelector('.agc-nav');
var burger=root.querySelector('.agc-burger'),panel=root.querySelector('.agc-mobile');
burger.addEventListener('click',function(){var o=panel.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu');});
panel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){panel.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
/* sticky: only the white header stays pinned; the top bar scrolls away */
var topBar=root.querySelector('.agc-top');
function pin(){root.style.top=-(topBar?topBar.offsetHeight:0)+'px';}
function stuck(){root.classList.toggle('agc-stuck',window.scrollY>(topBar?topBar.offsetHeight:0));}
pin();window.addEventListener('resize',pin);window.addEventListener('scroll',stuck,{passive:true});stuck();
})();

/* ---- Nav dropdown ---- */
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

/* ---- Subjects (tabs) ---- */
(function(){
var SUBJECTS=[
 {name:'Math',blurb:'From K–7 fundamentals to AP Calculus — we build problem-solving skills and readiness for upcoming units and exams.',courses:['K–7 Math','Pre-Algebra','Algebra I','Algebra II','Geometry','Trigonometry','Statistics','Pre-Calculus','Calculus AB/BC']},
 {name:'Science',blurb:'Complex science concepts broken into manageable, engaging milestones aligned with course standards.',courses:['Earth Science','Physical Science','Geosystems','Biology','Chemistry','Physics']},
 {name:'English',blurb:'Support for middle and high school English coursework, from analysis to assignments.',courses:['Middle School','High School']},
 {name:'History',blurb:'Making sense of people, events, and systems — and how to study and write about them.',courses:['World History','US History','Government']},
 {name:'Writing',blurb:'Structured, step-by-step writing instruction that builds clarity and confidence at every level.',courses:['Elementary','Middle School','High School']},
 {name:'Reading',blurb:'Evidence-based literacy instruction — including phonics — drawing on programs like SPIRE, Lindamood-Bell, and Readtopia.',courses:['Elementary','Middle School','High School','Phonics']}
];
var root=document.querySelector('.agc-subjects');
var tabs=root.querySelector('.tabs'),current=0;
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function render(){
  tabs.innerHTML=SUBJECTS.map(function(s,i){return '<button type="button" class="tab" role="tab" aria-selected="'+(i===current)+'" data-i="'+i+'">'+esc(s.name)+'</button>';}).join('');
  var s=SUBJECTS[current];
  root.querySelector('.s-name').textContent=s.name;
  root.querySelector('.s-blurb').textContent=s.blurb;
  root.querySelector('.courses').innerHTML=s.courses.map(function(c){return '<div class="course"><i></i>'+esc(c)+'</div>';}).join('');
}
tabs.addEventListener('click',function(e){var b=e.target.closest('.tab');if(!b)return;current=+b.getAttribute('data-i');render();tabs.querySelector('[data-i="'+current+'"]').focus();});
render();
})();

/* ---- Plans & Pricing ---- */
(function(){
/* SHOWN: how many plans appear on the homepage. "View more plans" opens /plans, which lists them all. */
var SHOWN=3;
var PLANS=[
 {id:'flex',kicker:'Pay-as-you-go',name:'Flex Aspire Pass',amount:100,price:'$100',note:'/ session',rate:'$100 per 60-minute session',save:'',desc:'Complete scheduling freedom with no long-term commitment — ideal for exam prep, last-minute homework help, or occasional check-ins.'},
 {id:'sprint',kicker:'8 sessions',name:'Sprint Growth Pack',amount:720,price:'$720',note:'package',rate:'$90 / session',save:'Save $80',desc:'A focused 8-hour jumpstart to master a challenging unit, catch up on core concepts, or prepare for midterms.'},
 {id:'momentum',kicker:'16 sessions',name:'Momentum Growth Pack',amount:1360,price:'$1,360',note:'package',rate:'$85 / session',save:'Save $240',desc:'Steady improvement over a quarter or marking period — tackling coursework while building organization and study habits.'},
 {id:'ascent',kicker:'32 sessions',name:'Ascent Progress Pack',amount:2560,price:'$2,560',note:'package',rate:'$80 / session',save:'Save $640',desc:'Sustained mid-term guidance across multiple subjects or specialized executive functioning coaching over several months.'},
 {id:'semester',kicker:'48 sessions',name:'Semester Conquer Pass',amount:3600,price:'$3,600',note:'package',rate:'$75 / session',save:'Save $1,200',desc:'Comprehensive, term-long support with a dedicated mentor through major projects, exams, and daily coursework.'},
 {id:'apex',kicker:'72 sessions · full year',name:'Apex Scholar Elite',amount:5040,price:'$5,040',note:'package',rate:'$70 / session',save:'Save $2,160',desc:'Our most exclusive offering: full academic-year coverage, our lowest hourly rate, and top-priority coach matching.',dark:true,badge:'Best value'}
];
var root=document.querySelector('.agc-pricing'),list=root.querySelector('.plans');
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}
list.innerHTML=PLANS.slice(0,SHOWN).map(function(p){
  return '<div class="plan'+(p.dark?' dark':'')+'" data-plan="'+esc(p.id)+'" data-name="'+esc(p.name)+'" data-kicker="'+esc(p.kicker)+'" data-amount="'+p.amount+'"><div class="head"><div><div class="k">'+esc(p.kicker)+'</div><h3>'+esc(p.name)+'</h3></div>'+(p.badge?'<span class="badge">'+esc(p.badge)+'</span>':'')+'</div>'+
    '<div class="price"><b>'+esc(p.price)+'</b><span>'+esc(p.note)+'</span></div>'+
    '<div class="meta"><span>'+esc(p.rate)+'</span>'+(p.save?'<span class="save">'+esc(p.save)+'</span>':'')+'</div>'+
    '<p class="desc">'+esc(p.desc)+'</p></div>';
}).join('');
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

/* ---- Images: swap these for your GHL Media Library URLs if you like ---- */
(function(){
  var IMAGES={logo:AGC_LOGO,founder:AGC_FOUNDER,hero:AGC_HERO,core:AGC_HERO_CORE,anywhere:AGC_HERO_ANYWHERE,ascent:AGC_HERO_ASCENT};
  document.querySelectorAll('.agc-site [data-agc-img]').forEach(function(img){img.src=IMAGES[img.getAttribute('data-agc-img')];});
})();

/* ---- Hero photo slideshow: arrows, dots, swipe; auto-advances, pauses on hover/focus ---- */
(function(){
  var box=document.querySelector('.agc-hero .slides');if(!box)return;
  var imgs=box.querySelectorAll('img'),dots=box.querySelector('.dots'),cur=0,timer=null,hold=false;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  imgs.forEach(function(im,i){
    var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show photo '+(i+1)+' of '+imgs.length);
    b.addEventListener('click',function(){go(i);});dots.appendChild(b);
  });
  function go(n){
    cur=(n+imgs.length)%imgs.length;
    imgs.forEach(function(im,i){im.classList.toggle('on',i===cur);if(i===cur)im.removeAttribute('aria-hidden');else im.setAttribute('aria-hidden','true');});
    dots.querySelectorAll('button').forEach(function(b,i){b.setAttribute('aria-current',i===cur?'true':'false');});
    start();
  }
  function start(){clearInterval(timer);if(!reduce&&!hold)timer=setInterval(function(){go(cur+1);},5000);}
  box.querySelector('.prev').addEventListener('click',function(){go(cur-1);});
  box.querySelector('.next').addEventListener('click',function(){go(cur+1);});
  function pause(v){hold=v;if(v)clearInterval(timer);else start();}
  box.addEventListener('mouseenter',function(){pause(true);});box.addEventListener('mouseleave',function(){pause(false);});
  box.addEventListener('focusin',function(){pause(true);});box.addEventListener('focusout',function(){pause(false);});
  var x0=null;
  box.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  box.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>40)go(cur+(dx<0?1:-1));});
  go(0);
})();

/* ---- Scroll reveal, count-up and small interactions ---- */
(function(){
  var site=document.querySelector('.agc-site');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!('IntersectionObserver' in window)||reduce)return;
  site.classList.add('agc-js');
  var groups=[
    ['.agc-programs .agc-center',''],['.agc-programs .card',''],
    ['.agc-about .panel','agc-rv-left'],['.agc-about .text','agc-rv-right'],
    ['.agc-facts .agc-wrap > div',''],
    ['.agc-subjects .intro',''],['.agc-subjects .tabs',''],['.agc-subjects .box',''],
    ['.agc-adv .agc-center',''],['.agc-adv .card',''],
    ['.agc-pricing .agc-center',''],['.agc-pricing .plan',''],
    ['.agc-founder .left','agc-rv-left'],['.agc-founder .agc-eyebrow',''],['.agc-founder .agc-h2',''],['.agc-founder .role',''],['.agc-founder .agc-lead',''],['.agc-founder .pillar','agc-rv-right'],
    ['.agc-cta .band',''],['.agc-footer .cols > div','']
  ];
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('agc-in');io.unobserve(e.target);
      var t=e.target;setTimeout(function(){t.style.transitionDelay='';t.classList.remove('agc-rv','agc-rv-left','agc-rv-right','agc-in');},1400);}});
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  groups.forEach(function(g){
    site.querySelectorAll(g[0]).forEach(function(el,i){
      el.classList.add('agc-rv');if(g[1])el.classList.add(g[1]);
      el.style.transitionDelay=(Math.min(i,6)*0.09)+'s';io.observe(el);
    });
  });

  /* count up the facts numbers */
  var cio=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;cio.unobserve(e.target);
      var el=e.target,txt=el.getAttribute('data-final'),m=txt.match(/^(\d+)(.*)$/);
      if(!m)return;var end=+m[1],suf=m[2],t0=null;
      function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);
    });
  },{threshold:.6});
  site.querySelectorAll('.agc-facts b').forEach(function(b){
    b.setAttribute('data-final',b.textContent);
    if(/^\d+$|^\d+\+$/.test(b.textContent)){b.textContent='0'+b.textContent.replace(/^\d+/,'');cio.observe(b);}
  });

  /* fade the subject text when a tab changes */
  var sbox=site.querySelector('.agc-subjects .box > div');
  site.querySelector('.agc-subjects .tabs').addEventListener('click',function(){
    sbox.classList.remove('s-anim');void sbox.offsetWidth;sbox.classList.add('s-anim');
  });
})();
