/**
 * ART EUction - Admin Artists Management
 */

import { config } from './config.js';
import { showNotification } from './utils.js';

let supabase = null;
let currentFilter = 'all';

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

// Load artists based on filter
async function loadArtists(status = 'all') {
  try {
    const client = await initSupabase();
    let query = client.from('Artists').select('*').order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: artists, error } = await query;
    if (error) throw error;

    const tbody = document.querySelector('#artists-table tbody');

    if (!artists || artists.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--gray-500);">No artists found</td></tr>';
      return;
    }

    tbody.innerHTML = artists.map(artist => `
      <tr>
        <td>
          <strong>${artist.name}</strong>
          ${artist.artist_name ? `<br><small style="color: var(--gray-500);">Also known as: ${artist.artist_name}</small>` : ''}
        </td>
        <td>${artist.email}</td>
        <td>${artist.location || 'N/A'}</td>
        <td>${new Date(artist.created_at).toLocaleDateString()}</td>
        <td><span class="status-badge ${artist.status}">${artist.status}</span></td>
        <td>
          <button class="action-btn view" onclick="viewArtist(${artist.id})">View</button>
          ${artist.status === 'pending' ? `
            <button class="action-btn approve" onclick="updateArtistStatus(${artist.id}, 'approved')">Approve</button>
            <button class="action-btn reject" onclick="updateArtistStatus(${artist.id}, 'rejected')">Reject</button>
          ` : ''}
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Error loading artists:', error);
    showNotification('Error loading artists: ' + error.message, 'error');
  }
}

// Update artist status
window.updateArtistStatus = async function(artistId, newStatus) {
  if (!confirm(`Are you sure you want to ${newStatus} this artist?`)) return;

  try {
    const client = await initSupabase();
    const { error } = await client
      .from('Artists')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', artistId);

    if (error) throw error;

    showNotification(`Artist ${newStatus} successfully!`, 'success');
    loadArtists(currentFilter);

    // TODO: Send email notification to artist
  } catch (error) {
    console.error('Error updating artist:', error);
    showNotification('Error updating artist: ' + error.message, 'error');
  }
};

// View artist details
window.viewArtist = async function(artistId) {
  try {
    const client = await initSupabase();
    const { data: artist, error } = await client
      .from('Artists')
      .select('*')
      .eq('id', artistId)
      .single();

    if (error) throw error;

    const modal = document.getElementById('artist-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 0.5rem;">${artist.name}</h3>
        ${artist.artist_name ? `<p style="color: var(--gray-800); margin: 0;">Also known as: <strong>${artist.artist_name}</strong></p>` : ''}
      </div>

      <div style="margin-bottom: 1rem;">
        <strong>Email:</strong> <a href="mailto:${artist.email}">${artist.email}</a>
      </div>

      ${artist.location ? `<div style="margin-bottom: 1rem;"><strong>Location:</strong> ${artist.location}</div>` : ''}
      ${artist.art_category ? `<div style="margin-bottom: 1rem;"><strong>Art Category:</strong> ${artist.art_category}</div>` : ''}

      <div style="margin-bottom: 1rem;">
        <strong>Bio:</strong>
        <p style="margin-top: 0.5rem; color: var(--gray-800);">${artist.bio || 'No bio provided'}</p>
      </div>

      ${artist.portfolio_url ? `<div style="margin-bottom: 1rem;"><strong>Portfolio:</strong> <a href="${artist.portfolio_url}" target="_blank">${artist.portfolio_url}</a></div>` : ''}

      <div style="margin-bottom: 1rem;">
        <strong>SDG Focus:</strong> ${artist.sdg_tags ? artist.sdg_tags.join(', ') : 'Not specified'}
      </div>

      ${artist.facebook_url || artist.instagram_url || artist.youtube_url ? `
        <div style="margin-bottom: 1rem;">
          <strong>Social Media:</strong><br>
          ${artist.facebook_url ? `<a href="${artist.facebook_url}" target="_blank" style="margin-right: 1rem;">Facebook</a>` : ''}
          ${artist.instagram_url ? `<a href="${artist.instagram_url}" target="_blank" style="margin-right: 1rem;">Instagram</a>` : ''}
          ${artist.youtube_url ? `<a href="${artist.youtube_url}" target="_blank">YouTube</a>` : ''}
        </div>
      ` : ''}

      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--gray-200);">
        <strong>Status:</strong> <span class="status-badge ${artist.status}">${artist.status}</span>
      </div>

      ${artist.status === 'pending' ? `
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="updateArtistStatus(${artist.id}, 'approved'); closeModal();">Approve Artist</button>
          <button class="btn btn-secondary" style="flex: 1; background: var(--error-red);" onclick="updateArtistStatus(${artist.id}, 'rejected'); closeModal();">Reject Artist</button>
        </div>
      ` : ''}
    `;

    modal.classList.add('active');
  } catch (error) {
    console.error('Error viewing artist:', error);
    showNotification('Error loading artist details: ' + error.message, 'error');
  }
};

// Close modal
window.closeModal = function() {
  document.getElementById('artist-modal').classList.remove('active');
};

// Setup filter buttons
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.status;
      loadArtists(currentFilter);
    });
  });
}

// Initialize
async function init() {
  setupFilters();
  await loadArtists('all');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
