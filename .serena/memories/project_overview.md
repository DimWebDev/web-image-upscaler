Stateless Web Image Upscaler — project overview

Purpose:
- A privacy-first, stateless web app for client-side image upscaling and enhancement. No accounts, no uploads, local-only processing.

Key goals:
- Single-image upload → analyze → process → compare → download flow.
- Graceful fallback paths when WASM/SIMD/worker features are unavailable.
- Cross-browser support on modern desktop browsers.

Primary audience: content creators, small businesses, casual users, privacy-conscious users.

Relevant docs:
- docs/product/PRD.md
- docs/specifications/stateless-web-image-upscaler-specification-2025-09-04.md
- docs/tech stack/tech_stack.md
