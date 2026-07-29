/* ── UNIVERSE OVERLAY ──
   Injects, on every subpage that includes this file:
   - an ambient particle background canvas (#universe-bg)
   - a central hitbox that renders as a blackhole (dark theme) or a
     sun (light theme) and toggles the nav menu on click
   - a nav menu with a theme toggle, an About link, and the full
     JANUS + OptiBranch subsystem link lists

   No globals are exported; nothing outside this IIFE depends on it. */
(() => {
  'use strict';

  /* ---- theme resolution ----
     Priority: explicit ?theme= in the URL, then the session value set
     by hi.html / this script, then a previous localStorage value
     (about.html only reads localStorage), then 'dark'. */
  const params = new URLSearchParams(location.search);
  let theme = params.get('theme') || sessionStorage.getItem('janus-theme') || localStorage.getItem('janus-theme') || 'dark';
  theme = theme === 'light' ? 'light' : 'dark';
  sessionStorage.setItem('janus-theme', theme);

  const isDark = theme === 'dark';
  const accentRgb = isDark ? '85,133,255' : '184,112,16';

  /* ---- relative path resolution, so one file works from any folder ---- */
  const path = location.pathname;
  const inJanus = /\/Janus\//.test(path);
  const inOpti = /\/OptiBranch\//.test(path);
  const up = (inJanus || inOpti) ? '../' : './';
  const janusBase = inJanus ? './' : up + 'Janus/';
  const optiBase = inOpti ? './' : up + 'OptiBranch/';

  const JANUS_LINKS = [
    ['overview.html', 'Architecture Overview'],
    ['routing.html', 'Beneš Routing & PCM Switching'],
    ['onehot.html', 'One-Hot Optical RNS'],
    ['cmos.html', 'CMOS Backend'],
    ['compiler.html', 'JIR Compiler & Register File'],
    ['garner.html', 'CRT Garner Pipeline'],
    ['thermal.html', 'Thermal Controller'],
    ['priority.html', 'One-Hot Priority Encoder'],
    ['clock.html', 'Predictive Clock Gating'],
    ['fabrication.html', 'Fabrication & Yield Analysis'],
  ];
  const OPTI_LINKS = [
    ['o_overview.html', 'Architecture Overview'],
    ['o_psa.html', 'GaP PSA Stage & Phase Coherence'],
    ['o_tfln.html', 'TFLN Pockels Physics'],
    ['o_10phase.html', '10-Phase Slot Encoding'],
    ['o_nlmzi.html', 'NLMZI Binary Amplitude Gating'],
    ['o_wdm.html', 'Three-Lane Architecture'],
    ['o_dispersion.html', 'Dispersion Management'],
    ['o_thermal.html', 'Thermal Drift & PID Locking'],
    ['o_nonlinear.html', 'FWM / XPM / TPA Mitigation'],
    ['o_latency.html', 'Latency Analysis & Targets'],
  ];

  /* ---- menu ---- */
  function buildMenu() {
    const menu = document.createElement('nav');
    menu.id = 'universe-menu';
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('aria-label', 'JANUS site navigation');

    const controls = document.createElement('div');
    controls.className = 'u-controls';

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'u-toggle';
    toggleBtn.textContent = isDark ? 'Light Universe' : 'Dark Universe';
    toggleBtn.addEventListener('click', () => {
      const next = isDark ? 'light' : 'dark';
      sessionStorage.setItem('janus-theme', next);
      localStorage.setItem('janus-theme', next);
      const p = new URLSearchParams(location.search);
      p.set('theme', next);
      location.search = p.toString();
    });

    const aboutBtn = document.createElement('a');
    aboutBtn.className = 'u-about';
    aboutBtn.href = up + 'about.html';
    aboutBtn.textContent = 'About';

    const homeBtn = document.createElement('a');
    homeBtn.className = 'u-about';
    homeBtn.href = up + 'hi.html';
    homeBtn.textContent = '\u2190 Return to Universe';

    controls.appendChild(toggleBtn);
    controls.appendChild(aboutBtn);
    controls.appendChild(homeBtn);
    menu.appendChild(controls);

    function group(label, base, links) {
      const g = document.createElement('div');
      g.className = 'u-group';
      const l = document.createElement('div');
      l.className = 'u-group-label';
      l.textContent = label;
      g.appendChild(l);
      const list = document.createElement('div');
      list.className = 'u-group-links';
      links.forEach(([file, text]) => {
        const a = document.createElement('a');
        a.className = 'u-item';
        a.href = base + file + '?theme=' + theme;
        a.textContent = text;
        if (path.endsWith('/' + file)) a.setAttribute('aria-current', 'page');
        list.appendChild(a);
      });
      g.appendChild(list);
      return g;
    }

    menu.appendChild(group('JANUS', janusBase, JANUS_LINKS));
    menu.appendChild(group('OptiBranch', optiBase, OPTI_LINKS));

    document.body.appendChild(menu);
    return menu;
  }

  /* ---- hitbox: blackhole (dark) / sun (light) toggle button ---- */
  function buildHitbox() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'universe-hitbox';
    btn.setAttribute('aria-label', 'Open navigation menu');
    btn.setAttribute('aria-expanded', 'false');
    const canvas = document.createElement('canvas');
    canvas.width = 92;
    canvas.height = 92;
    btn.appendChild(canvas);
    document.body.appendChild(btn);
    return { btn, canvas };
  }

  function paintHitbox(canvas, t) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h);
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.05);

    if (isDark) {
      /* blackhole: dark core, glowing accretion ring */
      const ring = ctx.createRadialGradient(cx, cy, 10, cx, cy, 34);
      ring.addColorStop(0, 'rgba(0,0,0,0)');
      ring.addColorStop(0.62, `rgba(${accentRgb},${0.5 + pulse * 0.35})`);
      ring.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ring;
      ctx.beginPath(); ctx.arc(cx, cy, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#040406';
      ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.fill();
    } else {
      /* sun: warm glowing core */
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36);
      glow.addColorStop(0, 'rgba(255,224,150,0.95)');
      glow.addColorStop(0.42, `rgba(${accentRgb},${0.55 + pulse * 0.3})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, cy, 36, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff3d6';
      ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2); ctx.fill();
    }
  }

  /* ---- ambient particle background ---- */
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const small = Math.min(innerWidth, innerHeight) <= 480;
  const particleCount = reducedMotion ? 0 : (isTouch && small ? 40 : isTouch ? 70 : 130);

  function buildBgCanvas() {
    const c = document.createElement('canvas');
    c.id = 'universe-bg';
    document.body.insertBefore(c, document.body.firstChild);
    return c;
  }

  function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let vw = innerWidth, vh = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);

    function resize() {
      vw = innerWidth; vh = innerHeight;
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = vw + 'px';
      canvas.style.height = vh + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener('resize', resize);

    if (particleCount === 0) return;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * vw,
      y: Math.random() * vh,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.6 + 0.4,
      ph: Math.random() * Math.PI * 2,
    }));

    function frame(t) {
      ctx.clearRect(0, 0, vw, vh);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = vw; else if (p.x > vw) p.x = 0;
        if (p.y < 0) p.y = vh; else if (p.y > vh) p.y = 0;
        const alpha = 0.18 + 0.14 * Math.sin(t * 0.001 + p.ph);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${accentRgb},${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---- wire it all up ---- */
  function start() {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);

    initParticles(buildBgCanvas());

    const menu = buildMenu();
    const { btn, canvas: hbCanvas } = buildHitbox();

    let hbT = 0;
    (function hbLoop() {
      hbT++;
      paintHitbox(hbCanvas, hbT);
      requestAnimationFrame(hbLoop);
    })();

    let open = false;
    function setOpen(v) {
      open = v;
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
    }
    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!open); });
    document.addEventListener('click', (e) => {
      if (open && !menu.contains(e.target) && e.target !== btn) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
