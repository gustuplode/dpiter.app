-- Create ratings table for collections and products
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('collection', 'product')),
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, user_id)
);

-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view ratings"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can add ratings"
  ON ratings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ratings_item_id ON ratings(item_id);
CREATE INDEX IF NOT EXISTS idx_ratings_item_type ON ratings(item_type);
