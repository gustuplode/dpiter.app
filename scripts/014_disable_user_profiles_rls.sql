-- Completely remove RLS restrictions on user_profiles table
-- This allows Firebase-authenticated users to manage their profiles

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Disable RLS on user_profiles since we're using Firebase Auth (not Supabase Auth)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Note: Access control is handled by Firebase Auth on the client side
-- The user_id field stores the Firebase UID for reference
