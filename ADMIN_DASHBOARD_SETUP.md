# Admin Dashboard Setup Guide

## Overview

The Admin Dashboard allows authorized administrators to:
- ✅ View platform statistics and metrics
- ✅ Review pending artwork submissions
- ✅ Approve or reject artworks
- ✅ Manage artist applications
- ✅ Track SDG distribution
- ✅ Schedule artworks for auctions (future feature)

---

## 🚀 Quick Setup

### 1. Set Admin Users

You have two options to designate admin users:

#### **Option A: Edit the Admin Emails List (Quick)**

Edit `js/admin-auth.js`:

```javascript
const ADMIN_EMAILS = [
  'your-admin@email.com',
  'another-admin@email.com'
];
```

#### **Option B: Set User Metadata in Supabase (Recommended)**

1. Go to Supabase Dashboard → Authentication → Users
2. Find your user and click to edit
3. Scroll to "User Metadata"
4. Add this JSON:
```json
{
  "role": "admin"
}
```
5. Save

### 2. Access the Admin Dashboard

Navigate to: `https://your-site.netlify.app/admin/dashboard.html`

- If you're not logged in, you'll be redirected to login
- If you're logged in but not an admin, you'll see "Access Denied"
- If you're an admin, you'll see the dashboard

### 3. Required Environment Variables

Make sure these are set in Netlify:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The service role key is required for admin operations to bypass RLS policies.

---

## 📁 File Structure

```
admin/
├── dashboard.html       # Main admin dashboard with stats
├── artworks.html        # Manage artwork submissions
└── artists.html         # Manage artist applications

functions/
├── admin-artworks.js    # Backend for artwork operations
└── admin-artists.js     # Backend for artist operations

js/
├── admin-auth.js        # Authentication & authorization
├── admin-dashboard.js   # Dashboard page logic
├── admin-artworks.js    # Artworks management logic
└── admin-artists.js     # Artists management logic

css/
└── admin.css            # Admin panel styling
```

---

## 🎯 Features

### Dashboard Page (`/admin/dashboard.html`)

- **Statistics Cards:**
  - Pending Artworks (click to view)
  - Approved Artworks
  - Pending Artists
  - Total Artworks

- **Recent Activity:**
  - Last 10 artwork submissions
  - Quick view/approve actions

- **SDG Distribution:**
  - Visual grid showing artwork count per SDG
  - Helps identify popular sustainability goals

- **Quick Actions:**
  - Review Artworks
  - Approve Artists
  - Schedule Auctions
  - Preview Site

### Artworks Management (`/admin/artworks.html`)

- **Filtering:**
  - By status (pending, approved, rejected, active, sold)
  - By SDG (all 17 goals)
  - Search by title or artist name

- **Artwork Table:**
  - Thumbnail preview
  - Title, artist, SDG, price
  - Status badge
  - Submission date

- **Actions:**
  - View full details (modal)
  - Approve artwork
  - Reject with reason
  - Edit details (future)

- **Bulk Operations:** (future)
  - Select multiple artworks
  - Bulk approve/reject

### Artists Management (`/admin/artists.html`)

- **Filtering:**
  - By status (pending, approved, rejected)
  - Search by name or email

- **Artist Table:**
  - Name, email, SDG focus
  - Portfolio link
  - Status badge
  - Application date

- **Actions:**
  - View full profile
  - Approve artist
  - Reject application
  - View submitted artworks

---

## 🔑 Authentication & Authorization

### How It Works

1. **User logs in** via `/login.html`
2. **Admin auth module** checks if user is admin:
   - Checks if email is in `ADMIN_EMAILS` array
   - Checks if `user_metadata.role === 'admin'`
   - Checks if `app_metadata.role === 'admin'`
3. **If authorized:** Page loads normally
4. **If not authorized:** Shows "Access Denied" and redirects to login

### Security Features

- Admin pages are hidden from search engines (`noindex, nofollow`)
- All admin API calls use service role key (server-side only)
- Client-side checks prevent unauthorized UI access
- Backend validates permissions before operations

### Adding/Removing Admins

**To add an admin:**
- Option A: Add their email to `ADMIN_EMAILS` in `js/admin-auth.js`
- Option B: Set `user_metadata.role = "admin"` in Supabase Dashboard

**To remove an admin:**
- Remove their email from the list OR remove the role metadata

---

## 🧪 Testing

### Test Case 1: Admin Access

1. Set your email as admin (see Setup step 1)
2. Login to your account
3. Navigate to `/admin/dashboard.html`
4. Should see dashboard with stats

### Test Case 2: Non-Admin Access

1. Login with non-admin account
2. Try to access `/admin/dashboard.html`
3. Should see "Access Denied" message
4. Redirected to login after 2 seconds

### Test Case 3: Approve Artwork

1. As admin, go to `/admin/artworks.html`
2. Set filter to "Pending"
3. Click on an artwork to view details
4. Click "Approve"
5. Status changes to "Approved"
6. Artwork disappears from pending list

### Test Case 4: Reject Artwork

1. View pending artwork
2. Click "Reject"
3. Enter rejection reason (modal)
4. Confirm
5. Status changes to "Rejected"

### Test Case 5: Statistics

1. Dashboard should show:
   - Correct count of pending artworks
   - Correct count of approved artworks
   - Correct count of pending artists
2. SDG distribution should match database

---

## 📊 Backend API

### Admin Artworks API (`/functions/admin-artworks.js`)

**Actions:**

1. **List Artworks**
```javascript
fetch('/.netlify/functions/admin-artworks', {
  method: 'POST',
  body: JSON.stringify({
    action: 'list',
    status: 'pending',  // or 'all', 'approved', 'rejected'
    sdg: '13',          // optional
    search: 'ocean',    // optional
    limit: 50,
    offset: 0
  })
})
```

2. **Get Artwork**
```javascript
fetch('/.netlify/functions/admin-artworks', {
  method: 'POST',
  body: JSON.stringify({
    action: 'get',
    id: 'artwork-uuid'
  })
})
```

3. **Approve Artwork**
```javascript
fetch('/.netlify/functions/admin-artworks', {
  method: 'POST',
  body: JSON.stringify({
    action: 'approve',
    id: 'artwork-uuid',
    adminId: 'admin-user-uuid'  // optional
  })
})
```

4. **Reject Artwork**
```javascript
fetch('/.netlify/functions/admin-artworks', {
  method: 'POST',
  body: JSON.stringify({
    action: 'reject',
    id: 'artwork-uuid',
    reason: 'Does not meet quality standards'
  })
})
```

5. **Get Statistics**
```javascript
fetch('/.netlify/functions/admin-artworks', {
  method: 'POST',
  body: JSON.stringify({
    action: 'stats'
  })
})
```

### Admin Artists API (`/functions/admin-artists.js`)

Similar structure with actions: `list`, `get`, `approve`, `reject`, `stats`

---

## 🎨 Customization

### Changing Admin Panel Colors

Edit `css/admin.css`:

```css
/* Change header gradient */
.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change to your brand colors */
}

/* Change stat card icons */
.stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding Custom Actions

1. Add button to HTML table
2. Add function in `js/admin-artworks.js`
3. Add backend handler in `functions/admin-artworks.js`
4. Update API documentation

Example - Add "Feature" action:

```javascript
// In admin-artworks.js
async function featureArtwork(id) {
  const response = await fetch('/.netlify/functions/admin-artworks', {
    method: 'POST',
    body: JSON.stringify({
      action: 'feature',
      id
    })
  });
  // Handle response
}

// In functions/admin-artworks.js
async function featureArtwork(supabase, params) {
  const { id } = params;

  const { data, error } = await supabase
    .from('Artworks')
    .update({ is_featured: true })
    .eq('id', id)
    .select()
    .single();

  // Return response
}
```

---

## 🔮 Future Enhancements

### Phase 1 (Immediate)
- ✅ Complete JavaScript modules for artwork/artist management
- ✅ Add modal for viewing full artwork details
- ✅ Add rejection reason input
- ✅ Implement search and filtering

### Phase 2 (Short-term)
- ⏳ Email notifications when artwork approved/rejected
- ⏳ Bulk operations (approve multiple at once)
- ⏳ Auction scheduling from admin panel
- ⏳ Image moderation tools
- ⏳ Admin activity log

### Phase 3 (Medium-term)
- ⏳ NGO management page
- ⏳ User management (ban, promote to artist, etc.)
- ⏳ Analytics dashboard with charts
- ⏳ Export data (CSV, PDF reports)
- ⏳ Revenue and commission tracking

### Phase 4 (Long-term)
- ⏳ Multi-admin roles (super admin, moderator, curator)
- ⏳ Granular permissions system
- ⏳ API keys for external integrations
- ⏳ Automated quality scoring
- ⏳ AI-powered artwork categorization

---

## 🐛 Troubleshooting

### "Access Denied" even though I'm admin

**Cause:** Email not in admin list or metadata not set

**Solution:**
1. Check `js/admin-auth.js` - is your email in `ADMIN_EMAILS`?
2. Check Supabase Dashboard → Authentication → Your User → User Metadata
3. Make sure `role: "admin"` is set
4. Clear browser cache and re-login

### Admin functions returning 500 error

**Cause:** Service role key not set or incorrect

**Solution:**
1. Check Netlify → Site Settings → Environment Variables
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
3. Get correct key from Supabase Dashboard → Settings → API
4. Redeploy site after updating env vars

### Artworks not loading

**Cause:** Database table doesn't exist or RLS blocking

**Solution:**
1. Run `supabase/artworks-schema.sql` in Supabase Dashboard
2. Check table exists: Dashboard → Table Editor → Artworks
3. Verify RLS policies allow service role access

### Stats showing 0 even with data

**Cause:** Query filtering out data or wrong table name

**Solution:**
1. Check browser console for errors
2. Verify table name is "Artworks" (capital A)
3. Check Netlify function logs for errors

---

## 📈 Monitoring

### Track These Metrics:

1. **Admin Activity:**
   - Number of artworks approved per day
   - Average time from submission to approval
   - Rejection rate and common reasons

2. **Platform Health:**
   - Pending queue size (should stay manageable)
   - Approval turnaround time
   - Artist approval rate

3. **Content Quality:**
   - Percentage of submissions that pass review
   - Most popular SDGs
   - Average reserve price by SDG

### Query Examples:

```sql
-- Average approval time
SELECT AVG(approved_at - created_at) as avg_approval_time
FROM Artworks
WHERE status = 'approved';

-- Submissions per day (last 30 days)
SELECT DATE(created_at) as date, COUNT(*) as submissions
FROM Artworks
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Rejection reasons
SELECT rejection_reason, COUNT(*) as count
FROM Artworks
WHERE status = 'rejected'
GROUP BY rejection_reason
ORDER BY count DESC;
```

---

## ✅ Setup Checklist

- [ ] Set admin users (email list or Supabase metadata)
- [ ] Verify environment variables in Netlify
- [ ] Database schema is up to date (Artworks table)
- [ ] Test admin login works
- [ ] Dashboard loads with stats
- [ ] Can view artworks list
- [ ] Can approve artwork (test with dummy data)
- [ ] Can reject artwork (test with dummy data)
- [ ] Can view artists list
- [ ] Can approve artist
- [ ] SDG distribution displays correctly
- [ ] Modal windows work
- [ ] Mobile responsive (test on phone)

---

**Ready to manage your platform!** 🎉

For help, refer to:
- `functions/admin-artworks.js` - Backend API code
- `js/admin-auth.js` - Authentication logic
- `css/admin.css` - Styling customization
