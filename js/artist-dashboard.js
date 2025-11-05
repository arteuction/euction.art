/**
 * ART EUction - Artist Dashboard
 */

import { config } from './config.js';
import { getCurrentUser } from './auth.js';

let supabase = null;

async function initSupabase() {
  if (supabase) return supabase;
  if (!window.supabase) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    document.head.appendChild(script);
    await new Promise((resolve) => { script.onload = resolve; });
  }
  supabase = window.supabase.createClient(config.supabase.url, config.supabase.anonKey);
  return supabase;
}

const sdgNames = {
  1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health',
  4: 'Quality Education', 5: 'Gender Equality', 6: 'Clean Water',
  7: 'Clean Energy', 8: 'Decent Work', 9: 'Innovation',
  10: 'Reduced Inequalities', 11: 'Sustainable Cities', 12: 'Responsible Consumption',
  13: 'Climate Action', 14: 'Life Below Water', 15: 'Life on Land',
  16: 'Peace & Justice', 17: 'Partnerships'
};

// Load artist profile and submissions
async function loadDashboard() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      window.location.href = 'login.html?redirect=artist-dashboard.html';
      return;
    }

    // Get artist info
    const client = await initSupabase();
    const { data: artist } = await client
      .from('Artists')
      .select('*')
      .eq('email', user.email)
      .single();

    if (artist) {
      document.getElementById('artist-name').textContent = artist.name;
    }

    // Get artwork submissions
    const { data: artworks, error } = await client
      .from('Artworks')
      .select('*')
      .eq('artist_email', user.email)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    // Calculate stats
    const totalSubmissions = artworks?.length || 0;
    const approvedCount = artworks?.filter(a => a.status === 'approved').length || 0;
    const pendingCount = artworks?.filter(a => a.status === 'pending').length || 0;

    document.getElementById('total-submissions').textContent = totalSubmissions;
    document.getElementById('approved-count').textContent = approvedCount;
    document.getElementById('pending-count').textContent = pendingCount;

    // Display submissions
    displaySubmissions(artworks);

    // Load auction history
    await loadAuctionHistory(user.email);

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Display artwork submissions
function displaySubmissions(artworks) {
  const grid = document.getElementById('submissions-grid');

  if (!artworks || artworks.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="icon">🎨</div>
        <p>You haven't submitted any artworks yet</p>
        <a href="artwork-submission.html" class="btn btn-primary" style="margin-top: 1rem;">Submit Your First Artwork</a>
      </div>
    `;
    return;
  }

  grid.innerHTML = artworks.map(artwork => `
    <div class="submission-card">
      <img
        src="${artwork.main_image_url || 'https://via.placeholder.com/280x180?text=No+Image'}"
        alt="${artwork.title}"
        class="submission-image"
        onerror="this.src='https://via.placeholder.com/280x180?text=No+Image'"
      >
      <div class="submission-details">
        <h3 class="submission-title">${artwork.title}</h3>
        <p class="submission-meta">
          <strong>Medium:</strong> ${artwork.medium}<br>
          <strong>SDG:</strong> ${artwork.primary_sdg} - ${sdgNames[artwork.primary_sdg]}<br>
          <strong>Submitted:</strong> ${new Date(artwork.submitted_at).toLocaleDateString()}
        </p>
        <span class="status-badge ${artwork.status}">${artwork.status}</span>
        ${artwork.status === 'pending' ? `
          <p style="font-size: 0.75rem; color: var(--gray-500); margin-top: 0.5rem;">
            Under review - you'll be notified soon!
          </p>
        ` : ''}
        ${artwork.status === 'approved' ? `
          <p style="font-size: 0.75rem; color: var(--success-green); margin-top: 0.5rem;">
            ✓ Approved and ready for auction!
          </p>
        ` : ''}
        ${artwork.status === 'rejected' ? `
          <p style="font-size: 0.75rem; color: var(--error-red); margin-top: 0.5rem;">
            Unfortunately not accepted this time
          </p>
        ` : ''}
      </div>
    </div>
  `).join('');
}

// Load auction history
async function loadAuctionHistory(artistEmail) {
  try {
    const client = await initSupabase();

    const { data: auctions, error } = await client
      .from('Auctions')
      .select('*, Artworks!inner(*)')
      .eq('Artworks.artist_email', artistEmail)
      .lt('end_date', new Date().toISOString())
      .order('end_date', { ascending: false });

    if (error) throw error;

    const historyDiv = document.getElementById('auction-history');

    if (!auctions || auctions.length === 0) {
      historyDiv.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 2rem;">No completed auctions yet</p>';
      return;
    }

    historyDiv.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid var(--gray-200);">
            <th style="text-align: left; padding: 0.75rem;">Artwork</th>
            <th style="text-align: left; padding: 0.75rem;">End Date</th>
            <th style="text-align: left; padding: 0.75rem;">Final Bid</th>
            <th style="text-align: left; padding: 0.75rem;">Your Earnings</th>
          </tr>
        </thead>
        <tbody>
          ${auctions.map(auction => {
            const artistEarnings = (auction.current_bid || 0) * 0.20; // 20% to artist
            return `
              <tr style="border-bottom: 1px solid var(--gray-100);">
                <td style="padding: 0.75rem;"><strong>${auction.Artworks.title}</strong></td>
                <td style="padding: 0.75rem;">${new Date(auction.end_date).toLocaleDateString()}</td>
                <td style="padding: 0.75rem;">$${auction.current_bid?.toLocaleString()}</td>
                <td style="padding: 0.75rem; color: var(--success-green); font-weight: 600;">$${artistEarnings.toLocaleString()}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // Update total earnings
    const totalEarnings = auctions.reduce((sum, auction) => {
      return sum + ((auction.current_bid || 0) * 0.20);
    }, 0);
    document.getElementById('total-earnings').textContent = `$${totalEarnings.toLocaleString()}`;

  } catch (error) {
    console.error('Error loading auction history:', error);
  }
}

// Initialize dashboard
async function init() {
  await loadDashboard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
