#!/usr/bin/env tsx
/* eslint-disable no-console */

import { supabaseAdmin } from '../src/libs/SupabaseServer';

async function applyRLSPolicy() {
  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not available. Check SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  try {
    console.log('Applying RLS INSERT policy for user_profiles...');
    
    const { error } = await supabaseAdmin
      .rpc('exec_sql', {
        sql: `CREATE POLICY "Users can insert own profile" ON "user_profiles" FOR INSERT WITH CHECK (auth.uid() = id);`
      });

    if (error) {
      // If the policy already exists, that's fine
      if (error.message.includes('already exists')) {
        console.log('✅ Policy already exists, skipping.');
        return;
      }
      throw error;
    }

    console.log('✅ RLS INSERT policy applied successfully!');
    console.log('Users can now create their own profiles automatically.');
  } catch (error) {
    console.error('❌ Error applying RLS policy:', error);
    process.exit(1);
  }
}

applyRLSPolicy();