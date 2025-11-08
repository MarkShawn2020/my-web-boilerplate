#!/usr/bin/env tsx
/* eslint-disable no-console */

import { supabase } from '../src/libs/Supabase';

async function applyInsertPolicy() {
  try {
    console.log('Applying INSERT policy for user_profiles...');
    
    // Use the SQL editor/rpc approach with the regular supabase client
    const { error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(0); // Just test the connection

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    }

    console.log('✅ Database connection successful');
    
    // For now, just log what we would execute
    console.log('📝 RLS Policy to apply:');
    console.log('CREATE POLICY "Users can insert own profile" ON "user_profiles" FOR INSERT WITH CHECK (auth.uid() = id);');
    console.log('');
    console.log('⚠️  Please apply this policy manually in your Supabase dashboard:');
    console.log('   1. Go to your Supabase project dashboard');
    console.log('   2. Navigate to Database > Policies');
    console.log('   3. Find "user_profiles" table');
    console.log('   4. Add the INSERT policy shown above');
    console.log('');
    console.log('✅ Profile creation logic has been updated to handle missing profiles');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

applyInsertPolicy();