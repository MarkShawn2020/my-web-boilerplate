# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 boilerplate application with TypeScript, Supabase authentication, and DrizzleORM. Default locale is Chinese (zh).

## Development Commands

**IMPORTANT**: Local dev server runs with `npm run dev` (starts both Next.js and Spotlight). DO NOT start additional dev servers.

Common commands:
- `npm run check:types` - Type checking
- `npm run lint:fix` - Fix linting issues
- `npm test` - Run unit tests with Vitest
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run commit` - Interactive commit with Commitizen

Database commands:
- `npm run db:studio` - Open Drizzle Studio at https://local.drizzle.studio
- `npm run db:generate` - Generate migrations after schema changes in `src/models/Schema.ts`
- `npm run db:push` - Push schema changes directly (use with caution)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: Supabase (PostgreSQL) + DrizzleORM
- **Auth**: Supabase Auth (server-side)
- **Forms**: React Hook Form + Zod validation
- **i18n**: next-intl (zh/en locales)
- **Monitoring**: Sentry (with Spotlight for dev), PostHog, Better Stack
- **Security**: Arcjet (bot detection, WAF)

### Directory Structure
```
src/
├── app/[locale]/              # App Router with i18n
│   ├── (marketing)/           # Public pages (about, pricing, etc.)
│   ├── (auth)/                # Protected pages (dashboard, profile)
│   │   └── (center)/          # Centered auth pages (sign-in, sign-up)
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/                # Layout components
│   └── auth/                  # Auth-specific components
├── libs/                      # Core services & integrations
│   ├── DB.ts                  # Database connection & migrations
│   ├── Auth.ts                # AuthService class for user management
│   ├── Supabase*.ts           # Supabase clients (server/client)
│   ├── Env*.ts                # Environment variable validation (T3 Env)
│   └── I18n*.ts               # Internationalization setup
├── models/
│   └── Schema.ts              # DrizzleORM database schema
├── types/                     # TypeScript type definitions
├── utils/                     # Utility functions
├── validations/               # Zod validation schemas
└── middleware.ts              # Auth & i18n middleware

migrations/                     # Drizzle migration files
tests/
├── e2e/                       # Playwright E2E tests
└── integration/               # Integration tests
```

### Database Schema

Main tables in `src/models/Schema.ts`:
- `counterSchema` - Example counter table (demo)
- `userProfiles` - Extended user data (id references auth.users, email, fullName, locale, timezone, onboardingCompleted)
- `userPreferences` - User settings (theme, emailNotifications, language)
- `userSubscriptions` - Billing & subscription management (planId, status, Stripe integration)

### Key Patterns

1. **Authentication Flow**:
   - Middleware (`src/middleware.ts`) protects `/dashboard` routes
   - Uses Supabase server-side auth with cookie-based sessions
   - `AuthService` class in `src/libs/Auth.ts` handles all auth operations
   - Protected routes redirect to sign-in with `?redirect=` parameter

2. **Database Migrations**:
   - Schema defined in `src/models/Schema.ts`
   - Migrations auto-run on first database interaction via `runMigrations()` in `src/libs/DB.ts`
   - Generate new migrations with `npm run db:generate` after schema changes

3. **Internationalization**:
   - Routes prefixed with locale: `/[locale]/...`
   - Default locale is 'zh' (Chinese)
   - Translations in `src/locales/{locale}/*.json`
   - Use `useTranslations()` hook for client components

4. **Environment Variables**:
   - Validated with T3 Env in `src/libs/Env.ts` (client) and `src/libs/EnvServer.ts` (server)
   - Required: `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Optional: `ARCJET_KEY`, `SENTRY_DSN`, `BETTER_STACK_SOURCE_TOKEN`

5. **Security**:
   - Arcjet middleware provides bot detection and WAF protection
   - Configure in `src/libs/Arcjet.ts` and `src/middleware.ts`

## Development Guidelines

### Modifying Database Schema

1. Edit `src/models/Schema.ts`
2. Run `npm run db:generate` to create migration
3. Migration applies automatically on next DB interaction (no restart needed)

### Adding New Components

- Use existing shadcn/ui components from `src/components/ui/`
- Follow TypeScript strict mode (no implicit any)
- Co-locate tests with components (e.g., `Component.test.tsx`)

### Working with Auth

- Server components: Use `AuthService` methods from `src/libs/Auth.ts`
- Client components: Use `useAuthUser()` hook from `src/hooks/useAuthUser.ts`
- Example: `const user = await AuthService.getCompleteUser(userId)`

### Testing

- Unit tests: Located alongside source files, run with `npm test`
- E2E tests: In `tests/e2e/`, run with `npm run test:e2e`
- Monitoring tests: Files ending in `*.check.e2e.ts` run via Checkly in production