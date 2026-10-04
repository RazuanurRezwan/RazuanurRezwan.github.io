const progress=document.querySelector('.progress');
window.addEventListener('scroll',()=>{const h=document.documentElement;progress.style.width=((h.scrollTop/(h.scrollHeight-h.clientHeight))*100)+'%';});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal,section').forEach(el=>{el.classList.add('reveal');io.observe(el)});

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
