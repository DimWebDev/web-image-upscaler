# Stateless Web Image Upscaler — Final Tech Stack (Version-Pinned)

## Code Quality & Formatting

**Goal:** Consistent, automated formatting and linting across all contributors.

**Tools**

- **ESLint** (TypeScript + React + a11y rules)
- **Prettier** (opinionated code formatting)
- **Husky** + **lint-staged** (run checks on staged files via Git hooks)

**NPM Scripts**

- `pnpm lint` — ESLint over `src/**/*.{ts,tsx}`
- `pnpm lint:fix` — ESLint with `--fix`
- `pnpm format` — Prettier write across the repo
- `pnpm format:check` — Prettier check only
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — unit/component tests

**Git Hooks Policy**

- **pre-commit:** run ESLint + Prettier on staged files (`lint-staged`)
- **pre-push:** run typecheck + tests (fast validation before pushing)
- **CI:** repeats lint, typecheck, tests for authoritative verification

**Editors**

- VS Code: enable “Format on Save”; install **Prettier** and **ESLint** extensions.

## Runtime & Targets

- **Node.js:** **20.19.4** (current dev default)

  - `package.json` engines: `">=20.19 <23"`

- **Browsers (minimum):** Chrome ≥ 91, Firefox ≥ 89, Safari ≥ 16.4 (WASM SIMD baseline)
- **Cross-origin isolation (prod):** `COOP: same-origin`, `COEP: require-corp` (for SharedArrayBuffer/WASM)

## Core Image Processing

- **Primary upscaler (AI):** `upscaler` (UpscalerJS) **1.x** + `@tensorflow/tfjs` **4.22.0**

  - Use **TFJS WASM backend in a Web Worker** (SIMD/multithreading where available)
  - Reserve **WebGL** for main-thread rendering paths or where OffscreenCanvas is supported uniformly
  - Enable patch-tiling for large images

- **Secondary engine (classical & transforms):** `wasm-vips` **0.0.14** (libvips in WASM; SIMD + SAB required)
- **Last-resort fallback:** HTML5 Canvas / basic WebGL shader path (resize + sharpen)

## Frontend UI

- **Framework:** React **18.x** (functional components + hooks)
- **Language:** TypeScript **5.x**
- **Styling:** Tailwind CSS **3.x** with **PostCSS 8.x** & **Autoprefixer 10.x**
  _(Replace `@tailwindcss/postcss` with `postcss` + `autoprefixer`; configure via `postcss.config.js`)_

## State & Routing

- **State management:** React local state/Context; optional **Zustand 4.x** for lightweight global state
- **Routing:** React Router **6.x**

## Build & Tooling

- **Bundler/dev server:** Vite **6.0.x** (ESM dev, Rollup prod, code-splitting, dynamic imports)
- **Linting:** ESLint **9.x** (+ `eslint-plugin-react`, `eslint-plugin-jsx-a11y`)
- **Formatting:** Prettier **3.x**

## Testing & QA

- **Unit/Component:** Vitest **3.2.4** + React Testing Library **15.x**
- **Accessibility (automated):** `axe-core` + **`vitest-axe` 0.1.x** (prefer over `jest-axe` in Vitest)
- **E2E (one of):** Playwright **1.x** _or_ Cypress **13.x**

## Performance & Workers

- Offload model inference to **Web Workers**; use **OffscreenCanvas** when available
- **Default TFJS WASM backend in workers** (SIMD/threads where supported)
- Lazy-load AI model chunks on demand; free GPU/CPU memory aggressively after use
- Tiled processing for large inputs to control memory footprint

## Quality Metrics & Comparison

- **SSIM:** `ssim.js` **1.0.0**
- **PSNR:** lightweight in-app implementation
- **Viewer:** side-by-side before/after with synced zoom; metrics panel (per UI spec)

## PWA & Offline

- Service worker for offline shell and **caching model files after first load** (no external analytics)

## Desktop Packaging (Later)

- **Electron:** current stable **≥ 30.x** (wrap same React bundle; optional Node file dialogs)
- Packaging: Electron Forge/Builder (single codebase for web + desktop)

## DevOps & Security

- Hosting: Static hosting (e.g., Vercel/Netlify) with **COOP/COEP headers** applied
- CI: GitHub Actions (lint, tests, a11y checks, build)
- CSP tuned to allow WASM/model loading from same origin
- Ensure runtime honors Node **20.19.4** locally; CI can later move to Node 22 within the `engines` range

## Package.json (engines & critical pins)

```json
{
  "engines": { "node": ">=20.19 <23" },
  "dependencies": {
    "react": "18.x",
    "react-dom": "18.x",
    "upscaler": "1.x",
    "@tensorflow/tfjs": "4.22.0",
    "wasm-vips": "0.0.14",
    "zustand": "4.x",
    "react-router-dom": "6.x",
    "ssim.js": "1.0.0"
  },
  "devDependencies": {
    "vite": "6.0.x",
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "postcss": "8.x",
    "autoprefixer": "10.x",
    "eslint": "9.x",
    "prettier": "3.x",
    "vitest": "3.2.4",
    "@testing-library/react": "15.x",
    "axe-core": "4.x",
    "vitest-axe": "0.1.x"
  }
}
```

## Compatibility Guardrails

- On load: verify **SIMD** and **cross-origin isolation**; if missing, route to fallback (lighter AI or Canvas)
- Document minimum browser versions on the help/compat page (Chrome ≥ 91, Firefox ≥ 89, Safari ≥ 16.4)
