Suggested commands for development (Darwin/macOS):

# Install and setup
- npm install
- (If using pnpm or yarn, use project preference.)

# Dev server
- npm run dev  # starts Vite dev server

# Build
- npm run build  # create production bundle via Vite

# Lint
- npm run lint  # runs ESLint

# Format
- npm run format  # runs Prettier

# Tests
- npm test  # runs Vitest (unit + component)
- npm run test:watch  # watch mode for Vitest

# E2E
- npm run e2e  # run Playwright or Cypress tests (if configured)

# Git & utility
- git status
- git add .
- git commit -m "..."
- git push

Notes:
- Node engine: use Node 20.19.4 for local development where possible.
- Use `npm ci` in CI environments for reproducible installs.
