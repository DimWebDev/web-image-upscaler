# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Stateless Web Image Upscaler** - a privacy-first web application that enhances and upscales images entirely client-side in the browser. No server uploads, no user accounts, no data persistence.

**Key Principles:**
- Complete privacy through client-side processing only
- Stateless sessions with no data persistence 
- Sub-5-click workflow from upload to download
- Quality-first approach (processing time flexible)
- Graceful degradation and transparent error handling

## Documentation

**Before making any changes, read all documentation in the `docs/` directory**


## Development Commands

*Note: This project is in early planning phase. Commands will be available once development begins:*

```bash
npm install        # Install dependencies
npm run dev       # Start development server
npm run build     # Production build
npm run test      # Run all tests
npm run lint      # Check code quality
npm run typecheck # TypeScript validation
```

## Code Quality Standards

### Agent Responsibilities

- **Code Quality:** Adhere to defined standards and best practices. All code must be clear and well-documented:
  - Use descriptive, distinct variable and function names (even if longer) for clarity.
  - Add comments and docstrings as appropriate for the language (e.g., JSDoc, Python docstrings, etc.).
  - Avoid abstract methods or patterns that obscure logic—prefer explicit, readable code.
  - Strive for self-documenting code: structure and naming should make intent obvious without external explanation.
- **Documentation:** Whenever you make a change, update all related documentation files (e.g., PRD.md, Planning.md, README.md, API docs) to reflect the new state.
- **Testing:** When adding new code, create or adjust tests to ensure coverage. Maintain high test coverage and ensure all tests pass before merging.
- **Collaboration:** Communicate effectively with team members and maintainers.

### Architecture and Design Standards

- **Best Practices:** Follow established best practices for the chosen tech stack (React, TypeScript, etc.)
- **Modular Design:** Implement proper separation of concerns with clear module boundaries
- **File Size Limit:** No file should exceed 400 lines of code (this rule does not apply to .md files)
- **Component Architecture:** Follow React best practices with functional components, hooks, and proper state management
- **Error Handling:** Implement comprehensive error boundaries and graceful degradation
- **Performance:** Optimize for client-side processing with Web Workers and memory management

## Git Workflow and Branching

### Branching Strategy
- Use a proper branching strategy with feature branches
- Never work directly on the main branch
- Create descriptive branch names that reflect the feature or fix

### Pull Request Rules
- **No automatic PR creation:** Pull requests should NEVER be created unless the user explicitly requests it
- **No automatic merging:** Pull requests should NEVER be merged unless the user explicitly states the PR should be merged  
- **No branch deletion:** Branches should NEVER be deleted unless explicitly requested by the user
- Always wait for explicit user instruction before any Git workflow actions

## Core Architecture

### Processing Pipeline
1. **File Intake:** Drag-and-drop validation (JPG/PNG/WEBP only)
2. **Three-Stage Processing:** Analyzing → Processing → Finalizing
3. **Quality Comparison:** Before/after with PSNR/SSIM metrics
4. **Client-Side Only:** All processing in Web Workers using WASM

### Key Constraints
- **Privacy First:** Zero server communication for image data
- **Browser Support:** Chrome ≥91, Firefox ≥89, Safari ≥16.4
- **Memory Management:** Graceful handling of browser limitations
- **Accessibility:** WCAG 2.1 AA compliance required

## Development Guidelines

- Follow the specifications in `docs/` directory exactly
- Implement error handling with clear user feedback
- Ensure cross-browser compatibility within defined constraints
- Maintain privacy guarantees - no external API calls for image processing
- Optimize for performance while prioritizing code clarity
- Write comprehensive tests for all functionality

## Testing Requirements

- Unit tests for all utilities and processing logic
- Component tests for UI states and interactions  
- End-to-end tests for complete user workflows
- Accessibility tests for WCAG compliance
- Cross-browser compatibility testing


## Available MCP Server Tools

The following MCP (Model Context Protocol) servers are available for enhanced functionality:

1. **codebase-navigator**: Provides quick high-level codebase overview and structural analysis. Use for initial project understanding and architectural analysis.

2. **context7**: Fetches up-to-date, version-specific documentation and code examples for libraries directly into prompts. Use when needing current documentation or examples for specific library versions.

3. **playwright**: Enables browser automation and testing capabilities using Playwright. Use for automated testing, web scraping, and browser interaction tasks.

4. **sequentialthinking**: Implements structured sequential reasoning for breaking down complex problems into manageable steps. Use for complex problem-solving that requires systematic analysis and planning.

5. **serena**: Provides semantic codebase analysis with LSP-based symbol-level understanding and editing capabilities. Use for deep code navigation, precise refactoring, and IDE-like functionality - preferred for detailed codebase work.

## Task Discovery & Updates

If new tasks are discovered during development or review, **immediately append them `docs/backlog/backlog.md` file** in this directory to reflect these additions.  
If the new tasks indicate a change in architecture, scope, or planning, **also update other affected files**.
