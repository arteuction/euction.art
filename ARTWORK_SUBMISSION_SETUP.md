# Artwork Submission System Setup Guide

## Overview

This guide will help you set up the complete artwork submission pipeline for ART EUction, including:
- ✅ Image uploads to Supabase Storage
- ✅ Database storage of artwork metadata
- ✅ Multi-file upload support (main + additional images)
- ✅ Client-side validation and preview
- ✅ Server-side processing via Netlify Functions

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install the new dependency: `parse-multipart-data` for handling file uploads in Netlify Functions.

### 2. Set Up Supabase Database

Go to your Supabase Dashboard SQL Editor and run the schema:

```bash
# Copy the contents of supabase/artworks-schema.sql
# Paste into Supabase Dashboard → SQL Editor → Run
```

This creates:
- `Artworks` table with all necessary fields
- Indexes for performance
- Row Level Security policies
- Triggers for timestamp updates

### 3. Set Up Supabase Storage

Follow the detailed guide in `supabase/STORAGE_SETUP.md`:

1. **Create Storage Bucket:**
   - Dashboard → Storage → New Bucket
   - Name: `artworks`
   - Public: Yes
   - File size limit: 10MB

2. **Set Up Policies:**
   - Allow public read access
   - Allow authenticated upload
   - (Optional) Allow users to delete own uploads

3. **Get Service Role Key:**
   - Dashboard → Settings → API → Service Role Key
   - **Important:** This key has elevated permissions!

### 4. Configure Environment Variables

Add to your Netlify environment variables (or `.env` for local testing):

```bash
SUPABASE_URL=https://niwonrhyekgllofdwzoi.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Where to add these:**

- **Netlify Dashboard:** Site Settings → Environment Variables
- **Local Testing:** Create `.env` file in project root (already in `.gitignore`)

### 5. Test Locally

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Run local development server
netlify dev

# This will start:
# - Local server on http://localhost:8888
# - Netlify Functions on http://localhost:8888/.netlify/functions/*
```

Visit `http://localhost:8888/artwork-submission.html` to test the form.

### 6. Deploy to Production

```bash
git add .
git commit -m "Add artwork submission backend with Supabase Storage"
git push origin your-branch-name

# Netlify will auto-deploy when you push
```

---

## 📋 What Was Implemented

### Backend (Netlify Function)

**File:** `functions/submit-artwork.js`

Features:
- ✅ Multipart form data parsing
- ✅ File validation (type, size)
- ✅ Image upload to Supabase Storage
- ✅ Multiple file support (main + up to 4 additional)
- ✅ Sanitized filename generation
- ✅ Automatic cleanup if database insert fails
- ✅ Comprehensive error handling

### Frontend (JavaScript)

**File:** `js/main.js`

Features:
- ✅ Real-time image preview (main image)
- ✅ Multiple image preview grid (additional images)
- ✅ Client-side file validation (size, type)
- ✅ Character counter for description field
- ✅ Submit button disable during upload
- ✅ Progress notifications
- ✅ Form reset on success
- ✅ Error message display

### Database Schema

**File:** `supabase/artworks-schema.sql`

Tables:
- ✅ `Artworks` - Complete schema with all fields from the form
- ✅ Indexes for performance (artist_id, status, SDG, dates)
- ✅ Row Level Security policies
- ✅ Auto-updating timestamps

---

## 🧪 Testing the System

### Test Case 1: Valid Submission

1. Go to `/artwork-submission.html`
2. Fill out all required fields:
   - Artist name and email
   - Artwork title and description
   - Select medium and year
   - Upload main image (JPG/PNG, under 10MB)
   - Select primary SDG
   - Explain SDG connection
   - Set reserve price
   - Select artwork type
   - Accept terms and conditions
3. Click "Submit Artwork for Review"
4. Should see: "Uploading artwork and images..."
5. Then: "Artwork submitted successfully! We will review it within 3-5 business days."

### Test Case 2: Missing Main Image

1. Fill out form without uploading main image
2. Click Submit
3. Should see: "Please select a main artwork image"

### Test Case 3: File Too Large

1. Try to upload image over 10MB
2. Should see: "Main image must be under 10MB"
3. File input should be cleared

### Test Case 4: Additional Images

1. Fill out form with main image
2. Upload 2-3 additional images
3. Should see grid preview of all additional images
4. Submit should upload all images

### Test Case 5: Database Verification

After successful submission:

```sql
-- Check Supabase Dashboard → Table Editor → Artworks
SELECT * FROM Artworks ORDER BY created_at DESC LIMIT 1;

-- Verify fields:
-- - title, description, artist info populated
-- - main_image_url has valid URL
-- - additional_images array (if uploaded)
-- - status = 'pending'
-- - timestamps set correctly
```

### Test Case 6: Storage Verification

```
Go to Supabase Dashboard → Storage → artworks bucket
- Should see uploaded images with timestamp_filename.jpg format
- Click on image to verify it opens correctly
```

---

## 🔍 Troubleshooting

### Error: "Server configuration error"

**Cause:** Environment variables not set

**Solution:**
```bash
# Check Netlify Dashboard → Site Settings → Environment Variables
# Ensure these are set:
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Error: "Failed to upload image"

**Cause:** Storage bucket not created or policies not set

**Solution:**
1. Verify bucket exists: Dashboard → Storage → artworks
2. Check bucket is public
3. Verify storage policies are set (see STORAGE_SETUP.md)

### Error: "Failed to save artwork submission"

**Cause:** Database table doesn't exist or RLS policy blocking insert

**Solution:**
1. Run the SQL schema: `supabase/artworks-schema.sql`
2. Check table exists: Dashboard → Table Editor → Artworks
3. Verify RLS policy: "Anyone can submit artworks" is enabled

### Error: "Payload too large"

**Cause:** Image file is too large

**Solution:**
- Client-side validation should catch this
- If it gets through, increase Netlify function size limit
- Or compress images before upload

### Function doesn't run locally

**Cause:** Netlify CLI not installed or not using `netlify dev`

**Solution:**
```bash
npm install -g netlify-cli
netlify dev  # Not npm run dev!
```

### Images uploaded but not displaying

**Cause:** Storage bucket not set to public

**Solution:**
- Dashboard → Storage → artworks → Settings
- Set "Public" to ON
- Check publicURL is working: paste in browser

---

## 🎯 Next Steps

After artwork submission is working, you can build:

1. **Admin Dashboard** - To approve/reject submissions
   - View pending artworks
   - Approve artwork (change status to 'approved')
   - Reject artwork with reason
   - Schedule for auction

2. **Artist Dashboard** - Let artists see their submissions
   - View all their artworks
   - Check approval status
   - Edit draft submissions
   - Track auction results

3. **Artworks Gallery Page** - Public view of approved artworks
   - Filter by SDG
   - Search by title/artist
   - Sort by date, price, etc.

4. **Email Notifications**
   - Send confirmation when artwork submitted
   - Notify artist when approved/rejected
   - Alert when artwork is scheduled for auction

---

## 📊 Database Schema Reference

### Artworks Table Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Auto | Primary key |
| artist_id | UUID | No | Foreign key to Artists table |
| artist_email | TEXT | Yes | Artist's email |
| artist_name | TEXT | Yes | Artist's name |
| title | TEXT | Yes | Artwork title |
| description | TEXT | Yes | Artwork description |
| medium | TEXT | Yes | Art medium (oil, digital, etc.) |
| year_created | INTEGER | Yes | Year artwork was created |
| dimensions | TEXT | No | Physical dimensions |
| edition | TEXT | No | Edition info (1/1, limited, etc.) |
| main_image_url | TEXT | Yes | Primary image URL |
| additional_images | TEXT[] | No | Array of additional image URLs |
| primary_sdg | INTEGER | Yes | 1-17 (UN SDG number) |
| secondary_sdgs | INTEGER[] | No | Array of additional SDGs |
| sdg_connection | TEXT | Yes | How artwork connects to SDG |
| reserve_price | NUMERIC | Yes | Minimum acceptable price |
| starting_bid | NUMERIC | No | Suggested starting bid |
| current_bid | NUMERIC | Default 0 | Current auction bid |
| artwork_type | TEXT | Yes | physical, digital, or both |
| shipping_info | TEXT | No | Shipping details |
| exhibition_history | TEXT | No | Past exhibitions |
| certificate_of_authenticity | TEXT | No | yes, will-provide, no |
| additional_notes | TEXT | No | Any other info |
| artist_bio | TEXT | No | Optional artist bio |
| phone | TEXT | No | Artist phone |
| status | TEXT | Default 'pending' | Workflow status |
| rejection_reason | TEXT | No | If rejected, why |
| auction_id | UUID | No | Link to auction (future) |
| auction_start | TIMESTAMP | No | When auction starts |
| auction_end | TIMESTAMP | No | When auction ends |
| created_at | TIMESTAMP | Auto | Submission time |
| updated_at | TIMESTAMP | Auto | Last update time |
| approved_at | TIMESTAMP | No | When approved |
| approved_by | UUID | No | Admin who approved |

### Status Workflow

```
pending → approved → active → sold/unsold
   ↓
rejected
```

- **pending**: Just submitted, awaiting admin review
- **approved**: Admin approved, ready to schedule for auction
- **rejected**: Admin rejected, won't be auctioned
- **active**: Currently in an active auction
- **sold**: Auction completed, artwork sold
- **unsold**: Auction completed, reserve not met

---

## 🔒 Security Considerations

1. **Service Role Key**
   - Only used in Netlify Functions (server-side)
   - Never exposed to client
   - Has full database access - handle with care

2. **File Upload Validation**
   - Client-side: File type and size checked
   - Server-side: Double-checked in Netlify function
   - Consider adding virus scanning for production

3. **Rate Limiting**
   - Consider adding rate limits to prevent abuse
   - Netlify has built-in function rate limits
   - Can add IP-based limits for extra protection

4. **Row Level Security**
   - Artists can only view their own submissions
   - Public can only view approved/active/sold artworks
   - Only service role can update/delete

5. **Input Sanitization**
   - Filenames are sanitized (special characters removed)
   - Form data validated on both client and server
   - SQL injection prevented by parameterized queries

---

## 📈 Monitoring & Analytics

### Track in Production:

1. **Submission Success Rate**
   ```sql
   SELECT
     COUNT(*) as total_submissions,
     COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
     COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
     COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
   FROM Artworks;
   ```

2. **Storage Usage**
   - Dashboard → Storage → Usage
   - Monitor to avoid exceeding free tier (1GB)

3. **Function Invocations**
   - Netlify Dashboard → Functions → submit-artwork
   - Monitor error rate and duration

4. **Popular SDGs**
   ```sql
   SELECT
     primary_sdg,
     COUNT(*) as artwork_count
   FROM Artworks
   GROUP BY primary_sdg
   ORDER BY artwork_count DESC;
   ```

---

## 🎉 Success Checklist

- [ ] Dependencies installed (`parse-multipart-data`)
- [ ] Database schema created (Artworks table exists)
- [ ] Storage bucket created and configured (artworks bucket)
- [ ] Environment variables set (Service Role Key)
- [ ] Local testing successful (form submits, images upload)
- [ ] Deployed to Netlify (production working)
- [ ] Verified in database (submissions appearing)
- [ ] Verified in storage (images uploading)
- [ ] Error handling tested (missing fields, large files)
- [ ] Ready for admin dashboard development

---

**Need help?** Check the troubleshooting section or refer to:
- `supabase/STORAGE_SETUP.md` - Detailed storage configuration
- `supabase/artworks-schema.sql` - Complete database schema
- Supabase Docs: https://supabase.com/docs/guides/storage
- Netlify Functions Docs: https://docs.netlify.com/functions/overview/
