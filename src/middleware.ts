import type { NextRequest } from 'next/server';
import { detectBot } from '@arcjet/next';
import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { routing } from './libs/I18nRouting';

// Use next-intl middleware with our routing configuration
const handleI18nRouting = createMiddleware(routing);

// Route matchers
const isProtectedRoute = (pathname: string) => {
  return pathname.includes('/dashboard');
};

const isAuthPage = (pathname: string) => {
  return pathname.includes('/sign-in') || pathname.includes('/sign-up');
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
) {
  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const pathname = request.nextUrl.pathname;

  // Handle authentication for protected routes
  if (isProtectedRoute(pathname)) {
    // Create Supabase client for server-side auth
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {
            // Do nothing in middleware
          },
          remove() {
            // Do nothing in middleware
          },
        },
      },
    );

    // Check if user is authenticated
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      // Extract locale from path for redirect
      const localeMatch = pathname.match(/^\/([^/]+)\//);
      const locale = localeMatch?.[1];

      // Build sign-in URL with proper locale
      let signInUrl = '/sign-in';
      if (locale && locale !== routing.defaultLocale) {
        signInUrl = `/${locale}/sign-in`;
      }

      const url = new URL(signInUrl, request.url);
      url.searchParams.set('redirect', pathname);

      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage(pathname)) {
    // Create Supabase client for server-side auth
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {
            // Do nothing in middleware
          },
          remove() {
            // Do nothing in middleware
          },
        },
      },
    );

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // Extract locale from path for redirect
      const localeMatch = pathname.match(/^\/([^/]+)\//);
      const locale = localeMatch?.[1];

      // Build dashboard URL with proper locale
      let dashboardUrl = '/dashboard';
      if (locale && locale !== routing.defaultLocale) {
        dashboardUrl = `/${locale}/dashboard`;
      }

      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
