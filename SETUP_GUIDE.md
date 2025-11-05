# ART EUction - Complete Setup Guide

## 🎉 Implementation Complete!

All major features have been implemented. Here's your comprehensive setup guide.

---

## 📋 Table of Contents

1. [Features Implemented](#features-implemented)
2. [Environment Configuration](#environment-configuration)
3. [Supabase Setup](#supabase-setup)
4. [SendGrid Email Setup](#sendgrid-email-setup)
5. [Google Analytics Setup](#google-analytics-setup)
6. [Cloudinary Setup (Optional)](#cloudinary-setup-optional)
7. [Deployment](#deployment)
8. [Testing](#testing)

---

## ✅ Features Implemented

### 1. Artwork Submission Backend ✓
- **Netlify Function**: `functions/submit-artwork.js`
- **Frontend Handler**: `js/artwork-submission.js`
- **Form**: `artwork-submission.html`
- **Features**:
  - Image upload to Supabase Storage
  - Multi-image support (main + 4 additional)
  - Form validation
  - Status tracking

### 2. Admin Dashboard ✓
- **Dashboard**: `/admin/dashboard.html` - Overview and stats
- **Artists**: `/admin/artists.html` - Approve/reject artist applications
- **Artworks**: `/admin/artworks.html` - Moderate artwork submissions
- **Auctions**: `/admin/auctions.html` - Create and manage auctions
- **JavaScript**:
  - `js/admin.js`
  - `js/admin-artists.js`
  - `js/admin-artworks.js`
  - `js/admin-auctions.js`

### 3. Email Notification System ✓
- **Function**: `functions/send-email.js`
- **Templates Included**:
  - Welcome email
  - Artist approval/rejection
  - Artwork approval
  - Auction reminders (24h, 1h)
  - Outbid notifications
  - Winning bid confirmation
- **Provider**: SendGrid (configured for easy swap to Mailgun/AWS SES)

### 4. NGO Portal ✓
- **Registration**: `ngo-registration.html`
- **Dashboard**: `ngo-dashboard.html`
- **Features**:
  - NGO verification workflow
  - Donation tracking
  - Payout management
  - Impact reporting

### 5. Artist Dashboard ✓
- **Dashboard**: `artist-dashboard.html`
- **JavaScript**: `js/artist-dashboard.js`
- **Features**:
  - Submission status tracking
  - Earnings overview
  - Auction history
  - Profile management

### 6. Secondary Integrations ✓
- **Analytics**: `js/analytics.js` - Google Analytics 4 with custom event tracking
- **Social Media**: `js/social-sharing.js` - Share buttons, Open Graph tags
- **Search**: `js/search.js` - Supabase full-text search
- **Image Optimization**: Ready for Cloudinary integration

---

## 🔧 Environment Configuration

### Netlify Environment Variables

Add these in: Netlify Dashboard → Site Settings → Environment Variables

```bash
# Supabase (Required)
SUPABASE_URL=https://niwonrhyekgllofdwzoi.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here

# SendGrid (Required for emails)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@arteuction.com

# Cloudinary (Optional - for enhanced image optimization)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (For future payment integration)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 💾 Supabase Setup

### 1. Create Storage Bucket

```sql
-- Go to Supabase Dashboard → Storage → Create Bucket

Bucket Name: artwork-images
Public: Yes (for public artwork viewing)
```

### 2. Set Storage Policies

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'artwork-images' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'artwork-images'
  AND auth.role() = 'authenticated'
);
```

### 3. Create Database Tables

Run these SQL commands in: Supabase Dashboard → SQL Editor

```sql
-- Artists Table
CREATE TABLE IF NOT EXISTS public."Artists" (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  artist_name TEXT,
  bio TEXT,
  portfolio_url TEXT,
  pdf_url TEXT,
  location TEXT,
  art_category TEXT,
  sdg_tags TEXT[],
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  tiktok_url TEXT,
  pinterest_url TEXT,
  linkedin_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artworks Table
CREATE TABLE IF NOT EXISTS public."Artworks" (
  id BIGSERIAL PRIMARY KEY,
  artist_name TEXT NOT NULL,
  artist_email TEXT NOT NULL,
  artist_phone TEXT,
  artist_bio TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  medium TEXT NOT NULL,
  year_created INTEGER NOT NULL,
  dimensions TEXT,
  edition TEXT,
  primary_sdg INTEGER NOT NULL,
  secondary_sdgs INTEGER[],
  sdg_connection TEXT NOT NULL,
  reserve_price NUMERIC(10,2) NOT NULL,
  starting_bid NUMERIC(10,2),
  artwork_type TEXT NOT NULL,
  shipping_info TEXT,
  exhibition_history TEXT,
  certificate TEXT,
  additional_notes TEXT,
  main_image_url TEXT NOT NULL,
  additional_image_urls TEXT[],
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  auction_id BIGINT
);

-- NGOs Table
CREATE TABLE IF NOT EXISTS public."NGOs" (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  website TEXT,
  description TEXT NOT NULL,
  country TEXT,
  registration_number TEXT,
  primary_sdg INTEGER NOT NULL,
  impact_statement TEXT,
  certificate_url TEXT,
  tax_document_url TEXT,
  bank_name TEXT,
  account_number TEXT,
  swift_code TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Auctions Table
CREATE TABLE IF NOT EXISTS public."Auctions" (
  id BIGSERIAL PRIMARY KEY,
  artwork_id BIGINT REFERENCES public."Artworks"(id),
  ngo_id BIGINT REFERENCES public."NGOs"(id),
  starting_bid NUMERIC(10,2) NOT NULL,
  current_bid NUMERIC(10,2),
  bid_count INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'upcoming',
  featured BOOLEAN DEFAULT FALSE,
  payout_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids Table (for future use)
CREATE TABLE IF NOT EXISTS public."Bids" (
  id BIGSERIAL PRIMARY KEY,
  auction_id BIGINT REFERENCES public."Auctions"(id),
  user_id UUID REFERENCES auth.users(id),
  bid_amount NUMERIC(10,2) NOT NULL,
  bid_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public."Artists" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Artworks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."NGOs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Auctions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Bids" ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_artworks_status ON public."Artworks"(status);
CREATE INDEX idx_artists_email ON public."Artists"(email);
CREATE INDEX idx_auctions_status ON public."Auctions"(status);
CREATE INDEX idx_auctions_dates ON public."Auctions"(start_date, end_date);
```

---

## 📧 SendGrid Email Setup

### 1. Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for free account (100 emails/day)
3. Verify your email address

### 2. Create API Key
1. Go to Settings → API Keys
2. Create API Key
3. Copy key and add to Netlify environment variables as `SENDGRID_API_KEY`

### 3. Verify Sender Identity
1. Go to Settings → Sender Authentication
2. Add your domain or single sender email
3. Complete verification process

### 4. Test Email Function
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "template": "welcome",
    "data": {"name": "Test User"}
  }'
```

---

## 📊 Google Analytics Setup

### 1. Create GA4 Property
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new GA4 property
3. Copy Measurement ID (format: G-XXXXXXXXXX)

### 2. Add to Your Site
Edit `js/analytics.js` line 109:
```javascript
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your ID
```

### 3. Verify Installation
1. Visit your site
2. Check GA4 Realtime reports
3. Should see your visit

---

## 🖼️ Cloudinary Setup (Optional)

For advanced image optimization and CDN delivery:

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get credentials from Dashboard

### 2. Add Environment Variables
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Integration
The artwork submission already uses Supabase Storage. To switch to Cloudinary:
- Modify `js/artwork-submission.js` `uploadImage()` function
- Use Cloudinary upload widget or API
- Update image URLs to use Cloudinary CDN

---

## 🚀 Deployment

### Prerequisites
- GitHub repository
- Netlify account

### Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Complete platform implementation"
git push -u origin claude/artwork-submission-backend-011CUpjUDDV82rcZfw6anZKG
```

2. **Deploy to Netlify**
- Already connected via your existing setup
- Netlify will auto-deploy on push

3. **Configure Environment Variables**
- Go to Netlify Dashboard
- Add all environment variables listed above

4. **Enable Identity (for authentication)**
- Go to Identity tab in Netlify
- Enable Identity
- Configure email templates
- Set registration to "Invite only" or "Open"

5. **Verify Deployment**
- Check build logs
- Visit your site
- Test key features

---

## 🧪 Testing

### Test Checklist

#### Artwork Submission
- [ ] Form validation works
- [ ] Image upload succeeds
- [ ] Submission appears in admin dashboard
- [ ] Email notification sent (if configured)

#### Admin Dashboard
- [ ] Can view all submissions
- [ ] Can approve/reject artists
- [ ] Can approve/reject artworks
- [ ] Can create auctions

#### Artist Dashboard
- [ ] Shows submission status
- [ ] Displays artwork cards
- [ ] Shows earnings (if any)

#### NGO Portal
- [ ] Registration form works
- [ ] Document upload succeeds
- [ ] Dashboard shows donations

#### Email System
- [ ] Welcome emails sent
- [ ] Approval/rejection emails work
- [ ] Auction notifications trigger

---

## 📝 Next Steps

### Immediate Actions

1. **Configure Email Service**
   - Set up SendGrid
   - Add environment variables
   - Test email templates

2. **Set Up Analytics**
   - Add GA4 measurement ID
   - Verify tracking works

3. **Create Admin Account**
   - Use Supabase Auth
   - Add admin role/permissions

4. **Test Full Workflow**
   - Submit artwork
   - Approve in admin
   - Create auction
   - Test notifications

### Future Enhancements

1. **Payment Integration**
   - Integrate Stripe
   - Add payment processing
   - Implement payout system

2. **Real-time Bidding**
   - Add WebSocket support
   - Live auction updates
   - Real-time notifications

3. **Advanced Features**
   - Artwork recommendations
   - User favorites/watchlist
   - Auction calendar
   - Mobile app

---

## 🆘 Support

### Common Issues

**Images not uploading?**
- Check Supabase Storage bucket exists
- Verify bucket is public
- Check storage policies

**Emails not sending?**
- Verify SendGrid API key
- Check sender verification
- Review function logs

**Admin dashboard not loading data?**
- Check Supabase connection
- Verify table structure
- Check RLS policies

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [SendGrid API](https://docs.sendgrid.com/)

---

## 🎉 Congratulations!

Your ART EUction platform is now complete with:
- ✅ Artwork submission system
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ NGO portal
- ✅ Artist dashboard
- ✅ Analytics integration
- ✅ Social media sharing
- ✅ Search functionality

**Ready to launch and make an impact!** 🚀🎨🌍
