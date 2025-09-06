### 1. Understanding the Goal

- Objective: Ensure the development environment is cross-origin isolated and provide production-ready guidance so hosting environments can achieve the same, enabling SharedArrayBuffer/threads for WASM/TFJS. Specifically: `self.crossOriginIsolated === true` while running locally via Vite, and clear documentation for enabling COOP/COEP headers on common static hosts (Vercel/Netlify). Issue: Task 0.2.
- Known:
  - Tech stack: Vite 6, React 18, TS 5; static hosting; privacy-first (no third-party assets/APIs).
  - `vite.config.ts` already sets dev/preview headers: COOP: same-origin, COEP: require-corp.
  - Models/assets are intended to be served from same origin (`public/`).
  - Backlog requires cross-origin isolation both in dev and in production docs; depends on Task 0.1.
- Unknowns:
  - Final production host(s) (Vercel vs Netlify vs other static origin).
  - Any planned third-party embeds (fonts, analytics) that could violate COEP.
  - Whether any cross-origin subresources will be introduced later (CDN fonts, images, scripts).
- Assumptions (to validate):
  - Hosting will be static-first; no server-side rendering; headers configured at CDN/host level.
  - All runtime assets (WASM, models, fonts, CSS, JS) ship from same origin; no third-party scripts.
  - We accept COEP’s stricter constraints (cross-origin resources must be CORS/`corp`).
- Constraints & Scope:
  - In scope: Dev server isolation; preview parity; production header guidance; simple health check instructions; risk documentation.
  - Out of scope: Implementing server infra, CSP policy enforcement, or code changes beyond minimal health-check utility (will be done later if needed).

### 2. Investigation & Analysis

- Investigative steps:
  - Verify current Vite dev and preview headers are present and active (manual check via DevTools: `self.crossOriginIsolated`).
  - Confirm no cross-origin subresources are loaded in `index.html` or code (e.g., Google Fonts, analytics, third-party scripts/images).
  - Identify any resource that would fail COEP (e.g., cross-origin images without CORS/`corp`).
  - Check docs for existing deployment guidance; identify the right place to add production headers doc.
  - Validate that worker format/build output don’t break COOP/COEP (already using `worker.format = 'es'`).
- Files to read:
  - `vite.config.ts` (server/preview headers; worker settings)
  - `index.html` (script/style/font includes)
  - `public/` and `src/` for any external asset URLs
  - `docs/project/backlog.md` (Task 0.2 acceptance)
  - `docs/tech stack/tech_stack.md` and `docs/architecture/system.yaml` (mentions of COOP/COEP)
  - Any `docs/deployment/*` (create if missing)
- What to search in codebase:
  - Occurrences of external URLs: `http`, `https`, `cdn`, `fonts.googleapis.com`, `unpkg`, etc.
  - Mentions of `SharedArrayBuffer`, `crossOriginIsolated`, `addEventListener('message', ...)` for worker usage patterns.
  - Any service worker or PWA that might impact header delivery.
- Critical questions to answer:
  - Are there any cross-origin resources that would violate COEP now or planned soon? If yes, can we self-host or CORS-enable them?
  - Which hosts are target for production? Provide exact header config snippets per host.
  - Do we need an in-app health check surface to guide users when isolation isn’t achieved (e.g., on forks/self-hosts)?

### 3. Proposed Strategic Approach

- Strategy overview:
  - Lock down development parity by verifying current Vite configuration produces `crossOriginIsolated === true` and documenting a quick validation flow for contributors.
  - Produce clear, copy-pasteable production header configurations for Vercel and Netlify (and note generic Nginx/CDN patterns) to guarantee isolation post-deploy.
  - Add preventative guidance to avoid introducing cross-origin assets that would break COEP.

- Phases and work breakdown:
  - Phase A — Verification of Dev/Preview
    - Start `pnpm dev` and validate `self.crossOriginIsolated === true` in browser console on `http://localhost:5173`.
    - Validate no console warnings about COEP resource blocking; inspect Network tab for any cross-origin requests.
    - Repeat with `pnpm build && pnpm preview` to ensure preview parity.
    - If issues appear, list offending resources and propose remediation (self-hosting or enabling CORS/`Cross-Origin-Resource-Policy: cross-origin` where appropriate).
  - Phase B — Production Guidance Documentation
    - Create `docs/deployment/cross-origin-isolation.md` describing:
      - What COOP/COEP are, why required for SAB/threads.
      - How to verify isolation in production (DevTools console; example screenshot/steps).
      - Vercel: `vercel.json` headers config for `/*` with COOP/COEP.
      - Netlify: `_headers` file example at build root.
      - Generic static origin: Nginx/Apache header examples; Cloudflare Pages hint.
      - Pitfalls: Third-party assets, iframes, and service workers; solutions (self-host, CORS+CORP, or avoid).
      - Checklist for PR review (no third-party assets; local verify passes).
    - Add link to this doc from `docs/tech stack/tech_stack.md` and the backlog acceptance section.
  - Phase C — Preventive Guidance for Contributors
    - Add a short section in `docs/contributing.md` (or `docs/development/dev_tips.md`) titled “Keep Cross-Origin Isolation Intact” with rules:
      - Do not add cross-origin fonts/scripts/images.
      - If a dependency fetches cross-origin resources at runtime, avoid or replace.
      - Keep models and WASM local under `public/` and import them via same-origin paths.
  - Phase D — Optional Health Check (Non-blocking, if we choose to add later)
    - Outline a small runtime check utility and a banner/message shown when not isolated (dev-only or behind a debug toggle). This remains a follow-up if needed.

- Dependencies between phases:
  - Phase B depends on A’s findings (docs should incorporate any discovered caveats).
  - Phase C can proceed in parallel with B once A is confirmed.

### 4. Verification Strategy

- Success measures:
  - In development and preview, `self.crossOriginIsolated === true` with no COEP-blocked resource errors in console.
  - Production deployments on Vercel/Netlify achieve cross-origin isolation using provided templates (validated on a staging preview).
  - Documentation is clear enough that a new contributor can configure headers without back-and-forth.
- Tests/checks:
  - Manual smoke check: open app in Chrome/Firefox, run `self.crossOriginIsolated`.
  - E2E (optional): a Playwright test that loads the app (dev server/preview) and asserts `page.evaluate(() => self.crossOriginIsolated)`.
  - CI note (follow-up): If we add Playwright later, run preview + check in CI for regression.
- Regression avoidance:
  - Enforce a PR checklist item: “No cross-origin runtime assets; isolation validated locally”.
  - Keep a docs section with common breakage patterns (e.g., adding a Google Font).
- Acceptance criteria mapping:
  - Dev: `self.crossOriginIsolated === true` on `pnpm dev` and `pnpm preview`.
  - Docs: `docs/deployment/cross-origin-isolation.md` added; linked from relevant docs; includes Vercel/Netlify examples and verification steps.

### 5. Anticipated Challenges & Considerations

- Potential risks:
  - Introducing cross-origin assets later (fonts, analytics) will silently break COEP; pages won’t be isolated.
  - Safari nuances: ensure versions ≥16.4; user settings/extensions may interfere.
  - Third-party iframes (if ever added) will conflict with COOP.
  - Service workers or proxy layers that strip/add headers inconsistently.
- Dependencies & trade-offs:
  - Cross-origin isolation limits the use of cross-origin embeds. Given privacy-first scope, this aligns with project values.
  - Self-hosting all assets slightly increases repo size but guarantees reliability.
- Follow-ups to resolve unknowns:
  - Confirm intended production host(s) and provide exact, tested config blocks for each.
  - Review any prospective design assets (fonts/icons) to ensure local hosting.
  - If we adopt Playwright, add a lightweight isolation check test to guard against regressions.

---

Owner: DevOps/Frontend
Priority: P0
Related: Backlog Task 0.2; depends on Task 0.1
Status: Plan approved → implement docs + validate dev/preview
