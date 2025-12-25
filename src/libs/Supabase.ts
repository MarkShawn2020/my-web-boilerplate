import { createBrowserClient } from '@supabase/ssr';
import { Env } from './Env';

// Client-side Supabase instance with cookie-based session storage
// This syncs with the middleware's cookie-based auth check
export const supabase = createBrowserClient(
  Env.NEXT_PUBLIC_SUPABASE_URL || '',
  Env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);
