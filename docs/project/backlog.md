# Project Backlog — Stateless Web Image Upscaler (MVP)

Status: Draft v1.0 (living document)
Owner: Project Management
Last updated: 2025-09-04

Scope: MVP delivery in ~8 weeks, privacy-first, fully client-side. Traceable to PRD (docs/product/PRD.md), UI/UX (docs/design/ui_ux.md), and Specification (docs/specifications/stateless-web-image-upscaler-specification-2025-09-04.md).

Conventions:
- Labels: [frontend], [devops], [qa], [design], [docs]
- Dependencies noted with Depends →
- Acceptance Criteria listed under each task
- Priority: P0 (critical) / P1 (high) / P2 (nice-to-have)
- Maps to REQ-### from UI/UX §2 and PRD §8


## Milestone 0 — Foundations & Tooling (Week 1)

- [x] **Task 0.1: Repository and Tooling Setup** [devops][frontend][docs] (P0)
  - Depends → none
  - Subtasks:
    - [x] Create `package.json` with `engines.node = 20.19.4` and pinned deps per tech stack
    - [x] Add Vite 6, React 18, TypeScript 5, ESLint 9, Prettier 3
    - [x] Add Vitest 3 + React Testing Library + `vitest-axe`
    - [x] Configure Tailwind CSS 3 + PostCSS + Autoprefixer
    - [x] Set up directory structure: `src/`, `src/components/`, `src/pages/`, `src/workers/`, `src/utils/`, `public/models/`
    - [x] Add base configuration: `tsconfig.json`, `vite.config.ts`, `.eslintrc`, `.prettierrc`, `tailwind.config.js`
  - Acceptance Criteria:
    - pnpm scripts available: `dev`, `build`, `test`, `lint`, `typecheck`
    - Local dev server runs and renders a placeholder App page
    - Lint and format succeed on clean repo

- [x] **Task 0.2: Cross-Origin Isolation Configuration** [devops] (P0)
  - Depends → Task 0.1
  - Subtasks:
    - [x] Configure Vite dev server headers: `COOP: same-origin`, `COEP: require-corp`
    - [x] Add production header guidance (Vercel/Netlify config) to `docs/`
  - Acceptance Criteria:
    - ✅ `self.crossOriginIsolated === true` in dev
    - ✅ Documented steps for enabling same in production

- [ ] **Task 0.3: CI Pipeline Setup** [devops][qa] (P1)
  - Depends → Task 0.1
  - Subtasks:
    - [ ] Node 20.19.4 matrix job: install, lint, typecheck, test, build
    - [ ] Upload build artifacts
  - Acceptance Criteria:
    - CI runs on PRs and main pushes; all checks must pass

- [ ] **Task 0.4: Documentation Foundation** [docs] (P1)
  - Depends → Task 0.1
  - Subtasks:
    - [ ] Add README with run/build/test instructions and privacy principles
    - [ ] Link to PRD, Spec, UI/UX; note browser requirements
  - Acceptance Criteria:
    - README present and accurate; reviewed by PM/Eng

- [ ] **Task 0.5: Establish formatting and linting baseline (ESLint + Prettier)** (P1)
  - Depends → none
  - Subtasks:
    - **Why:** Prevent style drift, catch errors early, keep diffs small.
    - **Deliverables:**
      - `.eslintrc.*`, `.prettierrc`, `.editorconfig`
      - `package.json` scripts (`lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `test`)
    - **Acceptance Criteria:**
      - Running `pnpm lint` reports no errors on baseline.
      - Running `pnpm format:check` passes on baseline.
      - Typecheck passes: `pnpm typecheck`.

- [ ] **Task 0.6: Git hooks for local enforcement (Husky + lint-staged)** (P1)
  - Depends → none
  - Subtasks:
    - **Why:** Fast feedback on commit; keep CI green.
    - **Deliverables:**
      - `.husky/pre-commit` runs `pnpm lint-staged`
      - `.husky/pre-push` runs `pnpm typecheck && pnpm test`
    - **Acceptance Criteria:**
      - Committing a file with style issues auto-fixes or blocks with clear output.
      - Pushing with type or test failures is blocked locally.
    - **Notes:**
      - Keep pre-commit fast (<10s): run lint-staged (ESLint/Prettier) only.
      - Pre-push can run typecheck and unit tests; avoid long builds/E2E—leave those to CI.
      - When adding new quality checks, always enforce them in CI; add to Husky only if they are fast and provide meaningful local feedback.

- [ ] **Task 0.7: CI validation (repeat checks in GitHub Actions)** (P1)
  - Depends → none
  - Subtasks:
    - **Why:** Authoritative gate in PRs.
    - **Deliverables:**
      - CI job running `pnpm install`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm format:check`
    - **Acceptance Criteria:**
      - PRs fail if lint/type/tests/format check fail.


## Milestone 1 — UI Shell & Intake (Week 2)

- [ ] **Task 1.1: Landing Page and Layout Shell** [frontend][design] (P0) — Maps to REQ-001/008/009
  - Depends → Task 0.1
  - Subtasks:
    - [ ] App header with brief privacy note (stateless, local-only)
    - [ ] Responsive, accessible layout scaffold with Tailwind
  - Acceptance Criteria:
    - Basic layout passes Lighthouse a11y ≥ 90 locally

- [ ] **Task 1.2: File Upload Interface** [frontend] (P0) — REQ-001/002
  - Depends → Task 1.1
  - Subtasks:
    - [ ] Drop zone with idle/hover/active states
    - [ ] Single-file selection via input; JPG/PNG/WEBP only
    - [ ] Client-side validation (type/size); clear error messages
  - Acceptance Criteria:
    - Valid files transition to next stage; invalid show actionable errors

- [ ] **Task 1.3: Processing Stage Indicator** [frontend][design] (P0) — REQ-003/006
  - Depends → Task 1.2
  - Acceptance Criteria:
    - Clear visual states; screen reader announcements of stage changes

- [ ] **Task 1.4: Error UI Components** [frontend][design] (P1) — REQ-007
  - Depends → Task 1.2
  - Acceptance Criteria:
    - Error component reusable; includes next steps and retry affordance


## Milestone 2 — Processing Pipeline (Week 3–4)

- [ ] **Task 2.1: Web Worker Infrastructure** [frontend] (P0) — REQ-003
  - Depends → Task 1.2
  - Subtasks:
    - [ ] Create `src/workers/processor.worker.ts` with typed message protocol
    - [ ] PostMessage channels for: analyze, process, finalize, error
    - [ ] Feature detection report: SIMD, SAB, OffscreenCanvas, threads
  - Acceptance Criteria:
    - Round-trip worker messages in dev; feature report surfaced to UI

- [ ] **Task 2.2: TFJS WASM Processing Engine** [frontend] (P0) — REQ-003/004
  - Depends → Task 2.1, Task 0.2
  - Subtasks:
    - [ ] Initialize TFJS WASM backend inside worker; verify backend active
    - [ ] Integrate `upscaler` with a free model (e.g., ESRGAN-like)
    - [ ] Lazy-load model weights from `public/models/` (same-origin)
    - [ ] Implement tiled processing for large images
    - [ ] Dispose tensors via `tf.tidy` and explicit `dispose()`
  - Acceptance Criteria:
    - Process a 2000×2000 JPG on Chrome desktop without crash
    - Memory peak bounded and released after finalize

- [ ] **Task 2.3: WASM-VIPS Fallback Engine** [frontend] (P1) — REQ-007
  - Depends → Task 2.1, Task 0.2
  - Subtasks:
    - [ ] Integrate `wasm-vips` for resize + sharpen
    - [ ] Switch to this path when TFJS fails or memory threshold exceeded
  - Acceptance Criteria:
    - Fallback produces valid output for same inputs; surfaced in UI

- [ ] **Task 2.4: Canvas/WebGL Basic Fallback** [frontend] (P2) — REQ-007
  - Depends → Task 2.1
  - Acceptance Criteria:
    - Canvas path returns resized image with basic sharpening

- [ ] **Task 2.5: Memory Management System** [frontend] (P0) — REQ-003
  - Depends → Task 2.1
  - Subtasks:
    - [ ] Estimate memory based on dimensions, tiling, model footprint
    - [ ] Preflight warnings with options: proceed, pre-resize, or fallback
  - Acceptance Criteria:
    - Oversized images show warnings; choices apply for session only


## Milestone 3 — Comparison & Metrics (Week 4)

- [ ] **Task 3.1: Before/After Comparison View** [frontend][design] (P0) — REQ-004/006
  - Depends → Task 2.2
  - Subtasks:
    - [ ] Render original vs enhanced with synced dimensions
    - [ ] Simple zoom toggle (optional P1); MVP is static compare
  - Acceptance Criteria:
    - Users can visually assess improvement without layout shift

- [ ] **Task 3.2: Quality Metrics Implementation** [frontend] (P1) — REQ-004/010
  - Depends → Task 2.2
  - Subtasks:
    - [ ] Implement PSNR util; integrate `ssim.js` for SSIM
    - [ ] Metrics panel with clear labels and units
  - Acceptance Criteria:
    - Metrics compute within 250ms for 2MP images; panel togglable

- [ ] **Task 3.3: Enhanced Image Download** [frontend] (P0) — REQ-005
  - Depends → Task 2.2
  - Acceptance Criteria:
    - One-click download; format preserved; filename suffix `-enhanced`


## Milestone 4 — Accessibility & UX Polish (Week 5)

- [ ] **Task 4.1: WCAG 2.1 AA Compliance** [frontend][design][qa] (P0)
  - Depends → Task 3.1
  - Subtasks:
    - [ ] Keyboard operable; focus visible; no traps
    - [ ] Announce dynamic content changes (stages, errors) to SR
    - [ ] Color contrast ≥ 4.5:1 for text; ≥ 3:1 for UI icons
  - Acceptance Criteria:
    - `vitest-axe` checks pass on core screens

- [ ] **Task 4.2: UI State Management** [design][frontend] (P1)
  - Depends → Task 1.1
  - Acceptance Criteria:
    - All core components include defined states with consistent tone

- [ ] **Task 4.3: Privacy and Help Documentation** [docs][frontend] (P1) — REQ-008/009
  - Depends → Task 0.1
  - Acceptance Criteria:
    - Page explains stateless processing, supported browsers, and limitations


## Milestone 5 — Testing & Quality (Week 5–6)

- [ ] **Task 5.1: Utility Function Tests** [qa][frontend] (P0)
  - Depends → Task 2.2
  - Acceptance Criteria:
    - PSNR/SSIM, memory estimation, image transforms covered ≥ 80%

- [ ] **Task 5.2: Component Unit Tests** [qa][frontend] (P0)
  - Depends → Task 1.1
  - Acceptance Criteria:
    - Dropzone, StageIndicator, ErrorMessage, MetricsPanel tested

- [ ] **Task 5.3: End-to-End Testing** [qa] (P0)
  - Depends → Task 3.1
  - Acceptance Criteria:
    - Upload→Process→Compare→Download works across Chrome/Firefox

- [ ] **Task 5.4: Accessibility Testing** [qa] (P1)
  - Depends → Task 4.1
  - Acceptance Criteria:
    - No critical violations in core flows with `vitest-axe`


## Milestone 6 — Cross-Browser & Performance (Week 6–7)

- [ ] **Task 6.1: Cross-Browser Compatibility** [qa][frontend] (P0)
  - Depends → Task 2.2
  - Subtasks:
    - [ ] Validate across Chrome ≥91, Firefox ≥89, Safari ≥16.4
    - [ ] Document quirks; apply shims/polyfills if needed
  - Acceptance Criteria:
    - MVP flow works on all target browsers with documented notes

- [ ] **Task 6.2: Performance Optimization** [frontend] (P1)
  - Depends → Task 2.2
  - Subtasks:
    - [ ] Aggressive memory cleanup; image tiling tuning
    - [ ] Lazy-load model weights; free resources after finalize
  - Acceptance Criteria:
    - No memory growth across 3 sequential runs on a 2MP image


## Milestone 7 — Delivery Readiness (Week 8)

- [ ] **Task 7.1: Production Build Configuration** [devops] (P0)
  - Depends → All previous tasks
  - Acceptance Criteria:
    - Build artifacts optimized; headers set for COOP/COEP; CSP documented

- [ ] **Task 7.2: MVP Release Sign-off** [pm][qa][design][frontend] (P0)
  - Depends → All previous tasks
  - Acceptance Criteria:
    - All P0 items checked; no blocking defects; demo recorded


## Backlog (Post-MVP Candidates)

- [ ] **Task 8.1: Interactive Slider Comparison** [frontend][design] (P2)
- [ ] **Task 8.2: Quality vs Speed Presets** [frontend] (P2)
- [ ] **Task 8.3: PWA Installation and Caching** [frontend][devops] (P2)
- [ ] **Task 8.4: Additional Format Support** [frontend] (P2)
- [ ] **Task 8.5: Light Batch Processing** [frontend] (P2)


## Traceability Matrix (High-level)

- REQ-001 (Intake): Milestone 1 — Task 1.2
- REQ-002 (Validation): Milestone 1 — Task 1.2 validation + Task 1.4 errors
- REQ-003 (3-stage processing): Milestone 1 Task 1.3; Milestone 2 Task 2.1/2.2
- REQ-004 (Compare + metrics): Milestone 3 — Task 3.1 + Task 3.2
- REQ-005 (Download): Milestone 3 — Task 3.3
- REQ-006 (Progress messaging): Milestone 1 Task 1.3; Milestone 3 UI
- REQ-007 (Graceful degradation): Milestone 2 — Task 2.3/2.4
- REQ-008 (Privacy disclosure): Milestone 1 Task 1.1; Milestone 4 Task 4.3
- REQ-009 (Cross-browser): Milestone 6 Task 6.1
- REQ-010 (PSNR/SSIM): Milestone 3 Task 3.2


## Risks & Dependencies (from Spec)

- High: Free model quality may be insufficient → early spikes in Week 3
- High: Browser memory limits → implement tiling + fallbacks
- Medium: Processing time acceptance → clear messaging, consider presets post-MVP
- Medium: Safari limitations with SAB → ensure Canvas fallback works


## Notes

- All processing must remain client-side; no external API calls for image data.
- Ensure headers for cross-origin isolation in production. Dev parity required.
- Maintain privacy-first stance: no analytics; optional, local-only user feedback can be explored later.
