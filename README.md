# Deepanshu Sharma - Photonic Computing Portfolio

Welcome to my portfolio! This repository contains a static, interactive website that showcases ideas and architectures in photonic computing. Rather than relying on heavy frameworks, this portfolio is built using pure HTML, CSS, and JavaScript, featuring highly customized, canvas-based animations to visually explain complex photonic and electronic hardware concepts.

## Overview

This project serves as a digital presentation of two primary systems:
- **JANUS**: A hybrid photonic-electronic computing architecture.
- **OptiBranch**: The next-generation extension of JANUS, focusing on quantum-limited phase stability and integrated optics.

The site is designed with a persistent "universe" overlay—an ambient particle background and navigation system that seamlessly integrates across all pages.

## How the Files are Interconnected

The repository is structured to be easily navigable and served as a static site. Here is how the components fit together:

- **`hi.html`**
  The main entry point of the portfolio. Open this file in any modern web browser to start exploring the universe.

- **`about.html`**
  Contains professional background, research focus, and collaboration history.

- **`Shared/`**
  This directory holds the core assets injected into every page across the site:
  - **`universe.css`**: The global stylesheet defining the typography, layout, and theming (dark/light mode).
  - **`universe.js`**: A self-contained script that injects the ambient particle background, handles the global navigation menu, manages theme toggling, and resolves relative paths so it works seamlessly from any subdirectory.

- **`Janus/`**
  Contains all HTML pages detailing the 10 subsystems of the JANUS architecture (e.g., `overview.html`, `cmos.html`, `routing.html`). Each page includes specific interactive `<canvas>` animations (like the Beneš routing network or the 3D fabrication stack) related to that subsystem.

- **`OptiBranch/`**
  Contains all HTML pages detailing the OptiBranch subsystems (e.g., `o_overview.html`, `o_psa.html`, `o_tfln.html`). Similar to the JANUS folder, these pages feature bespoke animations illustrating the optical signal chain and physics.

## Running the Site

Because this is a static site with relative pathing, you can simply open `hi.html` in your web browser.

Alternatively, if you prefer to use a local development server, run:
```bash
python3 -m http.server
```
Then navigate to `http://localhost:8000/hi.html`.

## Contact

If you are interested in discussing photonic computing, hardware design, or potential collaborations, please feel free to reach out.

**Email**: deepanshu.sharma@example.com *(Please replace with actual email if necessary)*
