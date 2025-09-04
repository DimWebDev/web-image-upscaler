Tech stack (summary):
- Runtime: Node.js >=20.19 <23 (dev uses 20.19.4). Vite dev server.
- Frontend: React 18 + TypeScript 5
- AI/processing: upscaler (UpscalerJS) + @tensorflow/tfjs (WASM backend in workers); secondary: wasm-vips; fallback: Canvas/WebGL.
- Styling: Tailwind CSS 3 + PostCSS + Autoprefixer.
- Build/test: Vite 6.x, Vitest 3.2.4, React Testing Library 15.x, Playwright/Cypress optional.
- Lint/format: ESLint 9.x, Prettier 3.x
- Other: Zustand optional, react-router-dom 6.x

See docs/tech stack/tech_stack.md for full pinned versions and compatibility guardrails.