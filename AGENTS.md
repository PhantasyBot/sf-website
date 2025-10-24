# Repository Guidelines

This repository is a Next.js 14 website for Phantasy. It uses JavaScript (no TypeScript), SCSS modules, absolute-imports from the repo root, and SVGs via SVGR.

## Project Structure & Module Organization

- `pages/`: Route files (`_app.js`, `_document.js`, `index.js`).
- `components/`: Reusable UI; export named components; styles as `*.module.scss`.
- `layouts/`: Page-level shells that compose components.
- `lib/`: Utilities and state (e.g., `lib/store.js` with Zustand).
- `hooks/`: Reusable React hooks.
- `icons/`: SVG assets imported as React components.
- `public/`: Static assets served from `/`.
- `styles/`: Global styles and Sass partials.
- Absolute imports via `jsconfig.json` (`baseUrl: "."`), e.g. `import { Header } from 'components/header'`.

## Build, Test, and Development Commands

- `pnpm i` (or `npm install`): Install dependencies.
- `pnpm dev`: Start dev server at `http://localhost:3000`.
- `pnpm build`: Production build into `.next/`.
- `pnpm start`: Serve the production build.
- `pnpm lint`: Run ESLint with Next rules.
- `pnpm analyze` / `pnpm size`: Bundle analyzer / size-limit check.
- `pnpm postbuild`: Generate sitemap via `next-sitemap`.

## Coding Style & Naming Conventions

- Prettier: single quotes, no semicolons, EOL `auto` (see `.prettierrc`).
- Indentation: 2 spaces (Prettier default).
- ESLint: `next/core-web-vitals` + `prettier`; `no-unused-vars` is an error.
- Components: PascalCase exports; files/folders kebab-case (e.g., `error-boundary.js`).
- Styles: SCSS modules named `component.module.scss` colocated with components.

## Testing Guidelines

- No test framework is configured yet. If adding tests, co-locate `*.test.js` next to source or use a `__tests__/` folder. Prefer React Testing Library for units and Playwright for integration. Keep tests deterministic.

## Commit & Pull Request Guidelines

- Commits: short, imperative summaries (e.g., `fix header alignment`); group related changes.
- Run `pnpm lint && pnpm build` before pushing; Husky + lint-staged auto-format staged files.
- PRs: include purpose, linked issues, and screenshots/GIFs for UI changes; keep PRs focused and small; update docs when behavior changes.

## Security & Configuration Tips

- Copy `.env.example` to `.env.local`; never commit secrets. Only expose public keys with the `NEXT_PUBLIC_` prefix.
- Place large media in `public/` and optimize; avoid committing oversized binaries.
