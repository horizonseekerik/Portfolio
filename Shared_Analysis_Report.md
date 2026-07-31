# Analysis of Shared Assets (`Shared/` Folder)

The `Shared/` folder houses the foundational styling and scripting that interconnects the visual theme across the diverse pages of the portfolio. By centralizing these scripts and styles, the architecture ensures a consistent and seamless experience as users navigate between the root, `Janus`, and `OptiBranch` modules.

Below is a detailed analysis focusing on the animation logic, local storage persistence, and relative path resolution implemented within `Shared/universe.js`.

---

## 1. Animation Logic

The central UI animations—the ambient particle background and the interactive central hitbox (which serves as a theme toggle and menu activator)—are handled entirely within `universe.js`.

### The Ambient Particle System
The particle background is instantiated as a dynamic HTML5 `<canvas>` element injected beneath the page content.
- **Responsiveness & Accessibility**: The script evaluates media queries before initializing animations. It checks for `prefers-reduced-motion: reduce`; if detected, particle generation is disabled (`particleCount = 0`). It also checks for touch interfaces (`pointer: coarse`) and screen size to scale down the number of particles (e.g., down to 40 on small touch devices, up to 130 on large desktops), optimizing performance.
- **Physics and Drawing**:
  - Particles are assigned a random position, radius, phase (`ph`), and persistent velocities (`vx`, `vy`).
  - A `requestAnimationFrame` loop handles continuous painting.
  - Position updates are bounded; if a particle drifts off the screen, it loops back to the opposite edge, creating an infinite, seamless flow.
  - The opacity of each particle gently oscillates using a sine wave function based on its random phase and the current timestamp: `0.18 + 0.14 * Math.sin(t * 0.001 + p.ph)`.

### The Hitbox (Blackhole / Sun)
A central interactive hitbox animates constantly to draw user attention.
- A dedicated `<canvas>` is created for the hitbox.
- Through an independent `requestAnimationFrame` loop, it renders a pulsating aesthetic based on the active theme.
- In **Dark Mode**, it renders a "Blackhole": a dark core surrounded by a glowing accretion ring using radial gradients.
- In **Light Mode**, it renders a "Sun": a warm glowing core.
- The `pulse` factor oscillates dynamically via `Math.sin(t * 0.05)`, smoothly altering the transparency and size of the surrounding gradients.

---

## 2. Local Storage Persistence and Theme Resolution

The application implements a robust, prioritized theme resolution strategy to ensure that a user's preference persists not only across multiple page views but also across different sessions, while still allowing explicit overrides via URLs.

### Resolution Priority
When `universe.js` executes, it determines the active theme in the following order of precedence:
1. **URL Parameter (`?theme=`)**: An explicit theme override passed in the query string.
2. **Session Storage (`sessionStorage.getItem('janus-theme')`)**: The theme state of the active browsing session.
3. **Local Storage (`localStorage.getItem('janus-theme')`)**: The previously saved long-term theme state.
4. **Default fallback**: `'dark'`.

After evaluation, the value is normalized (enforcing strictly `'light'` or `'dark'`) and saved back into `sessionStorage`.

### State Updates and Navigation
When the user interacts with the theme toggle button within the navigation menu:
- The next theme string is calculated (toggling between `light` and `dark`).
- The script immediately saves this new state to *both* `sessionStorage` and `localStorage`.
- It then constructs a new URL query parameter (`?theme=next`) and reloads the current location (`location.search = p.toString()`).
- This causes the page to reload with the new theme explicitly set, maintaining consistency. Furthermore, when generating navigation links dynamically, the current theme query parameter is appended to all `href` destinations (`a.href = base + file + '?theme=' + theme;`), guaranteeing that following links will actively propagate the chosen state to the next page.

---

## 3. Relative Path Resolution

Because `universe.js` is included in pages located at varying directory depths (root level like `hi.html`, or one directory deep like `/Janus/overview.html`), it must dynamically resolve navigation paths so that links to other pages never break.

### Context Determination
The script determines the current directory context by inspecting `location.pathname`:
- `inJanus = /\/Janus\//.test(path);`
- `inOpti = /\/OptiBranch\//.test(path);`

### Path Normalization
Using these boolean flags, it calculates the relative distance to the repository root and to the specific sub-directories:
- **`up` variable**: If inside `/Janus/` or `/OptiBranch/`, it sets `up = '../'`. Otherwise, it remains `./`.
- **Base paths**:
  - `janusBase = inJanus ? './' : up + 'Janus/';` (Target for Janus links)
  - `optiBase = inOpti ? './' : up + 'OptiBranch/';` (Target for OptiBranch links)

### Dynamic Menu Generation
The navigation menu is constructed completely via JavaScript DOM manipulation. The script utilizes static arrays (`JANUS_LINKS` and `OPTI_LINKS`) containing page filenames and titles.
When generating the `<a>` elements for the menu, it constructs the final URL using:
`base + file + '?theme=' + theme`
This ensures that regardless of whether the user is viewing `hi.html` (root) or `o_psa.html` (inside `/OptiBranch/`), clicking a link for the `Janus` overview correctly directs the browser to the exact relative path while successfully propagating the theme state.
