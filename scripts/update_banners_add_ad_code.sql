-- Update banners table to support ad_code type
ALTER TABLE banners DROP CONSTRAINT IF EXISTS banners_type_check;
ALTER TABLE banners ADD CONSTRAINT banners_type_check CHECK (type IN ('image', 'video', 'ad_code'));

-- Add ad_code column for storing ad scripts/iframes
ALTER TABLE banners ADD COLUMN IF NOT EXISTS ad_code TEXT;
