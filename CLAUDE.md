# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Design System

This project uses **Lovstudio Warm Academic Style (暖学术风格)**

Reference complete design guide: file:///Users/mark/@lovstudio/design/design-guide.md

### Quick Rules
1. **禁止硬编码颜色**：必须使用 semantic 类名（如 `bg-primary`、`text-muted-foreground`）
2. **字体配对**：标题用 `font-serif`，正文用默认 `font-sans`
3. **圆角风格**：使用 `rounded-lg`、`rounded-xl`、`rounded-2xl`
4. **主色调**：陶土色（按钮/高亮）+ 暖米色背景 + 炭灰文字
5. **组件优先**：优先使用 shadcn/ui 组件

### Color Palette
- **Primary**: #D97757 (陶土色 Terracotta)
- **Background**: #F9F9F7 (暖米色 Warm Beige)
- **Foreground**: #181818 (炭灰色 Charcoal)
- **Border**: #87867F

### Common Patterns
- 主按钮: `bg-primary text-primary-foreground hover:bg-primary/90`
- 卡片: `bg-card border border-border rounded-xl`
- 标题: `font-serif text-foreground`

## Project Overview

Next.js 15 boilerplate application with TypeScript, Supabase authentication, and DrizzleORM. Default locale is Chinese (zh).

## Development Commands

**IMPORTANT**: Local dev server runs with `npm run dev` (starts both Next.js and Spotlight). DO NOT start additional dev servers.

Common commands:
- `npm run check:types` - Type checking
- `npm run lint:fix` - Fix linting issues
- `npm test` - Run unit tests with Vitest
- `npm test -- src/path/to/file.test.ts` - Run single test file
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run commit` - Interactive commit with Commitizen
- `npm run storybook` - UI component development at http://localhost:6006

Quality checks:
- `npm run check:deps` - Detect unused files/dependencies with Knip
- `npm run check:i18n` - Validate i18n translations

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
- **Auth**: Supabase Auth (server-side with cookie-based sessions)
- **State**: Zustand for client-side state
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