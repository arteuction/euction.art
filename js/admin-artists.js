/**
 * Admin Artists Management Page
 * Handles artist list, filtering, and approval/rejection
 */

import { initAdminPage, getAdminInfo, adminLogout } from './admin-auth.js';
import { initNavigation } from './navigation.js';
import { showNotification } from './utils.js';

let currentFilters = {
  status: 'pending',
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
  await loadArtists();
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
  const params = new URLSearchParams(window.location.search);
  if (params.get('status')) {
    currentFilters.status = params.get('status');
    document.getElementById('filter-status').value = currentFilters.status;
  }

  document.getElementById('btn-apply-filters')?.addEventListener('click', async () => {
    currentFilters.status = document.getElementById('filter-status').value;
    currentFilters.search = document.getElementById('filter-search').value;
    await loadArtists();
  });
}

async function loadArtists() {
  const loading = document.getElementById('loading-artists');
  const table = document.getElementById('artists-table');
  const noArtists = document.getElementById('no-artists');
  const tbody = document.getElementById('artists-table-body');

  loading.style.display = 'block';
  table.style.display = 'none';
  noArtists.style.display = 'none';

  try {
    const response = await fetch('/.netlify/functions/admin-artists', {
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

    if (result.success && result.artists.length > 0) {
      table.style.display = 'table';
      tbody.innerHTML = '';

      document.getElementById('artists-count').textContent = `${result.count} artist${result.count !== 1 ? 's' : ''}`;

      result.artists.forEach(artist => {
        tbody.appendChild(createArtistRow(artist));
      });
    } else {
      noArtists.style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading artists:', error);
    loading.style.display = 'none';
    showNotification('Failed to load artists', 'error');
  }
}

function createArtistRow(artist) {
  const row = document.createElement('tr');

  // Name
  const nameTd = document.createElement('td');
  nameTd.textContent = artist.name;

  // Email
  const emailTd = document.createElement('td');
  emailTd.textContent = artist.email;

  // SDG Focus
  const sdgTd = document.createElement('td');
  if (artist.sdg_tags && artist.sdg_tags.length > 0) {
    sdgTd.textContent = artist.sdg_tags.slice(0, 3).join(', ');
  } else {
    sdgTd.textContent = '-';
  }

  // Portfolio
  const portfolioTd = document.createElement('td');
  if (artist.portfolio_url) {
    const link = document.createElement('a');
    link.href = artist.portfolio_url;
    link.textContent = 'View';
    link.target = '_blank';
    link.style.color = 'var(--accent-purple)';
    portfolioTd.appendChild(link);
  } else {
    portfolioTd.textContent = '-';
  }

  // Status
  const statusTd = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = `status-badge ${artist.status}`;
  badge.textContent = artist.status;
  statusTd.appendChild(badge);

  // Date
  const dateTd = document.createElement('td');
  dateTd.textContent = new Date(artist.created_at).toLocaleDateString();

  // Actions
  const actionsTd = document.createElement('td');
  actionsTd.className = 'action-buttons';

  if (artist.status === 'pending') {
    const approveBtn = document.createElement('button');
    approveBtn.className = 'btn-action btn-approve';
    approveBtn.textContent = '✓ Approve';
    approveBtn.onclick = () => approveArtist(artist.id);

    const rejectBtn = document.createElement('button');
    rejectBtn.className = 'btn-action btn-reject';
    rejectBtn.textContent = '✗ Reject';
    rejectBtn.onclick = () => rejectArtist(artist.id);

    actionsTd.appendChild(approveBtn);
    actionsTd.appendChild(rejectBtn);
  } else {
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn-action btn-view';
    viewBtn.textContent = 'View';
    viewBtn.onclick = () => viewArtist(artist.id);
    actionsTd.appendChild(viewBtn);
  }

  row.appendChild(nameTd);
  row.appendChild(emailTd);
  row.appendChild(sdgTd);
  row.appendChild(portfolioTd);
  row.appendChild(statusTd);
  row.appendChild(dateTd);
  row.appendChild(actionsTd);

  return row;
}

async function approveArtist(id) {
  if (!confirm('Approve this artist?')) return;

  try {
    const response = await fetch('/.netlify/functions/admin-artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        id
      })
    });

    const result = await response.json();

    if (result.success) {
      showNotification('Artist approved successfully!', 'success');
      await loadArtists();
    } else {
      showNotification(result.error || 'Failed to approve artist', 'error');
    }
  } catch (error) {
    console.error('Error approving artist:', error);
    showNotification('Failed to approve artist', 'error');
  }
}

async function rejectArtist(id) {
  if (!confirm('Reject this artist application?')) return;

  try {
    const response = await fetch('/.netlify/functions/admin-artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reject',
        id
      })
    });

    const result = await response.json();

    if (result.success) {
      showNotification('Artist application rejected', 'success');
      await loadArtists();
    } else {
      showNotification(result.error || 'Failed to reject artist', 'error');
    }
  } catch (error) {
    console.error('Error rejecting artist:', error);
    showNotification('Failed to reject artist', 'error');
  }
}

function viewArtist(id) {
  // TODO: Implement modal view
  showNotification('View modal coming soon', 'info');
}
