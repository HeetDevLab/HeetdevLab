(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const header = $('.site-header');
  const toggle = $('#menuToggle');
  const menu = $('#mobileNav');
  const backdrop = $('#mobileBackdrop');
  const progress = $('#scrollProgress');
  const closeMenu = () => {
    toggle?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('active');
    backdrop?.classList.remove('active');
    document.body.classList.remove('menu-open');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    menu?.classList.toggle('active', open);
    backdrop?.classList.toggle('active', open);
    document.body.classList.toggle('menu-open', open);
  });
  backdrop?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    header?.classList.toggle('scrolled', scrollY > 35);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('is-visible'));
  $('#year').textContent = new Date().getFullYear();

  // A small arrow swarm trails the mouse on desktops; it is disabled for reduced motion and touch-only devices.
  const canvas = $('#arrowCanvas'), ctx = canvas?.getContext('2d');
  if (!ctx || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine)').matches) return;
  let width=0,height=0,raf=0,last=null; const particles=[];
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.7);width=innerWidth;height=innerHeight;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0)};
  const spawn=(x,y,vx,vy)=>{for(let i=0;i<3;i++){if(particles.length>90)particles.shift();particles.push({x:x+(Math.random()-.5)*13,y:y+(Math.random()-.5)*13,vx:-vx*.14+(Math.random()-.5),vy:-vy*.14+(Math.random()-.5),angle:Math.atan2(vy,vx)+(Math.random()-.5)*.7,life:1,size:4+Math.random()*4,turn:(Math.random()-.5)*.025})}if(!raf)raf=requestAnimationFrame(draw)};
  const draw=()=>{raf=0;ctx.clearRect(0,0,width,height);for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.angle+=p.turn;p.life-=.018;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.globalAlpha=Math.max(0,p.life)*.72;ctx.strokeStyle=i%4===0?'#ffd5d6':'#f14d58';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-p.size*.7,-p.size*.55);ctx.lineTo(p.size*.65,0);ctx.lineTo(-p.size*.7,p.size*.55);ctx.stroke();ctx.restore();if(p.life<=0)particles.splice(i,1)}if(particles.length)raf=requestAnimationFrame(draw)};
  resize();addEventListener('resize',resize,{passive:true});addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;if(!last){last={x:e.clientX,y:e.clientY};return}const vx=e.clientX-last.x,vy=e.clientY-last.y;if(Math.abs(vx)+Math.abs(vy)>2)spawn(e.clientX,e.clientY,vx,vy);last={x:e.clientX,y:e.clientY}},{passive:true});
})();
