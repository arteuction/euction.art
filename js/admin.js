/**
 * ART EUction - Admin Dashboard
 * Main admin dashboard logic and data loading
 */

import { config } from './config.js';

// Initialize Supabase client
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

// Load dashboard statistics
async function loadStats() {
  try {
    const client = await initSupabase();

    // Get pending submissions count
    const { count: pendingCount } = await client
      .from('Artworks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get active auctions count
    const now = new Date().toISOString();
    const { count: activeAuctions } = await client
      .from('Auctions')
      .select('*', { count: 'exact', head: true })
      .lte('start_date', now)
      .gte('end_date', now);

    // Get total artists count
    const { count: totalArtists } = await client
      .from('Artists')
      .select('*', { count: 'exact', head: true });

    // Update UI
    document.getElementById('pending-submissions').textContent = pendingCount || 0;
    document.getElementById('active-auctions').textContent = activeAuctions || 0;
    document.getElementById('total-artists').textContent = totalArtists || 0;

    // TODO: Calculate total revenue from completed auctions
    document.getElementById('total-revenue').textContent = '$0';

  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Load recent artwork submissions
async function loadRecentArtworks() {
  try {
    const client = await initSupabase();

    const { data: artworks, error } = await client
      .from('Artworks')
      .select('*')
      .order('submitted_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    const tbody = document.querySelector('#recent-artworks tbody');

    if (!artworks || artworks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">No artwork submissions yet</td></tr>';
      return;
    }

    const sdgNames = {
      1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health',
      4: 'Quality Education', 5: 'Gender Equality', 6: 'Clean Water',
      7: 'Clean Energy', 8: 'Decent Work', 9: 'Innovation',
      10: 'Reduced Inequalities', 11: 'Sustainable Cities', 12: 'Responsible Consumption',
      13: 'Climate Action', 14: 'Life Below Water', 15: 'Life on Land',
      16: 'Peace & Justice', 17: 'Partnerships'
    };

    tbody.innerHTML = artworks.map(artwork => `
      <tr>
        <td><strong>${artwork.title}</strong></td>
        <td>${artwork.artist_name}</td>
        <td>SDG ${artwork.primary_sdg}: ${sdgNames[artwork.primary_sdg]}</td>
        <td>${new Date(artwork.submitted_at).toLocaleDateString()}</td>
        <td><span class="status-badge ${artwork.status}">${artwork.status}</span></td>
        <td>
          <button class="action-btn" onclick="window.location.href='artworks.html'">View</button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error loading artworks:', error);
  }
}

// Load recent artist applications
async function loadRecentArtists() {
  try {
    const client = await initSupabase();

    const { data: artists, error } = await client
      .from('Artists')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    const tbody = document.querySelector('#recent-artists tbody');

    if (!artists || artists.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--gray-500);">No artist applications yet</td></tr>';
      return;
    }

    tbody.innerHTML = artists.map(artist => `
      <tr>
        <td><strong>${artist.name}</strong></td>
        <td>${artist.email}</td>
        <td>${new Date(artist.created_at).toLocaleDateString()}</td>
        <td><span class="status-badge ${artist.status}">${artist.status}</span></td>
        <td>
          <button class="action-btn" onclick="window.location.href='artists.html'">View</button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error loading artists:', error);
  }
}

// Initialize dashboard
async function init() {
  await loadStats();
  await loadRecentArtworks();
  await loadRecentArtists();
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
