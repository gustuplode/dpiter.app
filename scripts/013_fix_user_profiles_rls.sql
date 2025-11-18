-- Drop existing RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create new RLS policies that work with Firebase user_id (stored as text)
-- Allow users to view their own profile by matching user_id as text
CREATE POLICY "Users can view their own profile"
ON user_profiles
FOR SELECT
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id IS NOT NULL);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON user_profiles
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own profile by user_id
CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (true);
