# Web Image Upscaler (Stateless, Privacy‑First)

Client‑side image enhancement and upscaling. No uploads, no accounts, no data persistence. All processing runs in the browser.

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

Vite dev server sends the required headers:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

These enable features needed by WASM workers and future SIMD/multithreading.

## Git Hooks

Husky + lint‑staged are configured:

- `pre-commit`: runs `lint-staged` (ESLint + Prettier on staged files)
- `pre-push`: runs `pnpm typecheck && pnpm test --run`

Re‑initialize hooks if needed:

```bash
rm -rf .husky
pnpm exec husky init
```

## Notes

- This repo is in early planning; placeholder React app is included to validate tooling.
- Image processing will run entirely client‑side in Web Workers using WASM.
