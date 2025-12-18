<p align="center">
  <img src="docs/images/cover.png" alt="My Web Boilerplate Cover" width="100%">
</p>

<h1 align="center">
  <img src="assets/logo.svg" width="32" height="32" alt="Logo" align="top">
  My Web Boilerplate
</h1>

<p align="center">
  <strong>Production-ready Next.js 15 starter with Supabase, DrizzleORM & Tailwind CSS v4</strong><br>
  <sub>Web | Full-Stack | TypeScript</sub>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#development">Development</a>
</p>

---

## Features

- **Next.js 15** with App Router and React 19
- **Supabase Auth** with server-side sessions and protected routes
- **DrizzleORM** with PostgreSQL and auto-migrations
- **Tailwind CSS v4** with shadcn/ui components
- **i18n** with next-intl (Chinese/English)
- **Forms** with React Hook Form + Zod validation
- **State** with Zustand
- **Testing** with Vitest + Playwright
- **Monitoring** with Sentry, PostHog, Better Stack
- **Security** with Arcjet (bot detection, WAF)
- **DX** with ESLint, TypeScript strict mode, Storybook

## Quick Start

```bash
# Clone and install
git clone <repo-url> my-project
cd my-project
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Required:
```
DATABASE_URL=your_supabase_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional: `ARCJET_KEY`, `SENTRY_DSN`, `BETTER_STACK_SOURCE_TOKEN`

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI |
| Database | Supabase (PostgreSQL), DrizzleORM |
| Auth | Supabase Auth (SSR) |
| Forms | React Hook Form, Zod |
| State | Zustand |
| i18n | next-intl |
| Testing | Vitest, Playwright |
| Monitoring | Sentry, PostHog, LogTape |
| Security | Arcjet |

## Project Structure

```
src/
├── app/[locale]/          # App Router with i18n
│   ├── (marketing)/       # Public pages
│   ├── (auth)/            # Protected pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── libs/                  # Core services
├── models/Schema.ts       # Database schema
├── locales/               # i18n translations
└── middleware.ts          # Auth & i18n middleware
```

## Development

```bash
npm run dev          # Start dev server (Next.js + Spotlight)
npm run build        # Production build
npm test             # Unit tests
npm run test:e2e     # E2E tests
npm run storybook    # Component dev
npm run db:studio    # Database explorer
npm run db:generate  # Generate migrations
npm run commit       # Interactive commit
```

### Database Schema Changes

1. Edit `src/models/Schema.ts`
2. Run `npm run db:generate`
3. Migrations apply automatically

## License

MIT
