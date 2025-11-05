/**
 * ART EUction - Admin Artworks Management
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

const sdgNames = {
  1: 'No Poverty', 2: 'Zero Hunger', 3: 'Good Health',
  4: 'Quality Education', 5: 'Gender Equality', 6: 'Clean Water',
  7: 'Clean Energy', 8: 'Decent Work', 9: 'Innovation',
  10: 'Reduced Inequalities', 11: 'Sustainable Cities', 12: 'Responsible Consumption',
  13: 'Climate Action', 14: 'Life Below Water', 15: 'Life on Land',
  16: 'Peace & Justice', 17: 'Partnerships'
};

// Load artworks based on filter
async function loadArtworks(status = 'all') {
  try {
    const client = await initSupabase();
    let query = client.from('Artworks').select('*').order('submitted_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: artworks, error } = await query;
    if (error) throw error;

    const grid = document.getElementById('artworks-grid');

    if (!artworks || artworks.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-500);">No artworks found</div>';
      return;
    }

    grid.innerHTML = artworks.map(artwork => `
      <div class="artwork-card">
        <img
          src="${artwork.main_image_url || 'https://via.placeholder.com/300x200?text=No+Image'}"
          alt="${artwork.title}"
          class="artwork-image"
          onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
        >
        <div class="artwork-details">
          <h3 class="artwork-title">${artwork.title}</h3>
          <p class="artwork-artist">by ${artwork.artist_name}</p>
          <p class="artwork-meta">
            <strong>Medium:</strong> ${artwork.medium}<br>
            <strong>SDG:</strong> ${artwork.primary_sdg} - ${sdgNames[artwork.primary_sdg]}<br>
            <strong>Reserve:</strong> $${artwork.reserve_price?.toLocaleString()}
          </p>
          <span class="status-badge ${artwork.status}">${artwork.status}</span>
          <div class="artwork-actions">
            <button class="action-btn view" onclick="viewArtwork(${artwork.id})">View Details</button>
            ${artwork.status === 'pending' ? `
              <button class="action-btn approve" onclick="updateArtworkStatus(${artwork.id}, 'approved')">✓ Approve</button>
              <button class="action-btn reject" onclick="updateArtworkStatus(${artwork.id}, 'rejected')">✗ Reject</button>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error loading artworks:', error);
    showNotification('Error loading artworks: ' + error.message, 'error');
  }
}

// Update artwork status
window.updateArtworkStatus = async function(artworkId, newStatus) {
  if (!confirm(`Are you sure you want to ${newStatus} this artwork?`)) return;

  try {
    const client = await initSupabase();
    const { error } = await client
      .from('Artworks')
      .update({ status: newStatus, reviewed_at: new Date().toISOString() })
      .eq('id', artworkId);

    if (error) throw error;

    showNotification(`Artwork ${newStatus} successfully!`, 'success');
    loadArtworks(currentFilter);

    // TODO: Send email notification to artist
  } catch (error) {
    console.error('Error updating artwork:', error);
    showNotification('Error updating artwork: ' + error.message, 'error');
  }
};

// View artwork details
window.viewArtwork = async function(artworkId) {
  try {
    const client = await initSupabase();
    const { data: artwork, error } = await client
      .from('Artworks')
      .select('*')
      .eq('id', artworkId)
      .single();

    if (error) throw error;

    const modal = document.getElementById('artwork-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
      <img src="${artwork.main_image_url}" alt="${artwork.title}" class="modal-image">

      <h2>${artwork.title}</h2>
      <p><strong>Artist:</strong> ${artwork.artist_name} (${artwork.artist_email})</p>

      <div style="margin: 1.5rem 0;">
        <h3>Description</h3>
        <p>${artwork.description}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
        <div><strong>Medium:</strong> ${artwork.medium}</div>
        <div><strong>Year:</strong> ${artwork.year_created}</div>
        <div><strong>Dimensions:</strong> ${artwork.dimensions || 'N/A'}</div>
        <div><strong>Edition:</strong> ${artwork.edition || 'N/A'}</div>
        <div><strong>Type:</strong> ${artwork.artwork_type}</div>
        <div><strong>Reserve Price:</strong> $${artwork.reserve_price?.toLocaleString()}</div>
      </div>

      <div style="margin: 1.5rem 0;">
        <h3>SDG Alignment</h3>
        <p><strong>Primary SDG:</strong> ${artwork.primary_sdg} - ${sdgNames[artwork.primary_sdg]}</p>
        <p><strong>Connection:</strong> ${artwork.sdg_connection}</p>
        ${artwork.secondary_sdgs?.length ? `<p><strong>Secondary SDGs:</strong> ${artwork.secondary_sdgs.join(', ')}</p>` : ''}
      </div>

      ${artwork.shipping_info ? `
        <div style="margin: 1.5rem 0;">
          <h3>Shipping Info</h3>
          <p>${artwork.shipping_info}</p>
        </div>
      ` : ''}

      ${artwork.exhibition_history ? `
        <div style="margin: 1.5rem 0;">
          <h3>Exhibition History</h3>
          <p>${artwork.exhibition_history}</p>
        </div>
      ` : ''}

      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--gray-200);">
        <strong>Status:</strong> <span class="status-badge ${artwork.status}">${artwork.status}</span>
        <br><small>Submitted: ${new Date(artwork.submitted_at).toLocaleString()}</small>
      </div>

      ${artwork.status === 'pending' ? `
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="updateArtworkStatus(${artwork.id}, 'approved'); closeModal();">Approve Artwork</button>
          <button class="btn btn-secondary" style="flex: 1; background: var(--error-red);" onclick="updateArtworkStatus(${artwork.id}, 'rejected'); closeModal();">Reject Artwork</button>
        </div>
      ` : ''}
    `;

    modal.classList.add('active');
  } catch (error) {
    console.error('Error viewing artwork:', error);
    showNotification('Error loading artwork details: ' + error.message, 'error');
  }
};

// Close modal
window.closeModal = function() {
  document.getElementById('artwork-modal').classList.remove('active');
};

// Setup filter buttons
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.status;
      loadArtworks(currentFilter);
    });
  });
}

// Initialize
async function init() {
  setupFilters();
  await loadArtworks('all');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
