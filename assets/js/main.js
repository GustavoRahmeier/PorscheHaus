(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Foto ausente: mostra o nome do arquivo esperado, sem trocar por outra imagem
  $$('.ph img').forEach(img => {
    const miss = () => { const p = img.closest('.ph'); p.classList.add('missing'); p.dataset.file = img.getAttribute('src'); };
    img.addEventListener('error', miss);
    if (img.complete && !img.naturalWidth) miss();
  });

  const header = $('.header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 60);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  const burger = $('.burger'), nav = $('#menu');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));

  const links = $$('.nav a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['inicio', 'historia', 'espaco', 'eventos', 'galeria', 'contato'].forEach(id => { const s = document.getElementById(id); s && spy.observe(s); });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  const lb = $('.lb'), lbImg = $('img', lb), shots = $$('[data-lightbox] img');
  let cur = 0, opener = null;
  const show = i => { cur = (i + shots.length) % shots.length; lbImg.src = shots[cur].src; lbImg.alt = shots[cur].alt; };
  const open = i => { opener = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb__x').focus(); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); };
  shots.forEach((img, i) => img.closest('.g').addEventListener('click', () => { if (!img.closest('.ph').classList.contains('missing')) open(i); }));
  $('.lb__x').onclick = close; $('.lb__p').onclick = () => show(cur - 1); $('.lb__n').onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (lb.hidden) { if (e.key === 'Escape') setMenu(false); return; }
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
  let x0 = 0;
  lb.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });

  $('#ano').textContent = new Date().getFullYear();
})();
