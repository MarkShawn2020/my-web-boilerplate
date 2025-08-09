# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack and Spotlight monitoring
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run clean` - Remove build artifacts (.next, out, coverage)
- 不要使用dev脚本，因为本地正在运行

### Code Quality
- `npm run lint` - Run ESLint on entire codebase
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run check:types` - TypeScript type checking without emitting files
- `npm run check:deps` - Check for unused dependencies with Knip
- `npm run check:i18n` - Validate internationalization files

### Testing
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run storybook:test` - Run Storybook component tests

### Database
- `npm run db:generate` - Generate Drizzle migrations from schema changes
- `npm run db:studio` - Open Drizzle Studio for database exploration
- Database schema is in `src/models/Schema.ts`
- Migrations are stored in `migrations/` directory and auto-applied

### Other Tools
- `npm run storybook` - Start Storybook development server
- `npm run commit` - Interactive commit message creation with Commitizen
- `npm run build-stats` - Bundle analyzer for JavaScript bundles

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15+ with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with DrizzleORM
- **Authentication**: Clerk with multi-locale support
- **Internationalization**: next-intl with Chinese (zh) as default locale
- **Security**: Arcjet for bot detection and WAF protection
- **Testing**: Vitest (unit), Playwright (E2E), Storybook (components)
- **Monitoring**: Sentry, PostHog analytics, Better Stack logging

### Project Structure
```
src/
├── app/[locale]/           # Next.js App Router with i18n
│   ├── (auth)/            # Authentication routes
│   ├── (marketing)/       # Public marketing pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── pricing/          # Feature-specific components
├── libs/                 # Third-party service configurations
├── models/               # Database schema definitions
├── locales/              # i18n translation files
├── utils/                # Utility functions and app config
└── validations/          # Zod validation schemas
```

### Key Configuration Files
- `src/utils/AppConfig.ts` - Application configuration with locale detection
- `src/libs/DB.ts` - Database connection with auto-migration
- `src/middleware.ts` - Request middleware with Arcjet security and Clerk auth
- `drizzle.config.ts` - Database ORM configuration

### Database Development
- Schema changes: Edit `src/models/Schema.ts` then run `npm run db:generate`
- Local development: Uses cloud database or local PostgreSQL
- Migrations: Auto-applied on startup, stored in `migrations/`

### Internationalization
- Primary locale: Chinese (zh)
- Supported: Chinese (zh), English (en)
- Files: `src/locales/zh.json`, `src/locales/en.json`
- User locale detection based on Accept-Language header

### Security Features
- Arcjet bot detection and WAF protection via middleware
- Clerk authentication with protected routes
- Rate limiting and attack protection enabled

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` - Authentication
- `ARCJET_KEY` - Security protection
- Optional: Sentry, PostHog, Better Stack tokens for monitoring
