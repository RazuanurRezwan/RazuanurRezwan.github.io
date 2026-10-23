const progress=document.querySelector('.progress');
window.addEventListener('scroll',()=>{const h=document.documentElement;progress.style.width=((h.scrollTop/(h.scrollHeight-h.clientHeight))*100)+'%';});
const setupReveal=()=>{
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal,section').forEach(el=>el.classList.add('visible'));
    return;
  }
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add('visible');
  }),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
};
window.addEventListener('load',()=>{
  setupReveal();
  document.querySelectorAll('section').forEach(el=>el.classList.add('visible'));
});

const welcomeAudio=document.getElementById('welcomeVoice');
const welcomeWidget=document.getElementById('welcomeWidget');
const welcomeToggle=document.getElementById('welcomeToggle');
let welcomeDismissTimer;
function showWelcome(){welcomeWidget.classList.add('show');clearTimeout(welcomeDismissTimer);welcomeDismissTimer=setTimeout(()=>{if(welcomeAudio.paused)welcomeWidget.classList.remove('show');},10000);}
function updateWelcomeUI(){
  if(!welcomeAudio) return;
  if(!welcomeAudio.paused){welcomeWidget.classList.add('playing','show');welcomeWidget.classList.remove('done');welcomeToggle.textContent='🔇 Stop welcome';}
  else if(welcomeAudio.ended){welcomeWidget.classList.remove('playing');welcomeWidget.classList.add('show','done');welcomeToggle.textContent='🔊 Play again';}
  else{welcomeWidget.classList.remove('playing');welcomeToggle.textContent='🔊 Play welcome';}
}
async function tryWelcomeAutoplay(){
  if(!welcomeAudio) return;
  try{await welcomeAudio.play();updateWelcomeUI();}
  catch(e){showWelcome();updateWelcomeUI();}
}
if(welcomeAudio&&welcomeToggle){
  welcomeToggle.addEventListener('click',async()=>{
    if(welcomeAudio.paused){try{await welcomeAudio.play();}catch(e){} } else {welcomeAudio.pause();welcomeAudio.currentTime=0;}
    updateWelcomeUI();
  });
  welcomeAudio.addEventListener('play',updateWelcomeUI);
  welcomeAudio.addEventListener('pause',updateWelcomeUI);
  welcomeAudio.addEventListener('ended',updateWelcomeUI);
  window.addEventListener('load',()=>{setTimeout(tryWelcomeAutoplay,500);});
}


// Work gallery: hover elevation + click-to-focus lightbox
(function(){
  const cards=[...document.querySelectorAll('.work-card')];
  const box=document.getElementById('workLightbox');
  const img=document.getElementById('lightboxImage');
  const caption=document.getElementById('lightboxCaption');
  const closeBtn=document.getElementById('lightboxClose');
  const prevBtn=document.getElementById('lightboxPrev');
  const nextBtn=document.getElementById('lightboxNext');
  if(!cards.length || !box || !img) return;
  let index=0;
  const open=(i)=>{
    index=(i+cards.length)%cards.length;
    const card=cards[index];
    const source=card.querySelector('img');
    img.src=source.currentSrc || source.src;
    img.alt=source.alt || 'Work image';
    const cap=card.querySelector('figcaption');
    caption.textContent=cap ? cap.innerText.replace('↗ View','').trim() : source.alt;
    box.classList.add('open');
    box.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    closeBtn && closeBtn.focus();
  };
  const close=()=>{
    box.classList.remove('open');
    box.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    img.src='';
  };
  cards.forEach((card,i)=>{
    card.addEventListener('click',()=>open(i));
    card.addEventListener('keydown',(e)=>{
      if(e.key==='Enter' || e.key===' '){e.preventDefault();open(i);}
    });
  });
  closeBtn && closeBtn.addEventListener('click',close);
  prevBtn && prevBtn.addEventListener('click',()=>open(index-1));
  nextBtn && nextBtn.addEventListener('click',()=>open(index+1));
  box.addEventListener('click',(e)=>{if(e.target===box) close();});
  document.addEventListener('keydown',(e)=>{
    if(!box.classList.contains('open')) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowLeft') open(index-1);
    else if(e.key==='ArrowRight') open(index+1);
  });
})();
