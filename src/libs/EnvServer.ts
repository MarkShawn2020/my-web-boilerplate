// Simplified environment variables for server-side API routes
// This avoids module resolution issues with @t3-oss/env-nextjs in API route context

export const EnvServer = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
