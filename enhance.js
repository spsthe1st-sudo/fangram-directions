/* FanGram — shared interaction & motion layer (improvement loop, cycle 1) */
(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(pointer:fine)').matches;

  /* scroll progress bar */
  var bar = document.createElement('div'); bar.className = 'scrollprog';
  document.body.appendChild(bar);
  var doc = document.documentElement, spTick = false;
  function sp(){ spTick = false; var p = doc.scrollTop / ((doc.scrollHeight - doc.clientHeight) || 1); bar.style.transform = 'scaleX(' + p + ')'; }
  addEventListener('scroll', function(){ if(!spTick){ spTick = true; requestAnimationFrame(sp); } }, {passive:true});
  sp();

  if (RM) return;

  /* hero parallax — subtle layered depth while the hero is in view */
  var plx = [];
  document.querySelectorAll('.hero-bg,.glow,.hero-fig,.orbwrap,.orb,.ring,[data-plx]').forEach(function(el){
    var sp = el.classList.contains('hero-fig') || el.classList.contains('orbwrap') ? 0.10 :
             el.classList.contains('glow') || el.classList.contains('orb') ? 0.22 : 0.16;
    plx.push([el, sp]);
  });
  var pTick = false;
  function par(){ pTick = false; var y = scrollY; if (y > innerHeight*1.3) return;
    for (var i=0;i<plx.length;i++){ plx[i][0].style.transform = 'translate3d(0,' + (y*plx[i][1]).toFixed(1) + 'px,0)'; } }
  if (plx.length) addEventListener('scroll', function(){ if(!pTick){ pTick = true; requestAnimationFrame(par); } }, {passive:true});

  if (!FINE) return;

  /* 3D tilt on cards + shine that follows the cursor */
  var cards = document.querySelectorAll('.pcard,.vcard,.ocard,.wcard,.tcard,.prcard,.step,.rcard,.bcard,.card');
  cards.forEach(function(c){
    c.classList.add('tiltable');
    var shine = document.createElement('span'); shine.className = 'tiltshine'; c.appendChild(shine);
    var raf = null, tx = 0, ty = 0;
    c.addEventListener('mousemove', function(e){
      var r = c.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      tx = (px - 0.5), ty = (py - 0.5);
      shine.style.setProperty('--mx', (px*100) + '%');
      shine.style.setProperty('--my', (py*100) + '%');
      shine.style.opacity = 1;
      if (!raf) raf = requestAnimationFrame(function(){
        raf = null;
        c.style.transform = 'perspective(760px) rotateY(' + (tx*6).toFixed(2) + 'deg) rotateX(' + (-ty*6).toFixed(2) + 'deg) translateY(-5px)';
      });
    });
    c.addEventListener('mouseleave', function(){ c.style.transform = ''; shine.style.opacity = 0; });
  });

  /* magnetic pull on buttons */
  var mags = document.querySelectorAll('.b1,.b2,.ncta,.cta1,.bcta');
  mags.forEach(function(m){
    m.addEventListener('mousemove', function(e){
      var r = m.getBoundingClientRect();
      var x = e.clientX - r.left - r.width/2, y = e.clientY - r.top - r.height/2;
      m.style.transform = 'translate(' + (x*0.28).toFixed(1) + 'px,' + (y*0.4).toFixed(1) + 'px)';
    });
    m.addEventListener('mouseleave', function(){ m.style.transform = ''; });
  });
})();
