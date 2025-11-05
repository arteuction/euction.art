-- =============================================================================
-- ART EUction - Artworks Table Schema
-- =============================================================================
-- This table stores all artwork submissions from artists
-- Status flow: pending → approved → active (in auction) → sold/unsold
-- =============================================================================

CREATE TABLE IF NOT EXISTS Artworks (
  -- Primary identification
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Artist relationship
  artist_id UUID REFERENCES Artists(id) ON DELETE CASCADE,
  artist_email TEXT NOT NULL,
  artist_name TEXT NOT NULL,

  -- Artwork basic information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  medium TEXT NOT NULL,
  year_created INTEGER NOT NULL,
  dimensions TEXT,
  edition TEXT,

  -- Image URLs (stored in Supabase Storage)
  main_image_url TEXT NOT NULL,
  additional_images TEXT[], -- Array of image URLs

  -- SDG alignment
  primary_sdg INTEGER NOT NULL CHECK (primary_sdg >= 1 AND primary_sdg <= 17),
  secondary_sdgs INTEGER[] DEFAULT '{}',
  sdg_connection TEXT NOT NULL, -- How artwork connects to SDG

  -- Pricing and auction details
  reserve_price NUMERIC NOT NULL CHECK (reserve_price >= 100),
  starting_bid NUMERIC CHECK (starting_bid >= 100),
  current_bid NUMERIC DEFAULT 0,
  artwork_type TEXT NOT NULL CHECK (artwork_type IN ('physical', 'digital', 'both')),

  -- Shipping and logistics
  shipping_info TEXT,

  -- Exhibition and provenance
  exhibition_history TEXT,
  certificate_of_authenticity TEXT CHECK (certificate_of_authenticity IN ('yes', 'will-provide', 'no')),

  -- Additional metadata
  additional_notes TEXT,

  -- Artist bio (optional, from submission form)
  artist_bio TEXT,
  phone TEXT,

  -- Status and workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'sold', 'unsold')),
  rejection_reason TEXT, -- If rejected, store reason

  -- Auction scheduling (set when approved)
  auction_id UUID, -- Will reference Auctions table when created
  auction_start TIMESTAMP WITH TIME ZONE,
  auction_end TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID -- Admin user who approved
);

-- =============================================================================
-- Indexes for performance
-- =============================================================================

-- Index for finding artworks by artist
CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON Artworks(artist_id);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_artworks_status ON Artworks(status);

-- Index for finding by primary SDG
CREATE INDEX IF NOT EXISTS idx_artworks_primary_sdg ON Artworks(primary_sdg);

-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON Artworks(created_at DESC);

-- Index for active auctions
CREATE INDEX IF NOT EXISTS idx_artworks_auction_end ON Artworks(auction_end) WHERE status = 'active';

-- =============================================================================
-- Row Level Security (RLS) Policies
-- =============================================================================

-- Enable RLS
ALTER TABLE Artworks ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved/active/sold artworks
CREATE POLICY "Public artworks are viewable by everyone"
  ON Artworks FOR SELECT
  USING (status IN ('approved', 'active', 'sold', 'unsold'));

-- Policy: Artists can view their own submissions
CREATE POLICY "Artists can view their own artworks"
  ON Artworks FOR SELECT
  USING (artist_email = auth.jwt() ->> 'email');

-- Policy: Anyone can insert (for submission form)
-- Note: In production, you might want to restrict this to authenticated users
CREATE POLICY "Anyone can submit artworks"
  ON Artworks FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can update artworks
-- Note: You'll need to add an 'admin' role to implement this
-- For now, we'll use a service role key for admin operations

-- =============================================================================
-- Trigger to update updated_at timestamp
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON Artworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Sample queries for common operations
-- =============================================================================

-- Get all pending artworks for admin review:
-- SELECT * FROM Artworks WHERE status = 'pending' ORDER BY created_at DESC;

-- Get all active auctions:
-- SELECT * FROM Artworks WHERE status = 'active' ORDER BY auction_end ASC;

-- Get artworks by specific SDG:
-- SELECT * FROM Artworks WHERE primary_sdg = 13 AND status IN ('approved', 'active');

-- Get an artist's submission history:
-- SELECT * FROM Artworks WHERE artist_email = 'artist@example.com' ORDER BY created_at DESC;
