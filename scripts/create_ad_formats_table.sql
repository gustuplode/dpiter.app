-- Create ad_formats table to store different ad format configurations
CREATE TABLE IF NOT EXISTS ad_formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  format_type TEXT NOT NULL CHECK (format_type IN ('banner', 'onclick', 'push_notifications', 'in_page_push', 'interstitial', 'vignette', 'native')),
  ad_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ad_formats ENABLE ROW LEVEL SECURITY;

-- Policies for ad_formats
CREATE POLICY "Anyone can view active ad formats"
  ON ad_formats FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can view all ad formats"
  ON ad_formats FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert ad formats"
  ON ad_formats FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update ad formats"
  ON ad_formats FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete ad formats"
  ON ad_formats FOR DELETE
  USING (auth.role() = 'authenticated');
