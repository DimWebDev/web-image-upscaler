# Cross-Origin Isolation Configuration

## Overview

This application requires **Cross-Origin Isolation** to enable SharedArrayBuffer and Web Workers with threading capabilities for client-side image processing. Cross-origin isolation is achieved by setting two critical HTTP headers:

- **Cross-Origin-Opener-Policy (COOP)**: `same-origin`
- **Cross-Origin-Embedder-Policy (COEP)**: `require-corp`

## Why Cross-Origin Isolation is Required

Modern browsers restrict access to SharedArrayBuffer and high-resolution timers for security reasons. Cross-origin isolation creates a secure context that allows:

- **SharedArrayBuffer**: Essential for efficient memory sharing between main thread and Web Workers
- **High-resolution timers**: Better performance monitoring for image processing operations
- **Atomics**: Thread-safe operations for concurrent processing

Without these capabilities, the image processing pipeline would be significantly slower and less efficient.

## Verification Steps

### Local Development
1. Start the development server: `pnpm dev`
2. Open your browser to `http://localhost:5173/`
3. Open browser DevTools Console (F12)
4. Run: `self.crossOriginIsolated`
5. ✅ Should return `true`

### Production Deployment
1. Deploy your application with the headers configured (see platform-specific instructions below)
2. Navigate to your deployed URL
3. Open browser DevTools Console (F12)
4. Run: `self.crossOriginIsolated`
5. ✅ Should return `true`

## Platform-Specific Configuration

### Vercel

Create or update `vercel.json` in your project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        }
      ]
    }
  ]
}
```

### Netlify

Create `public/_headers` file:

```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

### Cloudflare Pages

Add to your `_headers` file in the build output:

```
/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

### Nginx

Add to your server configuration:

```nginx
server {
    # ... other configuration

    location / {
        add_header Cross-Origin-Opener-Policy same-origin;
        add_header Cross-Origin-Embedder-Policy require-corp;
        
        # ... other directives
    }
}
```

### Apache

Add to your `.htaccess` file or virtual host configuration:

```apache
Header always set Cross-Origin-Opener-Policy "same-origin"
Header always set Cross-Origin-Embedder-Policy "require-corp"
```

## Common Pitfalls and Solutions

### ❌ Third-Party Resources
Cross-origin resources (fonts, scripts, images) will be blocked by COEP unless properly configured.

**Solution**: 
- Self-host all resources when possible
- For external resources, ensure they serve `Cross-Origin-Resource-Policy: cross-origin` header
- Use `crossorigin` attribute on script/link tags for CORS-enabled resources

### ❌ External Fonts (Google Fonts, etc.)
External font services typically don't support the required headers.

**Solution**: Download and self-host fonts in your `public/` directory.

### ❌ Third-Party Analytics/Scripts
Most analytics and tracking scripts are incompatible with COEP.

**Solution**: 
- Use privacy-first, self-hosted analytics
- Avoid third-party scripts that make cross-origin requests
- For essential services, check if they provide COEP-compatible versions

### ❌ Iframes
Cross-origin iframes conflict with COOP policy.

**Solution**: 
- Avoid cross-origin iframes
- Use same-origin alternatives
- Consider server-side integration instead

## Development Guidelines

### For Contributors
When adding new features or dependencies:

1. **No Cross-Origin Assets**: Avoid adding external fonts, scripts, images, or other assets
2. **Self-Host Resources**: Place all static assets in the `public/` directory
3. **Verify Locally**: Always test `self.crossOriginIsolated === true` after changes
4. **Review Dependencies**: Check that npm packages don't make runtime cross-origin requests

### PR Checklist
Before submitting a pull request:

- [ ] No new cross-origin resources introduced
- [ ] `pnpm dev` shows cross-origin isolated status
- [ ] `pnpm build && pnpm preview` shows cross-origin isolated status
- [ ] No console errors related to COEP blocking resources
- [ ] All new assets are self-hosted in `public/`

## Troubleshooting

### Browser Support
Minimum browser versions supporting cross-origin isolation:
- Chrome ≥91
- Firefox ≥89  
- Safari ≥16.4
- Edge ≥91

### Debug Console Errors
Common COEP-related errors and solutions:

**Error**: `The resource at 'https://example.com/font.woff2' was blocked due to COEP`
**Solution**: Download the font and place it in `public/fonts/`

**Error**: `SharedArrayBuffer is not defined`
**Solution**: Verify `self.crossOriginIsolated === true` and check headers are properly set

### Testing Cross-Origin Isolation
You can test headers are properly set using curl:

```bash
curl -I https://your-domain.com

# Look for these headers in the response:
# Cross-Origin-Opener-Policy: same-origin
# Cross-Origin-Embedder-Policy: require-corp
```

## Security Considerations

Cross-origin isolation provides security benefits but comes with trade-offs:

### Benefits
- Prevents timing attacks using SharedArrayBuffer
- Isolates your application from cross-origin contexts
- Enables high-precision performance measurements

### Constraints
- Limits integration with third-party services
- Requires careful resource management
- May complicate some social media integrations

For this privacy-first image upscaler, these constraints align well with our goals of complete client-side processing.

## Further Reading

- [MDN: Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)
- [MDN: Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)
- [Making your website "cross-origin isolated"](https://web.dev/cross-origin-isolation-guide/)