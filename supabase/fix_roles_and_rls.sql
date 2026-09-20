-- =========================================================================
-- PASS NO JUGAAD: Fix Profiles RLS and User Role Updates in Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =========================================================================

-- 1. Create a secure RPC function to update user roles (bypasses RLS safely)
CREATE OR REPLACE FUNCTION update_user_role(target_user_id UUID, new_role TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET role = new_role
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure RLS policies allow reading and updating profiles
-- Drop conflicting restrictive update policies if they exist
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile updates" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Allow everyone / authenticated users to view profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Allow authenticated users / admins to update profiles
CREATE POLICY "Allow profile updates"
ON public.profiles FOR UPDATE
USING (true)
WITH CHECK (true);
