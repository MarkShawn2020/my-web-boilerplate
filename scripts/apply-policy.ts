#!/usr/bin/env tsx
/* eslint-disable no-console */

import { runMigrations } from '../src/libs/DB';

async function applyPolicy() {
  try {
    console.log('Running migrations to apply RLS policy...');
    await runMigrations();
    console.log('✅ Migrations applied successfully!');
    console.log('The user_profiles INSERT policy should now be active.');
  } catch (error) {
    console.error('❌ Error applying migrations:', error);
    process.exit(1);
  }
}

applyPolicy();