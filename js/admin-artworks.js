/**
 * Admin Artworks Management Page
 * Handles artwork list, filtering, and approval/rejection
 */

import { initAdminPage, getAdminInfo, adminLogout } from './admin-auth.js';
import { initNavigation } from './navigation.js';
import { showNotification } from './utils.js';

let currentFilters = {
  status: 'pending',
  sdg: 'all',
  search: ''
};

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  const isAuthorized = await initAdminPage();
  if (!isAuthorized) return;

  initNavigation();
  await loadAdminInfo();
  setupLogout();
  setupFilters();
  await loadArtworks();
});

async function loadAdminInfo() {
  const info = await getAdminInfo();
  if (info) {
    document.getElementById('admin-user-name').textContent = info.name;
  }
}

function setupLogout() {
  document.getElementById('admin-logout-btn')?.addEventListener('click', adminLogout);
}

function setupFilters() {
  // Get URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('status')) {
    currentFilters.status = params.get('status');
    document.getElementById('filter-status').value = currentFilters.status;
  }

  // Apply filters button
  document.getElementById('btn-apply-filters')?.addEventListener('click', async () => {
    currentFilters.status = document.getElementById('filter-status').value;
    currentFilters.sdg = document.getElementById('filter-sdg').value;
    currentFilters.search = document.getElementById('filter-search').value;
    await loadArtworks();
  });
}

async function loadArtworks() {
  const loading = document.getElementById('loading-artworks');
  const table = document.getElementById('artworks-table');
  const noArtworks = document.getElementById('no-artworks');
  const tbody = document.getElementById('artworks-table-body');

  loading.style.display = 'block';
  table.style.display = 'none';
  noArtworks.style.display = 'none';

  try {
    const response = await fetch('/.netlify/functions/admin-artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'list',
        ...currentFilters,
        limit: 100
      })
    });

    const result = await response.json();
    loading.style.display = 'none';

    if (result.success && result.artworks.length > 0) {
      table.style.display = 'table';
      tbody.innerHTML = '';

      document.getElementById('artworks-count').textContent = `${result.count} artwork${result.count !== 1 ? 's' : ''}`;

      result.artworks.forEach(artwork => {
        tbody.appendChild(createArtworkRow(artwork));
      });
    } else {
      noArtworks.style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading artworks:', error);
    loading.style.display = 'none';
    showNotification('Failed to load artworks', 'error');
  }
}

function createArtworkRow(artwork) {
  const row = document.createElement('tr');

  // Preview
  const previewTd = document.createElement('td');
  const img = document.createElement('img');
  img.src = artwork.main_image_url;
  img.alt = artwork.title;
  img.className = 'artwork-preview';
  previewTd.appendChild(img);

  // Title
  const titleTd = document.createElement('td');
  titleTd.textContent = artwork.title;

  // Artist
  const artistTd = document.createElement('td');
  artistTd.textContent = artwork.artist_name;

  // SDG
  const sdgTd = document.createElement('td');
  sdgTd.textContent = `SDG ${artwork.primary_sdg}`;

  // Price
  const priceTd = document.createElement('td');
  priceTd.textContent = `$${artwork.reserve_price.toLocaleString()}`;

  // Status
  const statusTd = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = `status-badge ${artwork.status}`;
  badge.textContent = artwork.status;
  statusTd.appendChild(badge);

  // Date
  const dateTd = document.createElement('td');
  dateTd.textContent = new Date(artwork.created_at).toLocaleDateString();

  // Actions
  const actionsTd = document.createElement('td');
  actionsTd.className = 'action-buttons';

  if (artwork.status === 'pending') {
    const approveBtn = document.createElement('button');
    approveBtn.className = 'btn-action btn-approve';
    approveBtn.textContent = '✓ Approve';
    approveBtn.onclick = () => approveArtwork(artwork.id);

    const rejectBtn = document.createElement('button');
    rejectBtn.className = 'btn-action btn-reject';
    rejectBtn.textContent = '✗ Reject';
    rejectBtn.onclick = () => rejectArtwork(artwork.id);

    actionsTd.appendChild(approveBtn);
    actionsTd.appendChild(rejectBtn);
  } else {
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn-action btn-view';
    viewBtn.textContent = 'View';
    viewBtn.onclick = () => viewArtwork(artwork.id);
    actionsTd.appendChild(viewBtn);
  }

  row.appendChild(previewTd);
  row.appendChild(titleTd);
  row.appendChild(artistTd);
  row.appendChild(sdgTd);
  row.appendChild(priceTd);
  row.appendChild(statusTd);
  row.appendChild(dateTd);
  row.appendChild(actionsTd);

  return row;
}

async function approveArtwork(id) {
  if (!confirm('Approve this artwork?')) return;

  try {
    const response = await fetch('/.netlify/functions/admin-artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        id
      })
    });

    const result = await response.json();

    if (result.success) {
      showNotification('Artwork approved successfully!', 'success');
      await loadArtworks();
    } else {
      showNotification(result.error || 'Failed to approve artwork', 'error');
    }
  } catch (error) {
    console.error('Error approving artwork:', error);
    showNotification('Failed to approve artwork', 'error');
  }
}

async function rejectArtwork(id) {
  const reason = prompt('Rejection reason (optional):');
  if (reason === null) return; // User cancelled

  try {
    const response = await fetch('/.netlify/functions/admin-artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reject',
        id,
        reason
      })
    });

    const result = await response.json();

    if (result.success) {
      showNotification('Artwork rejected', 'success');
      await loadArtworks();
    } else {
      showNotification(result.error || 'Failed to reject artwork', 'error');
    }
  } catch (error) {
    console.error('Error rejecting artwork:', error);
    showNotification('Failed to reject artwork', 'error');
  }
}

function viewArtwork(id) {
  // TODO: Implement modal view
  showNotification('View modal coming soon', 'info');
}
