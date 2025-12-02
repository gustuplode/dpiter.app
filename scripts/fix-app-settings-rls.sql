-- Fix RLS policy for app_settings table to allow INSERT
-- Run this script to enable saving AI settings

-- Add INSERT policy for authenticated users
CREATE POLICY IF NOT EXISTS "Authenticated users can insert app settings"
ON app_settings
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also add a policy for anon users if needed (for server-side operations)
CREATE POLICY IF NOT EXISTS "Service role can manage app settings"
ON app_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Alternative: If above fails, try this approach
DO $$
BEGIN
  -- Check if INSERT policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'app_settings' 
    AND policyname LIKE '%insert%'
  ) THEN
    -- Create the policy
    EXECUTE 'CREATE POLICY "Allow insert app settings" ON app_settings FOR INSERT TO authenticated WITH CHECK (true)';
  END IF;
END $$;
