Checklist for what to do when a task is completed (developer handoff):
- Ensure unit/component tests pass (Vitest) and a11y checks included where relevant.
- Run lint and format (ESLint + Prettier). Fix or note any outstanding style issues.
- Update docs where necessary (docs/product, docs/tech stack, specs).
- Add/update changelog entry or PR description summarizing changes and any migration notes.
- Confirm no secrets or telemetry introduced.
- Run a local production build and smoke test the main flow (upload → process → download).
- If changes affect runtime or dependencies, update docs and `package.json` locks.
