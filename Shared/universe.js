/* ── UNIVERSE OVERLAY & HIGH-FIDELITY ENGINE ──
   Shared across all JANUS & OptiBranch subsystem pages and about.html.
   Ports hi.html's high-fidelity celestial renderer (Black Hole / Star),
   multi-species particle physics (Photons, Dust, Ice), mouse cursor trails,
   and glassmorphic dual-universe navigation. */

(() => {
  'use strict';

  /* ═══════════════════════════════════════════════
     THEME RESOLUTION & SYNC
     ═══════════════════════════════════════════════ */
  const params = new URLSearchParams(window.location.search);
  let theme = params.get('theme') || sessionStorage.getItem('janus-theme') || localStorage.getItem('janus-theme') || 'dark';
  theme = theme === 'light' ? 'light' : 'dark';
  
  // Persist across sessions
  sessionStorage.setItem('janus-theme', theme);
  localStorage.setItem('janus-theme', theme);
  
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) document.body.setAttribute('data-theme', theme);

  const isDark = theme === 'dark';
  const accentRgb = isDark ? '85,133,255' : '184,112,16';
  const accentHex = isDark ? '#5585ff' : '#b87010';

  /* ═══════════════════════════════════════════════
     DEVICE CAPABILITIES & CONFIG
     ═══════════════════════════════════════════════ */
  const isTouch = matchMedia('(pointer: coarse)').matches;
  const smallScreen = Math.min(innerWidth, innerHeight) <= 480 || innerWidth <= 820;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const particleCount = reducedMotion ? 0 : (isTouch && smallScreen ? 60 : isTouch ? 100 : 180);
  const cursorParticleCount = reducedMotion || isTouch ? 0 : 10;

  /* ═══════════════════════════════════════════════
     NAVIGATION LINKS MAP
     ═══════════════════════════════════════════════ */
  const path = window.location.pathname;
  const inJanus = /\/Janus\//.test(path);
  const inOpti = /\/OptiBranch\//.test(path);
  const up = (inJanus || inOpti) ? '../' : './';
  const janusBase = inJanus ? './' : up + 'Janus/';
  const optiBase = inOpti ? './' : up + 'OptiBranch/';

  const JANUS_LINKS = [
    ['overview.html', 'Architecture Overview'],
    ['constraints.html', 'Physical Constraint Landscape'],
    ['onehot.html', 'One-Hot Optical RNS'],
    ['benes_routing.html', 'Dilated Beneš Routing'],
    ['fanout_apd.html', 'Passive Fan-Out & APD Array'],
    ['single_wave.html', 'Single-Wavelength Injection'],
    ['qrns_crt.html', 'PRNS & CRT Reconstruction'],
    ['strongarm_readout.html', 'StrongARM Dynamic Readout'],
    ['cmos_backend.html', 'CMOS Digital Backend'],
    ['jir_controller.html', 'JIR Controller & RRNS'],
    ['wave_pipelining.html', '100 GHz Wave-Pipelining'],
    ['thermal_stack.html', '3D Z-Axis Thermal Stack'],
    ['power_throughput.html', 'Power & Throughput Profiles'],
    ['fabrication.html', '3D Packaging & Open Challenges'],
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

  /* ═══════════════════════════════════════════════
     SPRITE & GRADIENT PERFORMANCE CACHES
     ═══════════════════════════════════════════════ */
  const spriteCache = new Map();
  const gradientCache = new Map();

  function getGlowSprite(radius, stops) {
    const r = Math.max(1, Math.ceil(radius));
    const key = r + stops.map(([p, c]) => `${p}:${c}`).join('|');
    if (spriteCache.has(key)) return spriteCache.get(key);

    const size = r * 2;
    const sprite = document.createElement('canvas');
    sprite.width = size;
    sprite.height = size;
    const sctx = sprite.getContext('2d');
    const g = sctx.createRadialGradient(r, r, 0, r, r, r);
    stops.forEach(([pos, color]) => g.addColorStop(pos, color));
    sctx.fillStyle = g;
    sctx.beginPath();
    sctx.arc(r, r, r, 0, Math.PI * 2);
    sctx.fill();
    spriteCache.set(key, sprite);
    return sprite;
  }

  function drawGlow(ctx, x, y, radius, stops) {
    const sprite = getGlowSprite(radius, stops);
    ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
  }

  function cachedRadialGradient(ctx, key, cx, cy, r0, r1, stops) {
    const qKey = `${key}:${Math.round(cx / 4)}:${Math.round(cy / 4)}:${Math.round(r0 / 2)}:${Math.round(r1 / 2)}`;
    if (gradientCache.has(qKey)) return gradientCache.get(qKey);
    const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
    stops.forEach(([pos, color]) => g.addColorStop(pos, color));
    gradientCache.set(qKey, g);
    if (gradientCache.size > 120) gradientCache.delete(gradientCache.keys().next().value);
    return g;
  }

  function cachedRadialGradientFull(ctx, key, x0, y0, r0, x1, y1, r1, stops) {
    const qKey = `${key}:${Math.round(x0 / 4)}:${Math.round(y0 / 4)}:${Math.round(r0 / 2)}:${Math.round(x1 / 4)}:${Math.round(y1 / 4)}:${Math.round(r1 / 2)}`;
    if (gradientCache.has(qKey)) return gradientCache.get(qKey);
    const g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    stops.forEach(([pos, color]) => g.addColorStop(pos, color));
    gradientCache.set(qKey, g);
    if (gradientCache.size > 120) gradientCache.delete(gradientCache.keys().next().value);
    return g;
  }

  /* ═══════════════════════════════════════════════
     HIGH-FIDELITY CANVAS RENDERING SYSTEM
     ═══════════════════════════════════════════════ */
  function initCelestialCanvas() {
    let canvas = document.getElementById('universe-bg');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'universe-bg';
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    const ctx = canvas.getContext('2d');
    let vw = window.innerWidth, vh = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = vw + 'px';
      canvas.style.height = vh + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── MOUSE PARTICLES ── */
    let mouseX = vw / 2, mouseY = vh / 2;
    if (cursorParticleCount > 0) {
      window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
    }

    const cparts = Array.from({ length: cursorParticleCount }, () => ({
      x: vw / 2,
      y: vh / 2,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      sz: Math.random() * 2.2 + 0.5,
      ph: Math.random() * Math.PI * 2,
      ps: 0.04 + Math.random() * 0.05,
      lag: 0.025 + Math.random() * 0.055,
      drift: Math.random() * 0.8 + 0.3
    }));

    function drawCursorParticles() {
      if (cursorParticleCount === 0) return;
      cparts.forEach(p => {
        p.vx += (mouseX - p.x) * p.lag * 0.07 + (Math.random() - 0.5) * p.drift;
        p.vy += (mouseY - p.y) * p.lag * 0.07 + (Math.random() - 0.5) * p.drift;
        p.vx *= 0.87;
        p.vy *= 0.87;
        p.x += p.vx;
        p.y += p.vy;
        p.ph += p.ps;

        const alpha = (0.22 + 0.2 * Math.sin(p.ph)) * 0.9;
        if (alpha < 0.02) return;

        const c = isDark ? 'rgba(90,132,255,' : 'rgba(255,215,30,';
        const glowR = p.sz * 11;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = c + '1)';
        ctx.fill();

        drawGlow(ctx, p.x, p.y, glowR, [[0, c + '.56)'], [1, c + '0)']]);
        ctx.globalAlpha = 1;
      });
    }

    /* ── MULTI-SPECIES PARTICLES ── */
    class Particle {
      constructor() {
        this.spawn();
      }
      spawn() {
        this.x = Math.random() * vw;
        this.y = Math.random() * vh;
        this.vx = (Math.random() - 0.5) * 1.1;
        this.vy = (Math.random() - 0.5) * 1.1;
        this.sz = isDark ? Math.random() * 3.0 + 0.2 : Math.random() * 3.8 + 0.4;
        this.ba = isDark ? Math.random() * 0.65 + 0.1 : Math.random() * 0.72 + 0.15;
        this.ph = Math.random() * Math.PI * 2;
        this.ps = 0.012 + Math.random() * 0.032;

        if (isDark) {
          const r = Math.random();
          this.kind = r < 0.48 ? 'photon' : r < 0.76 ? 'dust' : 'ice';
        } else {
          this.kind = 'photon';
        }
      }
      upd() {
        this.ph += this.ps;
        this.a = this.ba * (0.68 + 0.32 * Math.sin(this.ph));
        this.x += this.vx;
        this.y += this.vy;

        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.04;
        this.vx = Math.max(-1.3, Math.min(1.3, this.vx));
        this.vy = Math.max(-1.3, Math.min(1.3, this.vy));

        if (this.x < 10) this.vx = Math.abs(this.vx);
        if (this.x > vw - 10) this.vx = -Math.abs(this.vx);
        if (this.y < 10) this.vy = Math.abs(this.vy);
        if (this.y > vh - 10) this.vy = -Math.abs(this.vy);
      }
      draw() {
        if (this.a < 0.02) return;

        if (!isDark) {
          // Light Universe: Gold photon with white-hot core
          const c = 'rgba(255,218,28,';
          const glowR = this.sz * 10;

          ctx.globalAlpha = Math.min(1, this.a * 0.45);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
          ctx.fillStyle = c + '1)';
          ctx.fill();

          // Bright white-hot core
          ctx.globalAlpha = Math.min(1, this.a * 0.7);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.sz * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,230,1)';
          ctx.fill();

          ctx.globalAlpha = Math.min(1, this.a * 0.3);
          drawGlow(ctx, this.x, this.y, glowR, [[0, c + '.6)'], [1, c + '0)']]);
          ctx.globalAlpha = 1;
          return;
        }

        // Dark Universe: Multi-species (Dust, Ice, Blue Photon)
        if (this.kind === 'dust') {
          const c = 'rgba(180,152,118,';
          ctx.globalAlpha = Math.min(1, this.a * 0.75);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.sz * 0.78, 0, Math.PI * 2);
          ctx.fillStyle = c + '1)';
          ctx.fill();
          ctx.globalAlpha = Math.min(1, this.a * 0.35);
          drawGlow(ctx, this.x, this.y, this.sz * 3.2, [[0, c + '.32)'], [1, c + '0)']]);
          ctx.globalAlpha = 1;
          return;
        }

        if (this.kind === 'ice') {
          const c = 'rgba(198,230,255,';
          ctx.globalAlpha = Math.min(1, this.a * 1.05);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.sz * 0.82, 0, Math.PI * 2);
          ctx.fillStyle = c + '1)';
          ctx.fill();
          ctx.globalAlpha = Math.min(1, this.a * 0.8);
          drawGlow(ctx, this.x, this.y, this.sz * 6, [[0, c + '.5)'], [1, c + '0)']]);
          ctx.globalAlpha = 1;
          return;
        }

        // Blue photon (default)
        const c = 'rgba(90,132,255,';
        const glowR = this.sz * 8;
        ctx.globalAlpha = Math.min(1, this.a);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
        ctx.fillStyle = c + '1)';
        ctx.fill();
        ctx.globalAlpha = Math.min(1, this.a);
        drawGlow(ctx, this.x, this.y, glowR, [[0, c + '.46)'], [1, c + '0)']]);
        ctx.globalAlpha = 1;
      }
    }

    const particles = Array.from({ length: particleCount }, () => new Particle());

    /* ── CELESTIAL CORNER OBJECT (BLACK HOLE / STAR) ── */
    function drawCelestialObject(t) {
      const pulse = 0.96 + 0.04 * Math.sin(t * 0.72);
      const rBase = 22 * pulse;
      const rObj = rBase * 10; // Scaled corner presence matching hi.html post-selection

      if (isDark) {
        // ── BLACK HOLE (TOP-LEFT CORNER) ──
        const cx = 0, cy = 0;
        ctx.save();
        ctx.globalAlpha = 0.88;

        // Gravitational field
        const gf = cachedRadialGradient(ctx, 'bh-field', cx, cy, rObj * 0.8, rObj * 2.65, [
          [0, 'rgba(52,94,255,.52)'],
          [0.55, 'rgba(20,42,150,.24)'],
          [1, 'rgba(0,0,0,0)']
        ]);
        ctx.fillStyle = gf;
        ctx.beginPath();
        ctx.arc(cx, cy, rObj * 2.65, 0, Math.PI * 2);
        ctx.fill();

        // Accretion disk
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1.58, 0.21);
        const ad = cachedRadialGradient(ctx, 'bh-disk', 0, 0, rObj * 0.86, rObj * 1.85, [
          [0, 'rgba(135,182,255,.9)'],
          [0.42, 'rgba(70,122,255,.52)'],
          [1, 'rgba(8,26,108,0)']
        ]);
        ctx.fillStyle = ad;
        ctx.beginPath();
        ctx.arc(0, 0, rObj * 1.85, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Event horizon
        const eh = cachedRadialGradient(ctx, 'bh-horizon', cx, cy, 0, rObj, [
          [0, 'rgba(22,40,82,1)'],
          [0.5, 'rgba(10,18,42,1)'],
          [1, 'rgba(2,3,8,1)']
        ]);
        ctx.fillStyle = eh;
        ctx.beginPath();
        ctx.arc(cx, cy, rObj, 0, Math.PI * 2);
        ctx.fill();

        // Relativistic warm accretion ring
        const innerR = rObj * 1.02, outerR = rObj * 1.34;
        const spin = t * (Math.PI / 4);

        ctx.save();
        ctx.globalAlpha *= 0.55;
        const ringGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
        ringGrad.addColorStop(0, '#0a0705');
        ringGrad.addColorStop(0.22, '#20130a');
        ringGrad.addColorStop(0.42, '#5e4020');
        ringGrad.addColorStop(0.58, '#6d675a');
        ringGrad.addColorStop(0.72, '#8a6c30');
        ringGrad.addColorStop(0.86, '#a3893c');
        ringGrad.addColorStop(1, '#ada284');

        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
        ctx.fillStyle = ringGrad;
        ctx.fill('evenodd');

        if (ctx.createConicGradient) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
          ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
          ctx.clip('evenodd');
          ctx.globalCompositeOperation = 'lighter';
          const glow = ctx.createConicGradient(spin, cx, cy);
          glow.addColorStop(0, 'rgba(255,244,214,0)');
          glow.addColorStop(0.18, 'rgba(255,244,214,.12)');
          glow.addColorStop(0.36, 'rgba(255,244,214,0)');
          glow.addColorStop(1, 'rgba(255,244,214,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(cx - outerR, cy - outerR, outerR * 2, outerR * 2);
          ctx.restore();
        }
        ctx.restore();

        ctx.restore();
      } else {
        // ── RADIANT STAR (TOP-RIGHT CORNER) ──
        const cx = vw, cy = 0;
        ctx.save();
        ctx.globalAlpha = 0.88;

        // Corona
        const co = cachedRadialGradient(ctx, 'star-corona', cx, cy, rObj * 0.3, rObj * 3.2, [
          [0, 'rgba(255,248,166,.98)'],
          [0.22, 'rgba(255,210,46,.68)'],
          [0.62, 'rgba(255,154,8,.24)'],
          [1, 'rgba(255,88,0,0)']
        ]);
        ctx.fillStyle = co;
        ctx.beginPath();
        ctx.arc(cx, cy, rObj * 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Photon ring aureole
        const pr = cachedRadialGradient(ctx, 'star-ring', cx, cy, rObj * 0.82, rObj * 1.38, [
          [0, 'rgba(255,255,210,1)'],
          [0.52, 'rgba(255,240,84,.72)'],
          [1, 'rgba(255,200,10,0)']
        ]);
        ctx.fillStyle = pr;
        ctx.beginPath();
        ctx.arc(cx, cy, rObj * 1.38, 0, Math.PI * 2);
        ctx.fill();

        // Solar rays
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 + t * 0.09;
          const len = rObj * (1.36 + 0.44 * Math.sin(t * 0.42 + i * 1.28));
          ctx.strokeStyle = 'rgba(255,222,78,.18)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(a) * rObj, cy + Math.sin(a) * rObj);
          ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
          ctx.stroke();
        }

        // Star body
        const sb = cachedRadialGradientFull(ctx, 'star-body', cx - rObj * 0.22, cy + rObj * 0.24, 0, cx, cy, rObj, [
          [0, '#fff'],
          [0.38, '#fff8d2'],
          [0.74, '#ffe054'],
          [1, '#ffaa00']
        ]);
        ctx.fillStyle = sb;
        ctx.beginPath();
        ctx.arc(cx, cy, rObj, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    /* ── MAIN ANIMATION LOOP ── */
    const T0 = Date.now();
    let animId = null;

    function loop() {
      const t = (Date.now() - T0) / 1000;
      ctx.clearRect(0, 0, vw, vh);

      // Render celestial corner object
      drawCelestialObject(t);

      // Render ambient particles
      particles.forEach(p => {
        p.upd();
        p.draw();
      });

      // Render cursor particles
      drawCursorParticles();

      animId = requestAnimationFrame(loop);
    }

    if (reducedMotion) {
      drawCelestialObject(0);
      particles.forEach(p => p.draw());
    } else {
      loop();
    }

    window.addEventListener('pagehide', () => {
      if (animId !== null) cancelAnimationFrame(animId);
    });
  }

  /* ═══════════════════════════════════════════════
     HITBOX & NAVIGATION MENU UI
     ═══════════════════════════════════════════════ */
  function buildHitbox() {
    let btn = document.getElementById('universe-hitbox');
    if (btn) return btn;

    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'universe-hitbox';
    btn.setAttribute('aria-label', isDark ? 'Open Black Hole navigation menu' : 'Open Star navigation menu');
    btn.setAttribute('aria-expanded', 'false');
    document.body.appendChild(btn);

    return btn;
  }

  function buildMenu() {
    let menu = document.getElementById('universe-menu');
    if (menu) return menu;

    menu = document.createElement('nav');
    menu.id = 'universe-menu';
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('aria-label', 'JANUS Navigation');

    const controls = document.createElement('div');
    controls.className = 'u-controls';

    // Universe Switcher Button
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'u-toggle';
    toggleBtn.innerHTML = `<span>${isDark ? '☀ Switch to Light' : '☽ Switch to Dark'}</span>`;
    toggleBtn.addEventListener('click', () => {
      const next = isDark ? 'light' : 'dark';
      sessionStorage.setItem('janus-theme', next);
      localStorage.setItem('janus-theme', next);
      const p = new URLSearchParams(window.location.search);
      p.set('theme', next);
      window.location.search = p.toString();
    });

    // About Button
    const aboutBtn = document.createElement('a');
    aboutBtn.className = 'u-about';
    aboutBtn.href = up + 'about.html?theme=' + theme;
    aboutBtn.innerHTML = `<span class="u-pring"></span><span>About</span>`;

    // Homepage Split View Button
    const splitBtn = document.createElement('a');
    splitBtn.className = 'u-item u-split';
    splitBtn.href = up + 'hi.html?split=1';
    splitBtn.innerHTML = `<span>◫ Homepage (Split View)</span>`;
    splitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('janus-theme');
      localStorage.removeItem('janus-theme');
      window.location.href = up + 'hi.html?split=1';
    });

    // Navigation Guide Button
    const guideBtn = document.createElement('a');
    guideBtn.className = 'u-item u-guide';
    guideBtn.href = up + 'hi.html?guide=1';
    guideBtn.innerHTML = `<span>ℹ Navigation Guide</span>`;

    // Return to Current Universe Button
    const homeBtn = document.createElement('a');
    homeBtn.className = 'u-item';
    homeBtn.href = up + 'hi.html';
    homeBtn.innerHTML = `<span>← Return to ${isDark ? 'Dark Universe' : 'Light Universe'}</span>`;

    controls.appendChild(toggleBtn);
    controls.appendChild(aboutBtn);
    controls.appendChild(guideBtn);
    controls.appendChild(splitBtn);
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
        if (path.endsWith('/' + file) || path.endsWith(file)) {
          a.setAttribute('aria-current', 'page');
        }
        list.appendChild(a);
      });
      g.appendChild(list);
      return g;
    }

    menu.appendChild(group('JANUS Subsystems', janusBase, JANUS_LINKS));
    menu.appendChild(group('OptiBranch Subsystems', optiBase, OPTI_LINKS));

    document.body.appendChild(menu);
    return menu;
  }

  function setupReturnButtons() {
    document.querySelectorAll('.return-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = up + 'hi.html?theme=' + theme;
      });
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════ */
  function start() {
    initCelestialCanvas();
    const btn = buildHitbox();
    const menu = buildMenu();
    setupReturnButtons();

    let open = false;
    function setOpen(v) {
      open = v;
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!open);
    });

    document.addEventListener('click', (e) => {
      if (open && !menu.contains(e.target) && e.target !== btn) {
        setOpen(false);
      }
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
