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
/* GHL payment link for each package (Payments → Payment Links → Copy link). Paid through Stripe.
   Each GHL product must be a ONE-TIME price with no setup fee, matching the price shown on the website.
   If you change a price in GHL, change it on the website too (plans.html, index.html, PLANS below). */
var PAY_LINKS={
 flex:'https://api.multiplytalents.io/payment-link/6b08f05121a48a3872d29b4b',     // Flex Aspire Pass      $100
 sprint:'https://api.multiplytalents.io/payment-link/6b08f14121a48a3872d29b51',   // Sprint Growth Pack    $720
 momentum:'https://api.multiplytalents.io/payment-link/6b08f0da906a8b62055da219', // Momentum Growth Pack  $1,360
 ascent:'https://api.multiplytalents.io/payment-link/6b08f0bb21a48a3872d29b50',   // Ascent Progress Pack  $2,560
 semester:'https://api.multiplytalents.io/payment-link/6b08f0a021a48a3872d29b4e', // Semester Conquer Pass $3,600
 apex:'https://api.multiplytalents.io/payment-link/6b08f071906a8b62055da216'      // Apex Scholar Elite    $5,040
};
/* GHL inbound webhook (Automation → Workflows → trigger "Inbound Webhook" → copy its URL).
   When set, every enrollment is sent straight to GHL and no email is involved.
   While empty (''), the form falls back to opening an email so enrollments aren't lost. */
var GHL_WEBHOOK='https://services.leadconnectorhq.com/hooks/cFgAFxrOkoU4TMUh4bJp/webhook-trigger/e5840689-4b1b-4f23-856b-136e916e9efc';
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

/* ---- Pay first, then enroll ----
   1. "Continue to payment" saves the details in this browser and opens the package's GHL checkout.
   2. After a successful payment, GHL sends the family back to /enroll?paid=1
      (set this as the redirect URL on every GHL payment link).
   3. Only then is the enrollment sent to GHL (or emailed, if GHL_WEBHOOK is empty).
   If they leave without paying, nothing is sent; their details are kept for 2 days so the form is pre-filled. */
var STORE='agcEnrollPending',KEEP_MS=2*24*3600*1000;
var FIELDS=['parent','email','phone','student','grade','notes','subject'];
function loadPending(){try{var p=JSON.parse(localStorage.getItem(STORE));return p&&p.data&&Date.now()-p.at<KEEP_MS?p:null;}catch(e){return null;}}
function savePending(p){try{localStorage.setItem(STORE,JSON.stringify(p));return !!localStorage.getItem(STORE);}catch(e){return false;}}
function clearPending(){try{localStorage.removeItem(STORE);}catch(e){}}

function buildEnrollment(){
  var d={};FIELDS.forEach(function(n){d[n]=form.elements[n].disabled?'':form.elements[n].value.trim();});
  var names=d.parent.split(/\s+/),no='AGC-'+Date.now().toString(36).toUpperCase().slice(-6);
  return {fields:d,plan:plan.id,program:program.id,data:{
    first_name:names[0],last_name:names.slice(1).join(' '),full_name:d.parent,email:d.email,phone:d.phone,
    student_name:d.student,student_grade:d.grade,
    package:plan.name,package_sessions:plan.kicker,package_price:plan.amount,
    program:program.name,subject:d.subject,notes:d.notes,
    enrollment_number:no,payment_link:PAY_LINKS[plan.id]||'',payment_status:'',
    source:'Website enrollment form',submitted_at:new Date().toISOString()
  }};
}
function mailFor(x){
  var lines=['New enrollment '+x.enrollment_number+(x.payment_status?' — '+x.payment_status:''),'',
    'Package: '+x.package+' ('+x.package_sessions+') — '+money(x.package_price),
    'Program: '+x.program+(x.subject?' ('+x.subject+')':''),'',
    'Parent / guardian: '+x.full_name,'Email: '+x.email,'Phone: '+x.phone,
    'Student: '+x.student_name+' ('+x.student_grade+')'].concat(x.notes?['Goals / notes: '+x.notes]:[]);
  return 'mailto:'+EMAIL+'?subject='+encodeURIComponent('Enrollment '+x.enrollment_number+' — '+x.student_name)+'&body='+encodeURIComponent(lines.join('\n'));
}
// Sends the enrollment to GHL (or opens the email as a fallback) and shows the thank-you page.
function complete(x,paid){
  x.payment_status=paid?'Paid at checkout (confirm in GHL Payments)':'Payment to be arranged';
  x.submitted_at=new Date().toISOString();
  var mail=mailFor(x);
  showDone(x.first_name,x.enrollment_number,
    (paid?'<li><b>Payment received.</b> '+esc(x.package)+' — '+money(x.package_price)+'. Your receipt is on its way to '+esc(x.email)+'.</li>'
         :'<li><b>Payment.</b> We’ll email you a secure payment link with your schedule confirmation.</li>')+
    (GHL_WEBHOOK?'<li><b>We’ve received your enrollment.</b> Our team has your details — nothing else to send.</li>'
                :'<li><b>Send your enrollment details.</b> Your email app should have opened with them — press <b>Send</b>. Didn’t open? <a href="'+esc(mail)+'">Try again</a>.</li>'),
    paid?'You’re enrolled, ':'Thank you, ');
  if(GHL_WEBHOOK)sendToGHL(x);else location.href=mail;
}
function showDone(first,no,steps,greet){
  root.querySelector('.agc-wrap').innerHTML='<div class="done" tabindex="-1"><div class="ok"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#8A6A2C" stroke-width="2.6" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg></div>'+
    '<h2>'+greet+esc(first)+'!</h2>'+(no?'<span class="no">'+esc(no)+'</span>':'')+
    '<ol class="next">'+steps+'<li><b>Scheduling.</b> We’ll contact you within one business day to match your tutor and set your first session.</li></ol>'+
    '<p class="fine">Questions? Write to <a href="mailto:'+EMAIL+'">'+EMAIL+'</a>'+(no?' with your enrollment number':'')+'.</p>'+
    '<a class="home" href="/">Back to home</a></div>';
  var done=root.querySelector('.done');done.focus();window.scrollTo({top:root.offsetTop-80,behavior:'smooth'});
}

form.addEventListener('submit',function(e){
  e.preventDefault();
  var bad=Array.prototype.filter.call(form.elements,function(el){return el.willValidate&&!el.checkValidity();});
  err.hidden=!bad.length;
  if(bad.length){bad[0].focus();if(bad[0].type==='radio')bad[0].closest('.step').scrollIntoView({behavior:'smooth',block:'center'});return;}
  var p=buildEnrollment(),pay=PAY_LINKS[plan.id];
  if(!pay){complete(p.data,false);return;}                       // no checkout for this package: enroll now
  p.at=Date.now();
  if(!savePending(p)){                                            // browser won't store it: send now so nothing is lost
    p.data.payment_status='Sent to checkout (not yet paid)';
    if(GHL_WEBHOOK)sendToGHL(p.data);
  }
  var btn=form.querySelector('.submit');btn.disabled=true;btn.textContent='Opening secure checkout…';
  location.href=pay;
});

// Back from checkout?
(function(){
  var p=loadPending();
  if(q.get('paid')){
    history.replaceState(null,'',location.pathname);              // a refresh won't send it twice
    if(p){clearPending();complete(p.data,true);}
    else showDone('', '', '<li><b>Payment received.</b> Your receipt is on its way by email.</li>','Thank you');
    return;
  }
  if(p){                                                           // came back without paying: restore the form
    var pl=document.getElementById('pl-'+p.plan),pr=document.getElementById('pr-'+p.program);
    if(!q.get('plan')&&pl)pl.checked=true;if(pr)pr.checked=true;sync();
    FIELDS.forEach(function(n){if(p.fields[n]&&form.elements[n])form.elements[n].value=p.fields[n];});
    form.elements.agree.checked=true;sync();
  }
})();

/* Sends the enrollment to the GHL inbound webhook. Tries JSON first; if the browser blocks that
   (GHL not allowing cross-site JSON), sends the same fields as a plain form post instead. */
function sendToGHL(data){
  var json=JSON.stringify(data);
  function asForm(){
    var body=new URLSearchParams();Object.keys(data).forEach(function(k){body.append(k,data[k]==null?'':String(data[k]));});
    return fetch(GHL_WEBHOOK,{method:'POST',mode:'no-cors',keepalive:true,body:body});
  }
  try{
    return fetch(GHL_WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:json,keepalive:true})
      .then(function(r){if(!r.ok)throw new Error('GHL webhook '+r.status);})
      .catch(function(){return asForm();}).catch(function(){});
  }catch(e){return asForm().catch(function(){});}
}
})();
