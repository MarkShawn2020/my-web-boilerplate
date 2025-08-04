import { createClient } from '@supabase/supabase-js';
import { Env } from './Env';

export const supabase = createClient(
  Env.NEXT_PUBLIC_SUPABASE_URL || '',
  Env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

export const supabaseAdmin = Env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      Env.NEXT_PUBLIC_SUPABASE_URL || '',
      Env.SUPABASE_SERVICE_ROLE_KEY,
    )
  : null;
