import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Use placeholder values if not configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase environment variables not configured. Authentication will not work.');
  }

  return createBrowserClient(url, anonKey);
}
