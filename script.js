const progress = document.querySelector('.progress');
function updateProgress(){ if(!progress) return; const h=document.documentElement; const range=h.scrollHeight-h.clientHeight; progress.style.width=(range>0 ? (h.scrollTop/range)*100 : 0)+'%'; }
window.addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

// Welcome voice: autoplay is attempted but user interaction remains available in browser contexts that block sound.
const welcomeAudio=document.getElementById('welcomeVoice');
const welcomeWidget=document.getElementById('welcomeWidget');
const welcomeToggle=document.getElementById('welcomeToggle');
let welcomeTimer;
function showWelcome(){ if(!welcomeWidget)return; welcomeWidget.classList.add('show'); clearTimeout(welcomeTimer); }
function updateWelcomeUI(){
  if(!welcomeAudio||!welcomeWidget||!welcomeToggle)return;
  if(!welcomeAudio.paused){welcomeWidget.classList.add('playing','show');welcomeWidget.classList.remove('done');welcomeToggle.textContent='■ Stop welcome';}
  else if(welcomeAudio.ended){welcomeWidget.classList.remove('playing');welcomeWidget.classList.add('show','done');welcomeToggle.textContent='↻ Play again';}
  else{welcomeWidget.classList.remove('playing');welcomeToggle.textContent='▶ Play welcome';}
}
if(welcomeAudio&&welcomeToggle&&welcomeWidget){
  welcomeToggle.addEventListener('click',async()=>{
    if(welcomeAudio.paused){try{welcomeAudio.currentTime=0;await welcomeAudio.play();}catch(err){showWelcome();}}
    else{welcomeAudio.pause();welcomeAudio.currentTime=0;}
    updateWelcomeUI();
  });
  ['play','pause','ended'].forEach(evt=>welcomeAudio.addEventListener(evt,updateWelcomeUI));
  window.addEventListener('load',()=>{setTimeout(async()=>{try{await welcomeAudio.play();updateWelcomeUI();}catch(err){showWelcome();updateWelcomeUI();}},900);});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&welcomeAudio.paused&&!welcomeAudio.ended)showWelcome();});
}

// Work gallery: hover lift and accessible fullscreen lightbox.
(function(){
  const cards=[...document.querySelectorAll('.work-card')];
  const box=document.getElementById('workLightbox');
  const img=document.getElementById('lightboxImage');
  const caption=document.getElementById('lightboxCaption');
  const closeBtn=document.getElementById('lightboxClose');
  const prevBtn=document.getElementById('lightboxPrev');
  const nextBtn=document.getElementById('lightboxNext');
  if(!cards.length||!box||!img)return;
  let index=0,previousFocus=null;
  function open(i){
    index=(i+cards.length)%cards.length;const card=cards[index];const source=card.querySelector('img');if(!source)return;
    previousFocus=document.activeElement;img.src=source.currentSrc||source.src;img.alt=source.alt||'Work image';
    const cap=card.querySelector('figcaption');caption.textContent=cap?cap.innerText.replace('↗ View','').trim():img.alt;
    box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';if(closeBtn)closeBtn.focus();
  }
  function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';img.src='';if(previousFocus&&previousFocus.focus)previousFocus.focus();}
  cards.forEach((card,i)=>{card.addEventListener('click',()=>open(i));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i);}});});
  if(closeBtn)closeBtn.addEventListener('click',close);if(prevBtn)prevBtn.addEventListener('click',()=>open(index-1));if(nextBtn)nextBtn.addEventListener('click',()=>open(index+1));
  box.addEventListener('click',e=>{if(e.target===box)close();});
  document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')open(index-1);else if(e.key==='ArrowRight')open(index+1);});
})();


// RR cinematic motion system: content stays visible even if the observer is unavailable.
(function initRRCinematicMotion(){
  // The portfolio owner explicitly requested the full cinematic animation treatment.
  // Content remains visible by default even if JavaScript/IntersectionObserver is unavailable.
  document.documentElement.classList.add('rr-motion-ready');
  const targets = document.querySelectorAll(
    '#about .section-label, #about .stats > div, #experience .timeline article, ' +
    '#work .section-label, #work .section-head, #work .work-card, #skills .section-label, ' +
    '#skills .skill-grid > div, #test-prep .section-label, #test-prep .test-grid > div, ' +
    '#credentials .section-label, #credentials .credential, .education .section-label, ' +
    '.education h2, #contact .section-label, #contact .contact-box > div'
  );
  if (!targets.length) return;
  targets.forEach(el => el.classList.add('scroll-motion'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-enter');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -4% 0px' });
    targets.forEach(el => observer.observe(el));
  } else {
    targets.forEach(el => el.classList.add('motion-enter'));
  }
})();
