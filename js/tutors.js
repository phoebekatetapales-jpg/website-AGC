/* =====================================================================
   AGC Tutorials — Tutor Profile page script (tutors.html).
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

/* ---- Tutor profile ----
   The draft is saved in the browser (localStorage) so a tutor can come back and finish it.
   Submitting opens an email to EMAIL with the profile — the photo is only previewed, so tutors attach it to that email. */
(function(){
var EMAIL='rconcepcion@agctutorials.com',KEY='agcTutorProfile';
var GROUPS={
  subjects:['Math','Science','English','History','Writing','Reading','Executive Functioning','Test Prep'],
  grades:['Pre-K–2','3–5','6–8','9–12'],
  programs:['AGC Core Tutoring','AGC Anywhere','AGC Ascent Coaching'],
  formats:['In-person','Virtual'],
  days:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
};
var IDS={subjects:'tpSubjects',grades:'tpGrades',programs:'tpPrograms',formats:'tpFormats',days:'tpDays'};
var FIELDS=['name','city','email','phone','headline','years','degree','certs','bio','times','link'];
var form=document.getElementById('agcTutor'),err=document.getElementById('tpErr'),done=document.getElementById('tpDone');
function $(id){return document.getElementById(id);}

Object.keys(GROUPS).forEach(function(g){
  $(IDS[g]).innerHTML=GROUPS[g].map(function(v,i){
    var id='tp-'+g+'-'+i;
    return '<input type="checkbox" id="'+id+'" name="'+g+'" value="'+v+'"><label for="'+id+'">'+v+'</label>';
  }).join('');
});
function picked(g){return Array.prototype.map.call(form.querySelectorAll('input[name="'+g+'"]:checked'),function(c){return c.value;});}

/* --- draft --- */
function data(){
  var d={};FIELDS.forEach(function(n){d[n]=form.elements[n].value.trim();});
  Object.keys(GROUPS).forEach(function(g){d[g]=picked(g);});
  return d;
}
function load(){
  var d;try{d=JSON.parse(localStorage.getItem(KEY));}catch(e){}
  if(!d)return;
  FIELDS.forEach(function(n){if(typeof d[n]==='string')form.elements[n].value=d[n];});
  Object.keys(GROUPS).forEach(function(g){(d[g]||[]).forEach(function(v){
    var c=form.querySelector('input[name="'+g+'"][value="'+v.replace(/"/g,'')+'"]');if(c)c.checked=true;
  });});
  $('tpSaved').textContent='Draft restored from this device.';
}
var t;
function save(){
  clearTimeout(t);
  t=setTimeout(function(){
    try{localStorage.setItem(KEY,JSON.stringify(data()));$('tpSaved').textContent='Draft saved on this device.';}catch(e){}
  },400);
}

/* --- photo (preview only) --- */
var photo='';
function initials(n){var p=n.split(/\s+/).filter(Boolean);return p.length?(p[0][0]+(p.length>1?p[p.length-1][0]:'')).toUpperCase():'?';}
function avatar(el,name){
  if(photo){el.innerHTML='';var i=new Image();i.src=photo;i.alt='';el.appendChild(i);}
  else el.textContent=initials(name);
}
$('tpPhoto').addEventListener('change',function(){
  var f=this.files&&this.files[0];if(!f)return;
  var r=new FileReader();
  r.onload=function(){photo=r.result;$('tpPhotoRm').hidden=false;render();};
  r.readAsDataURL(f);
});
$('tpPhotoRm').addEventListener('click',function(){photo='';$('tpPhoto').value='';this.hidden=true;render();$('tpPhoto').focus();});

/* --- live preview --- */
function set(id,val,ph){var el=$(id);el.textContent=val||ph;el.classList.toggle('ph',!val);}
function render(){
  var d=data();
  avatar($('tpAvatar'),d.name);avatar($('pvAvatar'),d.name);
  set('pvName',d.name,'Your name');
  set('pvHeadline',d.headline,'Your headline');
  $('pvCity').textContent=d.city;
  set('pvBio',d.bio,'Your “About me” will appear here.');
  $('pvTags').innerHTML='';
  d.subjects.concat(d.programs).forEach(function(s){var sp=document.createElement('span');sp.textContent=s;$('pvTags').appendChild(sp);});
  set('pvYears',d.years,'—');set('pvDegree',d.degree,'—');
  set('pvGrades',d.grades.join(', '),'—');set('pvFormats',d.formats.join(' & '),'—');
  set('pvDays',d.days.join(', ')+(d.times?(d.days.length?' · ':'')+d.times:''),'—');
  $('tpCount').textContent=d.bio.length+' / 800';
}
form.addEventListener('input',function(e){
  if(e.target.type==='file')return;
  err.hidden=true;e.target.removeAttribute('aria-invalid');
  var g=e.target.closest('.group');if(g)g.classList.remove('bad');
  render();save();
});
$('tpClear').addEventListener('click',function(){
  if(!confirm('Clear everything you’ve entered?'))return;
  form.reset();photo='';$('tpPhoto').value='';$('tpPhotoRm').hidden=true;
  try{localStorage.removeItem(KEY);}catch(e){}
  $('tpSaved').textContent='';render();
});

/* --- submit --- */
var mail='';
form.addEventListener('submit',function(e){
  e.preventDefault();
  var bad=Array.prototype.filter.call(form.elements,function(el){
    if(el.type==='checkbox'&&el.name!=='agree')return false;
    var ok=!el.willValidate||el.checkValidity();
    if(el.willValidate){if(ok)el.removeAttribute("aria-invalid");else el.setAttribute("aria-invalid","true");}
    return !ok;
  });
  Object.keys(GROUPS).forEach(function(g){
    var box=form.querySelector('[data-group="'+g+'"]'),none=!picked(g).length;
    box.classList.toggle('bad',none);
    if(none)bad.push(box.querySelector('input'));
  });
  err.hidden=!bad.length;
  if(bad.length){bad.sort(function(a,b){return a.compareDocumentPosition(b)&2?1:-1;});bad[0].focus();return;}
  var d=data(),no='TUT-'+Date.now().toString(36).toUpperCase().slice(-6);
  var lines=['New tutor profile '+no,'',
    'Name: '+d.name,'Headline: '+d.headline,'City / area: '+d.city,'Email: '+d.email,'Phone: '+d.phone,'',
    'Experience: '+d.years,'Education: '+d.degree,d.certs?'Certifications: '+d.certs:'','',
    'About me:',d.bio,'',
    'Subjects: '+d.subjects.join(', '),'Grade levels: '+d.grades.join(', '),'Programs: '+d.programs.join(', '),'',
    'Format: '+d.formats.join(', '),'Days: '+d.days.join(', '),d.times?'Preferred times: '+d.times:'',d.link?'LinkedIn / résumé: '+d.link:'','',
    'Photo and résumé: attached to this email.'
  ].filter(function(s,j,a){return s!==''||a[j-1]!=='';});
  mail='mailto:'+EMAIL+'?subject='+encodeURIComponent('Tutor profile '+no+' — '+d.name)+'&body='+encodeURIComponent(lines.join('\n'));
  $('tpDoneTitle').textContent='Thank you, '+d.name.split(' ')[0]+'!';
  $('tpDoneNo').textContent=no;
  $('tpRetry').href=mail;
  form.hidden=true;done.hidden=false;done.focus();
  done.scrollIntoView({behavior:'smooth',block:'start'});
  location.href=mail;
});
done.querySelector('.mailto').href='mailto:'+EMAIL;
done.querySelector('.mailto').textContent=EMAIL;
$('tpEdit').addEventListener('click',function(){done.hidden=true;form.hidden=false;form.elements.name.focus();});

load();render();
})();
