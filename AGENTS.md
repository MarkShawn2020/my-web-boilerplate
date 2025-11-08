# Repository Guidelines

## Project Structure & Module Organization
- `src/app` – Next.js App Router routes, layouts, and metadata.
- `src/components` – Reusable UI (PascalCase files), `src/components/auth/*` for auth flows.
- `src/libs` – Services and integrations (Supabase, i18n, logging, Env).
- `src/utils`, `src/validations` – Helpers and Zod schemas.
- `src/providers`, `src/templates`, `src/hooks` – Context providers, UI templates, custom hooks.
- `public` – Static assets. `migrations`, `supabase` – Database and platform configs.
- `tests` – `e2e/*` (Playwright), `integration/*` (API/feature), unit tests live near code (e.g., `*.test.ts(x)`).

## Build, Test, and Development Commands
- `pnpm dev` – Run local dev (Next.js + tools).
- `pnpm build` / `pnpm start` – Production build and serve.
- `pnpm lint` / `pnpm lint:fix` – ESLint check and autofix.
- `pnpm check:types` – TypeScript type checking.
- `pnpm test` – Unit tests (Vitest). `pnpm test:e2e` – E2E (Playwright).
- `pnpm storybook` – Run Storybook. `pnpm build-storybook` – Static build.
- Useful checks: `pnpm check:i18n`, `pnpm check:deps`, `pnpm clean`.

## Coding Style & Naming Conventions
- Language: TypeScript (Node ≥ 20), Next.js 15, React 19.
- Linting: ESLint (antfu config, less stylistic). Prefer IDE formatting; keep imports clean.
- Naming: Components/files PascalCase (e.g., `CounterForm.tsx`), hooks `useX` (e.g., `useAuthUser.ts`).
- Imports: Prefer aliases `@/*` over deep relatives.
- Keep functions small, pure where possible; avoid unused exports.

## Testing Guidelines
- Unit: Vitest (`*.test.ts(x)`); place near source (e.g., `src/utils/Helpers.test.ts`).
- Integration: `tests/integration/*.spec.ts`. E2E: `tests/e2e/*.e2e.ts` (Playwright).
- Run locally before PR: `pnpm test` and `pnpm test:e2e` if your change affects flows.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits via commitlint (e.g., `feat: add counter form`, `fix(auth): handle session refresh`).
- PRs: Keep small and focused. Include description, linked issues, and screenshots for UI changes.
- Required checks before merge: `pnpm lint`, `pnpm check:types`, `pnpm test` should pass.

## Security & Configuration Tips
- Use `.env`/`.env.production` for secrets; never commit secrets. Configure Supabase and DB via `drizzle.config` and `supabase/` as needed.
- Review `next.config.ts` and `tsconfig.json` for performance and path aliases.
