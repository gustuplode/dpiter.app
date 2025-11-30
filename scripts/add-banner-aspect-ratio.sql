-- Add aspect ratio columns to banners table
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT '16/7',
ADD COLUMN IF NOT EXISTS custom_width INTEGER,
ADD COLUMN IF NOT EXISTS custom_height INTEGER;

-- Update existing banners to have default aspect ratio
UPDATE banners SET aspect_ratio = '16/7' WHERE aspect_ratio IS NULL;
