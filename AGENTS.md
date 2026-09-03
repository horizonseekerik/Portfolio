# JANUS Portfolio — AI Agent Instructions

## Project Overview

This is **Deepanshu's portfolio website** showcasing **JANUS**: a hybrid photonic-electronic processor for RNS (Residue Number System) integer computation. The architecture is a multi-page interactive experience built on:

- **Front-end**: Animated dual-universe split-screen homepage ([hi.html](hi.html))
- **Deep-dive subsystem pages**: 10 standalone technical explorations in [./Janus/](./Janus/)

## Homepage Architecture (hi.html)

### State Machine

The homepage operates as a three-state visual narrative:

```
SPLIT → CHOOSING → DARK / LIGHT
```

- **SPLIT**: Both universes visible, user chooses one by clicking half
- **CHOOSING**: Animated transition (animated edge, object migration)
- **DARK / LIGHT**: Single active universe, full-screen content panels

### Visual Metaphor

- **Dark Universe**: Black hole with accretion disk (left side) — represents the discrete, quantum world of optics
- **Light Universe**: Star with corona (right side) — represents the classical, continuous light physics
- **Particle System**: 115 photons/dust/ice grains orbit between the two, representing the duality of photon behavior

### Navigation

The menu system appears when clicking the central object (hitbox). It offers:
- **aB**: About (Phase 2)
- **sB**: Switch Universe (only visible after universe selection)
- **jB**: JANUS Architecture (10 subsystems) — **links to ./Janus/ pages**
- **oB**: OptiBranch (Phase 2)

### Theme State Variable

`ST` (state) = `'DARK'`, `'LIGHT'`, `'SPLIT'`, or `'CHOOSING'`

Color scheme is derived from ST:
- DARK: Blue accents (#5585ff), dark backgrounds
- LIGHT: Gold/amber accents (#b87010), cream backgrounds

## JANUS Subsystem Pages (./Janus/)

### Routing Convention

Each page is accessed via a dropdown link in hi.html's JANUS menu:

```html
<a class="ddi" data-janus-page="Janus/overview.html">Architecture Overview</a>
```

The event handler appends the current theme as a query parameter:

```javascript
window.location.href = page + '?theme=' + theme;
```

Where `theme` = `'dark'` or `'light'` (derived from ST).

### File Structure (14 Subsystem Deep Dives)

Each file is a **standalone, self-contained HTML document** that:

1. **Reads theme from URL on load** → `new URLSearchParams(window.location.search).get('theme')`
2. **Applies theme-aware styling** via `universe.css` and `universe.js`
3. **Renders responsive procedural animation via Canvas + requestAnimationFrame**
4. **Displays technical formulas, metrics, and proofs** directly extracted from `main.pdf` (Patent App. No.: 202611052791)
5. **Provides high-contrast return buttons and celestial portal**

### Expected Files (14 Comprehensive Deep Dives)

| File | Title | Primary Focus from `main.pdf` |
|------|-------|-------------------------------|
| `overview.html` | Architecture Overview | End-to-end 6-block pipeline, 100 GHz wave-pipelined operation, and sustained INT64 throughput. |
| `constraints.html` | Physical Constraint Landscape | Mathematical proofs of 5 analog failure modes: 138.4 dB SNR collapse, 100.67 kW heater dissipation, Kerr FWM/XPM mixing, ASE noise, and thermal drift. |
| `onehot.html` | One-Hot Optical RNS | 256-waveguide spatial basis ($x \to e_x$), binary presence decision ($D_k = 1$), and permutation multiplication ($\text{Carry Delay} \to 0$). |
| `benes_routing.html` | Dilated Beneš Routing | 15-stage dilated Beneš network, 1.006B GST-467 switches, 0 W static power, and 25 nm void gap with $10^6\text{--}10^8$ cycle endurance. |
| `fanout_apd.html` | Passive Fan-Out & APD Array | 100 W 1064 nm Yb-fiber laser, 1:2¹⁸ MMI passive tree ($262,144$ ports), Ge/Si $\text{SAC}^2\text{M}$ APD array, and **+4.61 dB link margin** without ASE noise. |
| `single_wave.html` | Single-Wavelength Injection | Single carrier frequency ($N_\lambda=1$), suppression of FWM/XPM ghost channels, and active $1\times 256\ \text{LiTaO}_3$ Pockels routers ($50\text{ aJ/switch}$). |
| `qrns_crt.html` | QRNS & CRT Reconstruction | Dual-cluster QRNS diagonalizing 64-bit multiplications into 2 parallel 8-tile streams ($Z^+, Z^-$), official 8-modulus registry, and CRT fault visibility ($P_{\text{silent}} \to 0$). |
| `strongarm_readout.html` | StrongARM Dynamic Readout | Event-driven StrongARM regenerative latches ($100\text{ aJ/detection}$), interleaved two-layer Ge/Si APD array, bounding dynamic readout power to $5.24\text{ W}$. |
| `cmos_backend.html` | CMOS Digital Backend | Synchronous 100 GHz digital backend, 80-bit carry-save accumulators, and $210\text{ ps}$ CRT reconstruction. |
| `jir_controller.html` | JIR Controller & RRNS | JIR tile controller, $\tau = 5\ \mu\text{s}$ polling, predictive RRNS parity tile engagement on thermal slope ($dT/dt$), and 0.1 ms parallel weight reprogramming. |
| `wave_pipelining.html` | 100 GHz Wave-Pipelining | $10.0\text{ ps}$ cycle timing decomposition ($t_{\text{mod}}$, $t_{\text{PD}}$, $t_{\text{wire}}$, $t_{\text{guard}}$), two-phase $5\text{ ps}$ time multiplexing, and $963\text{ ps}$ cumulative latency over 96 in-flight stages. |
| `thermal_stack.html` | 3D Z-Axis Thermal Stack | Vertically partitioned 3D Z-axis stack, directional heat extraction ($q_{\text{CMOS}}\downarrow$ via perimeter shunt, $q_{\text{photonic}}\uparrow$ via Cu-Cu pillars), $11.05\text{ ms}\ \text{SiO}_2$ barrier, and **17× thermal safety margin**. |
| `power_throughput.html` | Power & Throughput Profiles | Multi-precision scaling (INT4 to INT64), full electrical/optical power budget breakdown ($186.79\text{ W}$ Datacenter), and energy efficiency metrics ($13.36\text{--}300.76\text{ TMAC/s/W}$). |
| `fabrication.html` | 3D Packaging & Open Challenges | Single-reticle footprints ($40\text{--}300\text{ mm}^2$), $0.64\text{ mm}$ package height (HBM co-packagable), DUV lithography, and 3 verified open research challenges. |

### Template Structure

Each page follows this boilerplate:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>JANUS — [System Name]</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    /* Theme-aware CSS with two color palettes */
    /* Dark theme: #5585ff (blue) */
    /* Light theme: #b87010 (gold) */
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>System Name</h1>
      <canvas id="schematicCanvas"></canvas>
      <button class="return-btn">[ Return to Universe ]</button>
    </header>
    <div class="content">
      <!-- Technical details from JANUS_CONTENT -->
    </div>
  </div>
  <script>
    // 1. Read theme from URL
    const theme = new URLSearchParams(window.location.search).get('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    
    // 2. Canvas animation loop using requestAnimationFrame
    // Copy appropriate function from JANUS_SCHEMATICS (in hi.html)
  </script>
</body>
</html>
```

### Styling Conventions

**Dark Theme** (ST === 'DARK'):
- Background: `rgba(8, 8, 12, 0.88)` with `backdrop-filter: blur(24px)`
- Border: `rgba(80, 130, 255, 0.25)`
- Text: `rgba(255, 255, 255, 0.9)`
- Accent: `#5585ff` (blue)
- Canvas lines/glows: Blue tones

**Light Theme** (ST !== 'DARK'):
- Background: `rgba(233, 226, 209, 0.92)` with `backdrop-filter: blur(24px)`
- Border: `rgba(175, 118, 18, 0.25)`
- Text: `rgba(18, 12, 4, 0.95)`
- Accent: `#b87010` (gold/amber)
- Canvas lines/glows: Gold/amber tones

### Typography

**Header**: `'Cormorant Garamond'` at 2.5rem+, italic, bold weight (wght: 400)

**Body text**: `'Cormorant Garamond'` at 1.02rem, serif, line-height: 1.78

**Technical labels**: `'Space Mono'` at 0.78rem, monospace, uppercase, letter-spacing: 0.1em

**Badges**: Inline spans with theme-aware colors (blue/green/amber)

### Return Button Behavior

The "[ Return to Universe ]" button in top-right corner:

```javascript
btn.addEventListener('click', () => {
  window.location.href = '../hi.html';  // No query parameter — stays in current universe
});
```

This preserves the ST (DARK/LIGHT) state across navigation. The dark/light CSS state is ephemeral per page and resets on return.

## Content Database Reference

The `JANUS_CONTENT` object in hi.html contains all technical details for each page. Key structure:

```javascript
JANUS_CONTENT = {
  overview: { title: '...', html: '...' },
  routing: { title: '...', html: '...' },
  // ... etc for all 10 systems
}
```

When creating Janus/*.html pages, extract the relevant `.html` property from this database and render it in the page's content div.

## Key Performance Constraints

- **No external dependencies**: Pure HTML5/CSS3/Canvas — no frameworks
- **Smooth 60 FPS animations**: Use `requestAnimationFrame` with efficient canvas rendering
- **Mobile-responsive**: Canvas scales to viewport, touch-friendly return button
- **Theme persistence**: Query parameter `?theme=` must be appended to all Janus/ links
- **Graceful degradation**: Canvas animations should not block text readability

## Accessibility & UX

- Return button has high contrast and 40px+ tap target
- Heading hierarchy: `<h1>` = system name, `<h2>` = section titles
- Color contrast: Text must meet WCAG AA standards
- Keyboard navigation: Tab through return button, avoid focus traps

## Future Extensions (Phase 2)

- About page (aB button handler)
- OptiBranch subsystem pages (oB dropdown, similar to JANUS structure)
- Persistent theme preference (localStorage)
- Animation performance tuning for low-end devices

---

**Last Updated**: 2025-07-16  
**Status**: Phase 1 — JANUS subsystem pages under development
