
(function(){
  const lightbox = document.getElementById('work-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const items = Array.from(document.querySelectorAll('.gallery figure'));
  let current = 0;

  function show(index){
    if(!items.length) return;
    current = (index + items.length) % items.length;
    const img = items[current].querySelector('img');
    const cap = items[current].querySelector('figcaption');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || 'Work sample';
    lightboxCaption.textContent = cap ? cap.textContent : '';
  }
  function open(index){
    show(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('lightbox-open');
  }
  function close(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-open');
  }
  items.forEach((figure, i)=> figure.addEventListener('click', ()=>open(i)));
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', ()=>show(current-1));
  nextBtn.addEventListener('click', ()=>show(current+1));
  lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) close(); });
  document.addEventListener('keydown', (e)=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') show(current-1);
    if(e.key==='ArrowRight') show(current+1);
  });
})();

const progress=document.querySelector('.progress');
window.addEventListener('scroll',()=>{const h=document.documentElement;progress.style.width=((h.scrollTop/(h.scrollHeight-h.clientHeight))*100)+'%';});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal,section').forEach(el=>{el.classList.add('reveal');io.observe(el)});
