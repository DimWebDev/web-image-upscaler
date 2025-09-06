# Contributing Guidelines

## Development Environment Setup

Before contributing to the Web Image Upscaler project, please ensure your development environment meets the requirements specified in [../tech stack/tech_stack.md](../tech%20stack/tech_stack.md).

## Keep Cross-Origin Isolation Intact

**Critical for functionality:** This application requires cross-origin isolation to enable SharedArrayBuffer and Web Workers with threading capabilities. All contributions must maintain this isolation.

### Rules for Contributors

1. **No Cross-Origin Assets**: Never add external fonts, scripts, images, or other assets that load from different domains
   - ❌ `<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">`
   - ✅ Download fonts and place them in `public/fonts/`

2. **Self-Host All Resources**: Place all static assets in the `public/` directory
   - Models and WASM files: `public/models/`
   - Fonts: `public/fonts/`
   - Images: `public/images/`

3. **Avoid Cross-Origin Dependencies**: If a dependency fetches cross-origin resources at runtime, avoid it or find alternatives
   - Check npm package documentation for external API calls
   - Test new dependencies locally to ensure they don't break isolation

4. **Verify Locally After Changes**: Always test that cross-origin isolation remains intact
   ```bash
   pnpm dev
   # Open http://localhost:5173 in browser
   # In DevTools console, run: self.crossOriginIsolated
   # Must return: true
   ```

### Pre-Submission Checklist

Before submitting any pull request, ensure:

- [ ] **No new cross-origin resources introduced**
- [ ] **Development server isolation verified**: `pnpm dev` → `self.crossOriginIsolated === true`
- [ ] **Preview build isolation verified**: `pnpm build && pnpm preview` → `self.crossOriginIsolated === true`
- [ ] **No COEP-related console errors** when loading the application
- [ ] **All new assets are self-hosted** in appropriate `public/` subdirectories
- [ ] **Tests pass**: `pnpm test`
- [ ] **Linting passes**: `pnpm lint`
- [ ] **Type checking passes**: `pnpm typecheck`

## Common Pitfalls to Avoid

### External Font Services
```javascript
// ❌ This will break cross-origin isolation
<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">

// ✅ Instead, download and self-host
<link href="/fonts/inter.css" rel="stylesheet">
```

### Third-Party Scripts
```javascript
// ❌ External analytics/tracking scripts typically break COEP
<script src="https://www.google-analytics.com/analytics.js"></script>

// ✅ Use privacy-first, self-hosted alternatives or avoid altogether
```

### Cross-Origin API Calls
```javascript
// ❌ Runtime API calls to external services may violate COEP
fetch('https://api.external-service.com/data')

// ✅ All processing should be client-side only (per privacy-first principle)
```

### External Images or Assets
```javascript
// ❌ Images loaded from external domains
<img src="https://cdn.example.com/image.jpg" />

// ✅ Self-hosted images
<img src="/images/example.jpg" />
```

## Development Workflow

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd web-image-upscaler
   pnpm install
   ```

2. **Verify Cross-Origin Isolation**
   ```bash
   pnpm dev
   # Check browser console: self.crossOriginIsolated === true
   ```

3. **Development with Live Verification**
   - Keep DevTools open during development
   - Monitor console for COEP-related errors
   - Test cross-origin isolation after major changes

4. **Before Committing**
   ```bash
   pnpm test          # Run all tests
   pnpm lint          # Check code quality
   pnpm typecheck     # Verify TypeScript
   pnpm build         # Test production build
   pnpm preview       # Verify preview isolation
   ```

## Understanding COEP Errors

If you see console errors like:
```
The resource at 'https://example.com/font.woff2' was blocked due to COEP
```

**Solution steps:**
1. Download the resource locally
2. Place it in the appropriate `public/` directory
3. Update references to use the local path
4. Verify isolation is restored

## Getting Help

If you're unsure whether a change might affect cross-origin isolation:

1. Test locally with both `pnpm dev` and `pnpm preview`
2. Check the [Cross-Origin Isolation Configuration](../deployment/cross-origin-isolation.md) guide
3. Ask in pull request discussion before merging

## Privacy-First Development

Remember that this is a **privacy-first** application:

- No external API calls for image processing
- No user tracking or analytics
- No server-side image uploads
- All processing happens client-side

This principle aligns well with cross-origin isolation requirements, as both promote self-contained, secure applications.

---

For deployment-specific cross-origin isolation setup, see [Cross-Origin Isolation Configuration](../deployment/cross-origin-isolation.md).