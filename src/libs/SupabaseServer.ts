import { createClient } from '@supabase/supabase-js';
import { EnvServer } from './EnvServer';

// Server-side Supabase instance for API routes - uses service role key
export const supabaseAdmin = EnvServer.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      EnvServer.NEXT_PUBLIC_SUPABASE_URL || '',
      EnvServer.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )
  : null;

// Regular server-side client for auth operations
export const supabaseServer = createClient(
  EnvServer.NEXT_PUBLIC_SUPABASE_URL || '',
  EnvServer.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);
