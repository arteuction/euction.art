# Supabase Storage Setup for ART EUction

## Overview
This guide will help you set up Supabase Storage for handling artwork image uploads.

## Step-by-Step Setup

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `niwonrhyekgllofdwzoi`
3. Navigate to **Storage** in the left sidebar
4. Click **"New Bucket"**

### 2. Configure the Bucket

Create a bucket with these settings:

```
Bucket Name: artworks
Public: Yes (so images can be displayed publicly)
File Size Limit: 10 MB (per file)
Allowed MIME types: image/jpeg, image/png, image/webp, image/tiff
```

### 3. Set Up Storage Policies

After creating the bucket, set up Row Level Security policies:

Go to **Storage** → **Policies** → **artworks bucket**

#### Policy 1: Public Read Access
```sql
-- Allow anyone to view/download images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'artworks');
```

#### Policy 2: Authenticated Upload
```sql
-- Allow anyone to upload (we'll validate on backend)
CREATE POLICY "Anyone can upload artworks"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artworks');
```

#### Policy 3: Owner Can Delete (Optional)
```sql
-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'artworks' AND auth.uid() = owner);
```

### 4. Get Storage URL

Your storage URL will be:
```
https://niwonrhyekgllofdwzoi.supabase.co/storage/v1/object/public/artworks/
```

### 5. Environment Variables

Add to your Netlify environment variables:

```bash
SUPABASE_URL=https://niwonrhyekgllofdwzoi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

**Important:** Get your Service Role Key from:
- Supabase Dashboard → Settings → API → Service Role Key
- This key has elevated permissions and should ONLY be used in Netlify Functions (server-side)
- NEVER expose this key in client-side code!

### 6. Install the Database Schema

Run the SQL schema to create the Artworks table:

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/artworks-schema.sql`
3. Paste and click **"Run"**

### 7. Verify Setup

Test that everything works:

1. Go to Storage → artworks bucket
2. Try uploading a test image manually
3. Copy the public URL and verify you can access it in a browser
4. Delete the test image

### 8. File Naming Convention

Images will be stored with this naming pattern:
```
{timestamp}_{sanitized-filename}
Example: 1699123456789_sunset-painting.jpg
```

This prevents filename conflicts and maintains organization.

### 9. Image Optimization (Optional but Recommended)

Supabase Storage supports image transformations via URL parameters:

```
Original:
https://.../artworks/image.jpg

Thumbnail (300px width):
https://.../artworks/image.jpg?width=300

Optimized quality:
https://.../artworks/image.jpg?quality=80
```

### 10. Storage Limits (Free Tier)

- **Storage:** 1 GB
- **Bandwidth:** 2 GB/month
- **File size limit:** 50 MB (we set ours to 10 MB)

If you exceed these, consider:
- Upgrading to Supabase Pro ($25/month)
- Or using Cloudinary for images

## Testing

After setup, test with:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Run functions locally
netlify dev

# Test the submit-artwork function
curl -X POST http://localhost:8888/.netlify/functions/submit-artwork \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Artwork","artist_email":"test@example.com",...}'
```

## Troubleshooting

### Error: "new row violates row-level security policy"
- Check that RLS policies are correctly set up
- Verify you're using the service role key in Netlify Functions

### Error: "storage/object-not-found"
- Verify bucket name is exactly "artworks"
- Check that the file was actually uploaded
- Verify bucket is set to public

### Error: "Payload too large"
- Client-side: Check file is under 10 MB
- Server-side: Increase Netlify function size limit if needed

## Next Steps

1. ✅ Create the bucket
2. ✅ Set up policies
3. ✅ Add service role key to Netlify
4. ✅ Run the SQL schema
5. ✅ Test the submit-artwork function
6. ✅ Deploy to production

## Security Notes

- Service Role Key should ONLY be in Netlify environment variables
- Never commit the service role key to git
- File uploads are validated server-side (file type, size)
- Consider adding virus scanning for production
- Implement rate limiting to prevent abuse
