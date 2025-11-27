-- Add link_url column to banners table for redirect functionality
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS link_url TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN banners.link_url IS 'Optional URL to redirect when user clicks on banner';
