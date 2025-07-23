-- Migration: Add INSERT policy for user_profiles table
-- This allows authenticated users to create their own profile record
-- when it doesn't exist (e.g., during first login)

-- Users can insert own profile (for automatic profile creation)
CREATE POLICY "Users can insert own profile" ON "user_profiles"
  FOR INSERT WITH CHECK (auth.uid() = id);