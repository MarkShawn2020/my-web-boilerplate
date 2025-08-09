import type { NextFetchEvent, NextRequest } from 'next/server';
import { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { updateSession } from '@/libs/supabase/middleware';
import { routing } from './libs/I18nRouting';

// Use next-intl middleware with our routing configuration
const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = (pathname: string) => {
  return pathname.includes('/dashboard');
};

const isAuthPage = (pathname: string) => {
  return pathname.includes('/sign-in') || pathname.includes('/sign-up');
};

const isHomePage = (pathname: string) => {
  // Check if it's the root path or just a locale path (e.g., '/', '/zh', '/en')
  const segments = pathname.split('/').filter(Boolean);
  return segments.length === 0 || (segments.length === 1 && segments[0] && routing.locales.includes(segments[0]));
};

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    // Block all bots except the following
    allow: [
      // See https://docs.arcjet.com/bot-protection/identifying-bots
      'CATEGORY:SEARCH_ENGINE', // Allow search engines
      'CATEGORY:PREVIEW', // Allow preview links to show OG images
      'CATEGORY:MONITOR', // Allow uptime monitoring services
    ],
  }),
);

export default async function middleware(
  request: NextRequest,
  _event: NextFetchEvent,
) {
  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Apply i18n routing first to handle locale redirects
  const i18nResponse = handleI18nRouting(request);

  // If i18n middleware redirected, return that response
  if (i18nResponse.status === 307 || i18nResponse.status === 308) {
    return i18nResponse;
  }

  // Update Supabase session
  const { response, user } = await updateSession(request);

  // Check authentication for protected routes
  if (isProtectedRoute(request.nextUrl.pathname)) {
    if (!user) {
      const locale = request.nextUrl.pathname.match(/^\/([^/]+)/)?.[1] ?? '';
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage(request.nextUrl.pathname) && user) {
    const locale = request.nextUrl.pathname.match(/^\/([^/]+)/)?.[1] ?? '';
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect authenticated users from home page to dashboard
  if (isHomePage(request.nextUrl.pathname) && user) {
    const locale = request.nextUrl.pathname.match(/^\/([^/]+)/)?.[1] ?? routing.defaultLocale;
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
