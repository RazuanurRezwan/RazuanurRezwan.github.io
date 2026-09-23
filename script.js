const progress=document.querySelector('.progress');
window.addEventListener('scroll',()=>{const h=document.documentElement;progress.style.width=((h.scrollTop/(h.scrollHeight-h.clientHeight))*100)+'%';});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal,section').forEach(el=>{el.classList.add('reveal');io.observe(el)});
