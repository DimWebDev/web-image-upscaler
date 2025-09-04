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

- [ ] Initialize repository and tooling [devops][frontend][docs] (P0)
  - Depends → none
  - Subtasks:
    - [ ] Create `package.json` with `engines.node = 20.19.4` and pinned deps per tech stack
    - [ ] Add Vite 6, React 18, TypeScript 5, ESLint 9, Prettier 3
    - [ ] Add Vitest 3 + React Testing Library + `vitest-axe`
    - [ ] Configure Tailwind CSS 3 + PostCSS + Autoprefixer
    - [ ] Set up directory structure: `src/`, `src/components/`, `src/pages/`, `src/workers/`, `src/utils/`, `public/models/`
    - [ ] Add base configuration: `tsconfig.json`, `vite.config.ts`, `.eslintrc`, `.prettierrc`, `tailwind.config.js`
  - Acceptance Criteria:
    - npm scripts available: `dev`, `build`, `test`, `lint`, `typecheck`
    - Local dev server runs and renders a placeholder App page
    - Lint and format succeed on clean repo

- [ ] Cross-Origin Isolation for dev & prod [devops] (P0)
  - Depends → Foundations
  - Subtasks:
    - [ ] Configure Vite dev server headers: `COOP: same-origin`, `COEP: require-corp`
    - [ ] Add production header guidance (Vercel/Netlify config) to `docs/`
  - Acceptance Criteria:
    - `self.crossOriginIsolated === true` in dev
    - Documented steps for enabling same in production

- [ ] CI Pipeline (GitHub Actions) [devops][qa] (P1)
  - Depends → Foundations
  - Subtasks:
    - [ ] Node 20.19.4 matrix job: install, lint, typecheck, test, build
    - [ ] Upload build artifacts
  - Acceptance Criteria:
    - CI runs on PRs and main pushes; all checks must pass

- [ ] Documentation skeleton [docs] (P1)
  - Depends → Foundations
  - Subtasks:
    - [ ] Add README with run/build/test instructions and privacy principles
    - [ ] Link to PRD, Spec, UI/UX; note browser requirements
  - Acceptance Criteria:
    - README present and accurate; reviewed by PM/Eng


## Milestone 1 — UI Shell & Intake (Week 2)

- [ ] Landing page + layout shell [frontend][design] (P0) — Maps to REQ-001/008/009
  - Depends → Foundations
  - Subtasks:
    - [ ] App header with brief privacy note (stateless, local-only)
    - [ ] Responsive, accessible layout scaffold with Tailwind
  - Acceptance Criteria:
    - Basic layout passes Lighthouse a11y ≥ 90 locally

- [ ] Drag-and-drop + file picker intake [frontend] (P0) — REQ-001/002
  - Depends → UI Shell
  - Subtasks:
    - [ ] Drop zone with idle/hover/active states
    - [ ] Single-file selection via input; JPG/PNG/WEBP only
    - [ ] Client-side validation (type/size); clear error messages
  - Acceptance Criteria:
    - Valid files transition to next stage; invalid show actionable errors

- [ ] Stage indicator (Analyzing → Processing → Finalizing) [frontend][design] (P0) — REQ-003/006
  - Depends → Intake
  - Acceptance Criteria:
    - Clear visual states; screen reader announcements of stage changes

- [ ] Error UI patterns [frontend][design] (P1) — REQ-007
  - Depends → Intake
  - Acceptance Criteria:
    - Error component reusable; includes next steps and retry affordance


## Milestone 2 — Processing Pipeline (Week 3–4)

- [ ] Worker infrastructure + messaging [frontend] (P0) — REQ-003
  - Depends → Intake
  - Subtasks:
    - [ ] Create `src/workers/processor.worker.ts` with typed message protocol
    - [ ] PostMessage channels for: analyze, process, finalize, error
    - [ ] Feature detection report: SIMD, SAB, OffscreenCanvas, threads
  - Acceptance Criteria:
    - Round-trip worker messages in dev; feature report surfaced to UI

- [ ] Primary engine: TFJS WASM + UpscalerJS [frontend] (P0) — REQ-003/004
  - Depends → Worker infra, Cross-origin isolation
  - Subtasks:
    - [ ] Initialize TFJS WASM backend inside worker; verify backend active
    - [ ] Integrate `upscaler` with a free model (e.g., ESRGAN-like)
    - [ ] Lazy-load model weights from `public/models/` (same-origin)
    - [ ] Implement tiled processing for large images
    - [ ] Dispose tensors via `tf.tidy` and explicit `dispose()`
  - Acceptance Criteria:
    - Process a 2000×2000 JPG on Chrome desktop without crash
    - Memory peak bounded and released after finalize

- [ ] Fallback engine: wasm-vips path [frontend] (P1) — REQ-007
  - Depends → Worker infra, Cross-origin isolation
  - Subtasks:
    - [ ] Integrate `wasm-vips` for resize + sharpen
    - [ ] Switch to this path when TFJS fails or memory threshold exceeded
  - Acceptance Criteria:
    - Fallback produces valid output for same inputs; surfaced in UI

- [ ] Last-resort fallback: Canvas/WebGL basic [frontend] (P2) — REQ-007
  - Depends → Worker infra
  - Acceptance Criteria:
    - Canvas path returns resized image with basic sharpening

- [ ] Memory estimation + guardrails [frontend] (P0) — REQ-003
  - Depends → Worker infra
  - Subtasks:
    - [ ] Estimate memory based on dimensions, tiling, model footprint
    - [ ] Preflight warnings with options: proceed, pre-resize, or fallback
  - Acceptance Criteria:
    - Oversized images show warnings; choices apply for session only


## Milestone 3 — Comparison & Metrics (Week 4)

- [ ] Before/After comparison view (side-by-side static) [frontend][design] (P0) — REQ-004/006
  - Depends → Processing pipeline
  - Subtasks:
    - [ ] Render original vs enhanced with synced dimensions
    - [ ] Simple zoom toggle (optional P1); MVP is static compare
  - Acceptance Criteria:
    - Users can visually assess improvement without layout shift

- [ ] Metrics: PSNR + SSIM [frontend] (P1) — REQ-004/010
  - Depends → Processing pipeline
  - Subtasks:
    - [ ] Implement PSNR util; integrate `ssim.js` for SSIM
    - [ ] Metrics panel with clear labels and units
  - Acceptance Criteria:
    - Metrics compute within 250ms for 2MP images; panel togglable

- [ ] Download enhanced image [frontend] (P0) — REQ-005
  - Depends → Processing pipeline
  - Acceptance Criteria:
    - One-click download; format preserved; filename suffix `-enhanced`


## Milestone 4 — Accessibility & UX Polish (Week 5)

- [ ] WCAG 2.1 AA pass [frontend][design][qa] (P0)
  - Depends → UI + Comparison
  - Subtasks:
    - [ ] Keyboard operable; focus visible; no traps
    - [ ] Announce dynamic content changes (stages, errors) to SR
    - [ ] Color contrast ≥ 4.5:1 for text; ≥ 3:1 for UI icons
  - Acceptance Criteria:
    - `vitest-axe` checks pass on core screens

- [ ] Copy + Empty/Loading/Error states [design][frontend] (P1)
  - Depends → UI
  - Acceptance Criteria:
    - All core components include defined states with consistent tone

- [ ] Privacy disclosure & Help/Compat page [docs][frontend] (P1) — REQ-008/009
  - Depends → Foundations
  - Acceptance Criteria:
    - Page explains stateless processing, supported browsers, and limitations


## Milestone 5 — Testing & Quality (Week 5–6)

- [ ] Unit tests for utilities [qa][frontend] (P0)
  - Depends → Pipeline
  - Acceptance Criteria:
    - PSNR/SSIM, memory estimation, image transforms covered ≥ 80%

- [ ] Component tests for UI states [qa][frontend] (P0)
  - Depends → UI
  - Acceptance Criteria:
    - Dropzone, StageIndicator, ErrorMessage, MetricsPanel tested

- [ ] E2E happy path (Playwright) [qa] (P0)
  - Depends → UI + Pipeline
  - Acceptance Criteria:
    - Upload→Process→Compare→Download works across Chrome/Firefox

- [ ] Accessibility tests [qa] (P1)
  - Depends → Accessibility
  - Acceptance Criteria:
    - No critical violations in core flows with `vitest-axe`


## Milestone 6 — Cross-Browser & Performance (Week 6–7)

- [ ] Cross-browser matrix [qa][frontend] (P0)
  - Depends → Pipeline
  - Subtasks:
    - [ ] Validate across Chrome ≥91, Firefox ≥89, Safari ≥16.4
    - [ ] Document quirks; apply shims/polyfills if needed
  - Acceptance Criteria:
    - MVP flow works on all target browsers with documented notes

- [ ] Performance hardening [frontend] (P1)
  - Depends → Pipeline
  - Subtasks:
    - [ ] Aggressive memory cleanup; image tiling tuning
    - [ ] Lazy-load model weights; free resources after finalize
  - Acceptance Criteria:
    - No memory growth across 3 sequential runs on a 2MP image


## Milestone 7 — Delivery Readiness (Week 8)

- [ ] Production build + static hosting config [devops] (P0)
  - Depends → All previous
  - Acceptance Criteria:
    - Build artifacts optimized; headers set for COOP/COEP; CSP documented

- [ ] MVP checklist sign-off [pm][qa][design][frontend] (P0)
  - Depends → All previous
  - Acceptance Criteria:
    - All P0 items checked; no blocking defects; demo recorded


## Backlog (Post-MVP Candidates)

- [ ] Interactive slider comparison (drag handle) [frontend][design] (P2)
- [ ] Presets: Quality vs Speed [frontend] (P2)
- [ ] PWA install + cache models after first load [frontend][devops] (P2)
- [ ] Additional formats (TIFF/HEIC) [frontend] (P2)
- [ ] Light batch mode (2–5 images) [frontend] (P2)


## Traceability Matrix (High-level)

- REQ-001 (Intake): Milestone 1 — Drag-and-drop + picker
- REQ-002 (Validation): Milestone 1 — Intake validation + errors
- REQ-003 (3-stage processing): Milestone 1 Stage indicator; Milestone 2 Pipeline
- REQ-004 (Compare + metrics): Milestone 3 — Comparison + Metrics
- REQ-005 (Download): Milestone 3 — Download
- REQ-006 (Progress messaging): Milestone 1 Stage indicator; Milestone 3 UI
- REQ-007 (Graceful degradation): Milestone 2 — Fallbacks
- REQ-008 (Privacy disclosure): Milestone 1 Landing; Milestone 4 Help page
- REQ-009 (Cross-browser): Milestone 6 Matrix
- REQ-010 (PSNR/SSIM): Milestone 3 Metrics


## Risks & Dependencies (from Spec)

- High: Free model quality may be insufficient → early spikes in Week 3
- High: Browser memory limits → implement tiling + fallbacks
- Medium: Processing time acceptance → clear messaging, consider presets post-MVP
- Medium: Safari limitations with SAB → ensure Canvas fallback works


## Notes

- All processing must remain client-side; no external API calls for image data.
- Ensure headers for cross-origin isolation in production. Dev parity required.
- Maintain privacy-first stance: no analytics; optional, local-only user feedback can be explored later.
