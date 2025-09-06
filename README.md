# Web Image Upscaler (Stateless, Privacy‑First)

Client‑side image enhancement and upscaling. No uploads, no accounts, no data persistence. All processing runs in the browser.

## Documentation

- **[Product Requirements Document (PRD)](docs/product/PRD.md)** — Complete product vision and requirements
- **[Technical Specification](docs/specifications/stateless-web-image-upscaler-specification-2025-09-04.md)** — Detailed technical architecture and implementation specs
- **[UI/UX Design](docs/design/ui_ux.md)** — User interface design guidelines and mockups
- **[Technology Stack](docs/tech%20stack/tech_stack.md)** — Complete overview of frameworks, libraries, and tools used

## Requirements

- Node.js v20.19.4 (enforced via `package.json > engines`)
- pnpm (package manager): `npm install -g pnpm`
- Modern browsers: Chrome ≥ 91, Firefox ≥ 89, Safari ≥ 16.4

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173 and check the placeholder app. The page displays whether the page is cross‑origin isolated.

## Scripts

- `pnpm dev`: Start Vite dev server
- `pnpm build`: Type‑check and build for production
- `pnpm preview`: Preview the production build locally
- `pnpm test`: Run unit/component tests (Vitest + RTL)
- `pnpm lint`: Run ESLint on `src/**/*.{ts,tsx}`
- `pnpm lint:fix`: ESLint with autofix
- `pnpm format`: Prettier write repository files
- `pnpm format:check`: Prettier check only
- `pnpm typecheck`: TypeScript `--noEmit`

## Cross‑Origin Isolation

The application requires cross-origin isolation to enable Web Workers with WASM and future SIMD/multithreading capabilities.

**Development:** Vite dev server automatically sends the required headers:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

**Production:** These same headers must be configured on your hosting platform. See [Cross-Origin Isolation Documentation](docs/deployment/cross-origin-isolation.md) for deployment guidance.

## Git Hooks

Husky + lint‑staged are configured:

- `pre-commit`: runs `lint-staged` (ESLint + Prettier on staged files)
- `pre-push`: runs `pnpm typecheck && pnpm test --run`

Re‑initialize hooks if needed:

```bash
rm -rf .husky
pnpm exec husky init
```

## Privacy & Architecture

- **Complete Privacy:** All image processing happens entirely in your browser. No files are uploaded to any server.
- **Stateless Design:** No user accounts, no data persistence, no tracking. Each session is independent.
- **Client-Side Processing:** Web Workers with WASM handle all image enhancement and upscaling operations.
- **Sub-5-Click Workflow:** Optimized for quick drag-and-drop → process → download user experience.

## Current Status

This repository contains the foundational tooling and architecture setup. The placeholder React app validates the cross-origin isolation and development workflow required for the WASM-based image processing pipeline.
