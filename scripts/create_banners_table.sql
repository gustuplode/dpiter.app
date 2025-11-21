-- Create banners table for managing promotional banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active banners" ON banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can view all banners" ON banners
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert banners" ON banners
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update banners" ON banners
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete banners" ON banners
  FOR DELETE USING (auth.role() = 'authenticated');
