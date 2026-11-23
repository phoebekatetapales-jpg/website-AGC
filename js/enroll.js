/* =====================================================================
   AGC Tutorials — Enroll page script (enroll.html).
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

/* ---- Enrollment ----
   Open /enroll?plan=sprint&program=anywhere to preselect a package and program.
   Submitting opens an email to EMAIL with the enrollment details, then shows a "Pay now" button
   that opens the package's GoHighLevel payment link (PAY_LINKS) in a new tab. No card details touch this site.
   To change a package or price, edit PLANS below (and the matching card on /plans and the homepage). */
(function(){
var EMAIL='rconcepcion@agctutorials.com';
/* GHL payment link for each package (Payments → Payment Links → Copy link).
   TEMPORARY: every package uses the same test link until the real per-package links are created. */
var TEST_LINK='https://api.multiplytalents.io/payment-link/6afff13a21a48a3872d27c9a';
var PAY_LINKS={
 flex:TEST_LINK,
 sprint:TEST_LINK,
 momentum:TEST_LINK,
 ascent:TEST_LINK,
 semester:TEST_LINK,
 apex:TEST_LINK
};
var PLANS=[
 {id:'flex',kicker:'Pay-as-you-go',name:'Flex Aspire Pass',amount:100,unit:'per session',rate:'$100 / session',save:''},
 {id:'sprint',kicker:'8 sessions',name:'Sprint Growth Pack',amount:720,unit:'package',rate:'$90 / session',save:'Save $80'},
 {id:'momentum',kicker:'16 sessions',name:'Momentum Growth Pack',amount:1360,unit:'package',rate:'$85 / session',save:'Save $240'},
 {id:'ascent',kicker:'32 sessions',name:'Ascent Progress Pack',amount:2560,unit:'package',rate:'$80 / session',save:'Save $640'},
 {id:'semester',kicker:'48 sessions',name:'Semester Conquer Pass',amount:3600,unit:'package',rate:'$75 / session',save:'Save $1,200'},
 {id:'apex',kicker:'72 sessions · full year',name:'Apex Scholar Elite',amount:5040,unit:'package',rate:'$70 / session',save:'Save $2,160'}
];
var PROGRAMS=[
 {id:'core',name:'AGC Core Tutoring',sub:'Subject-specific 1-on-1',subject:true},
 {id:'anywhere',name:'AGC Anywhere',sub:'Interactive virtual tutoring',subject:true},
 {id:'ascent',name:'AGC Ascent Coaching',sub:'Executive functioning mentorship',subject:false}
];
var SUBJECTS=['Math','Science','English','History','Writing','Reading'];
var GRADES=['Pre-K','K','1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'];
function esc(s){var d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML;}
function money(n){return '$'+n.toLocaleString('en-US');}
function find(list,id){for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i];return null;}
var DOT='<span class="dot" aria-hidden="true"></span>';

var root=document.querySelector('.agc-enroll-page'),form=root.querySelector('form');
var q=new URLSearchParams(location.search);
var plan=find(PLANS,q.get('plan')),program=find(PROGRAMS,q.get('program'));

root.querySelector('.pkgs').innerHTML=PLANS.map(function(p){
  return '<div class="opt"><input type="radio" name="plan" id="pl-'+p.id+'" value="'+p.id+'" required'+(plan===p?' checked':'')+'>'+
    '<label for="pl-'+p.id+'">'+DOT+'<span class="t"><small>'+esc(p.kicker)+'</small><b>'+esc(p.name)+'</b><span>'+esc(p.rate)+'</span></span><span class="p">'+money(p.amount)+'</span></label></div>';
}).join('');
root.querySelector('.progs').innerHTML=PROGRAMS.map(function(p){
  return '<div class="opt"><input type="radio" name="program" id="pr-'+p.id+'" value="'+p.id+'" required'+(program===p?' checked':'')+'>'+
    '<label for="pr-'+p.id+'">'+DOT+'<span class="t"><b>'+esc(p.name)+'</b><span>'+esc(p.sub)+'</span></span></label></div>';
}).join('');
form.elements.subject.innerHTML+=SUBJECTS.map(function(s){return '<option>'+s+'</option>';}).join('');
form.elements.grade.innerHTML+=GRADES.map(function(g){return '<option>'+g+'</option>';}).join('');

var subjBox=root.querySelector('.subj'),sum=root.querySelector('.sum'),err=root.querySelector('.err');
function sync(){
  plan=find(PLANS,form.elements.plan.value);program=find(PROGRAMS,form.elements.program.value);
  var needs=!!(program&&program.subject);
  subjBox.hidden=!needs;form.elements.subject.disabled=!needs;
  var subject=needs?form.elements.subject.value:'';
  if(!plan){sum.innerHTML='<p class="none">Choose a package to see your total.</p>';return;}
  sum.innerHTML='<div class="k">'+esc(plan.kicker)+'</div><div class="nm">'+esc(plan.name)+'</div>'+(plan.save?'<span class="save">'+esc(plan.save)+'</span>':'')+
    '<dl><div><dt>Rate</dt><dd>'+esc(plan.rate)+'</dd></div>'+
    '<div><dt>Program</dt><dd>'+(program?esc(program.name):'—')+'</dd></div>'+
    (needs?'<div><dt>Subject</dt><dd>'+(subject?esc(subject):'—')+'</dd></div>':'')+'</dl>'+
    '<div class="tot"><span>Total</span><b>'+money(plan.amount)+'</b></div>';
}
form.addEventListener('change',sync);
form.addEventListener('input',function(){err.hidden=true;});
sync();

form.addEventListener('submit',function(e){
  e.preventDefault();
  var bad=Array.prototype.filter.call(form.elements,function(el){return el.willValidate&&!el.checkValidity();});
  err.hidden=!bad.length;
  if(bad.length){bad[0].focus();if(bad[0].type==='radio')bad[0].closest('.step').scrollIntoView({behavior:'smooth',block:'center'});return;}
  var d={};['parent','email','phone','student','grade','notes','subject'].forEach(function(n){d[n]=form.elements[n].disabled?'':form.elements[n].value.trim();});
  var no='AGC-'+Date.now().toString(36).toUpperCase().slice(-6);
  var lines=['New enrollment '+no,'',
    'Package: '+plan.name+' ('+plan.kicker+') — '+money(plan.amount),
    'Program: '+program.name+(d.subject?' ('+d.subject+')':''),'',
    'Parent / guardian: '+d.parent,'Email: '+d.email,'Phone: '+d.phone,
    'Student: '+d.student+' ('+d.grade+')'].concat(d.notes?['Goals / notes: '+d.notes]:[]);
  var mail='mailto:'+EMAIL+'?subject='+encodeURIComponent('Enrollment '+no+' — '+d.student)+'&body='+encodeURIComponent(lines.join('\n'));
  var pay=PAY_LINKS[plan.id];
  root.querySelector('.agc-wrap').innerHTML='<div class="done" tabindex="-1"><div class="ok"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#8A6A2C" stroke-width="2.6" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg></div>'+
    '<h2>Thank you, '+esc(d.parent.split(' ')[0])+'!</h2><span class="no">'+esc(no)+'</span>'+
    '<ol class="next">'+
    '<li><b>Send your enrollment details.</b> Your email app should have opened with them — press <b>Send</b>. Didn’t open? <a href="'+esc(mail)+'">Try again</a>.</li>'+
    (pay?'<li><b>Pay for your package.</b> '+esc(plan.name)+' — '+money(plan.amount)+'. Payment opens on our secure checkout page in a new tab.</li>'
        :'<li><b>Payment.</b> We’ll email you a secure payment link with your schedule confirmation.</li>')+
    '</ol>'+
    (pay?'<a class="agc-btn agc-btn-gold pay" href="'+esc(pay)+'" target="_blank" rel="noopener">Pay '+money(plan.amount)+' now</a>':'')+
    '<p class="fine">We’ll reply within one business day to confirm your schedule. Questions? Write to <a href="mailto:'+EMAIL+'">'+EMAIL+'</a> with your enrollment number.</p>'+
    '<a class="home" href="/">Back to home</a></div>';
  var done=root.querySelector('.done');done.focus();window.scrollTo({top:root.offsetTop-80,behavior:'smooth'});
  location.href=mail;
});
})();
