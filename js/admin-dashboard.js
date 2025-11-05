/**
 * Admin Dashboard - Main Entry Point
 * Loads and displays dashboard statistics and recent activity
 */

import { initAdminPage, getAdminInfo, adminLogout } from './admin-auth.js';
import { initNavigation } from './navigation.js';
import { showNotification } from './utils.js';

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  // Check admin authentication
  const isAuthorized = await initAdminPage();
  if (!isAuthorized) return;

  // Initialize navigation
  initNavigation();

  // Load admin user info
  await loadAdminInfo();

  // Setup logout button
  setupLogout();

  // Load dashboard data
  await loadDashboardStats();
  await loadRecentArtworks();
  await loadSDGDistribution();
});

/**
 * Load admin user info
 */
async function loadAdminInfo() {
  const info = await getAdminInfo();
  if (info) {
    const nameElement = document.getElementById('admin-user-name');
    if (nameElement) {
      nameElement.textContent = info.name;
    }
  }
}

/**
 * Setup logout button
 */
function setupLogout() {
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', adminLogout);
  }
}

/**
 * Load dashboard statistics
 */
async function loadDashboardStats() {
  try {
    // Fetch artwork stats
    const artworkResponse = await fetch('/.netlify/functions/admin-artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stats' })
    });

    const artworkResult = await artworkResponse.json();

    if (artworkResult.success) {
      const stats = artworkResult.stats;

      // Update stat cards
      updateStatCard('stat-pending-artworks', stats.pending || 0);
      updateStatCard('stat-approved-artworks', stats.approved || 0);
      updateStatCard('stat-total-artworks', stats.total || 0);
    }

    // Fetch artist stats
    const artistResponse = await fetch('/.netlify/functions/admin-artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stats' })
    });

    const artistResult = await artistResponse.json();

    if (artistResult.success) {
      const stats = artistResult.stats;
      updateStatCard('stat-pending-artists', stats.pending || 0);
    }

  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    showNotification('Failed to load dashboard statistics', 'error');
  }
}

/**
 * Update stat card value
 */
function updateStatCard(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value.toLocaleString();
  }
}

/**
 * Load recent artwork submissions
 */
async function loadRecentArtworks() {
  const loadingElement = document.getElementById('loading-recent');
  const tableElement = document.getElementById('recent-artworks-table');
  const noRecentElement = document.getElementById('no-recent');
  const tbody = document.getElementById('recent-artworks-body');

  try {
    const response = await fetch('/.netlify/functions/admin-artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'list',
        limit: 10,
        offset: 0
      })
    });

    const result = await response.json();

    loadingElement.style.display = 'none';

    if (result.success && result.artworks.length > 0) {
      tableElement.style.display = 'table';
      tbody.innerHTML = '';

      result.artworks.forEach(artwork => {
        const row = createArtworkRow(artwork);
        tbody.appendChild(row);
      });
    } else {
      noRecentElement.style.display = 'block';
    }

  } catch (error) {
    console.error('Error loading recent artworks:', error);
    loadingElement.style.display = 'none';
    noRecentElement.style.display = 'block';
  }
}

/**
 * Create artwork table row
 */
function createArtworkRow(artwork) {
  const row = document.createElement('tr');

  const previewCell = document.createElement('td');
  const img = document.createElement('img');
  img.src = artwork.main_image_url;
  img.alt = artwork.title;
  img.className = 'artwork-preview';
  previewCell.appendChild(img);

  const titleCell = document.createElement('td');
  titleCell.textContent = artwork.title;

  const artistCell = document.createElement('td');
  artistCell.textContent = artwork.artist_name;

  const sdgCell = document.createElement('td');
  sdgCell.textContent = `SDG ${artwork.primary_sdg}`;

  const statusCell = document.createElement('td');
  const statusBadge = document.createElement('span');
  statusBadge.className = `status-badge ${artwork.status}`;
  statusBadge.textContent = artwork.status;
  statusCell.appendChild(statusBadge);

  const dateCell = document.createElement('td');
  const date = new Date(artwork.created_at);
  dateCell.textContent = date.toLocaleDateString();

  const actionsCell = document.createElement('td');
  actionsCell.className = 'action-buttons';

  const viewLink = document.createElement('a');
  viewLink.href = `/admin/artworks.html?id=${artwork.id}`;
  viewLink.className = 'btn-action btn-view';
  viewLink.textContent = 'View';

  actionsCell.appendChild(viewLink);

  row.appendChild(previewCell);
  row.appendChild(titleCell);
  row.appendChild(artistCell);
  row.appendChild(sdgCell);
  row.appendChild(statusCell);
  row.appendChild(dateCell);
  row.appendChild(actionsCell);

  return row;
}

/**
 * Load SDG distribution
 */
async function loadSDGDistribution() {
  const loadingElement = document.getElementById('loading-sdg');
  const distributionElement = document.getElementById('sdg-distribution');

  try {
    const response = await fetch('/.netlify/functions/admin-artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stats' })
    });

    const result = await response.json();

    loadingElement.style.display = 'none';

    if (result.success && result.sdgDistribution) {
      distributionElement.style.display = 'grid';
      distributionElement.innerHTML = '';

      for (let i = 1; i <= 17; i++) {
        const count = result.sdgDistribution[i] || 0;
        const sdgCard = createSDGCard(i, count);
        distributionElement.appendChild(sdgCard);
      }
    }

  } catch (error) {
    console.error('Error loading SDG distribution:', error);
    loadingElement.style.display = 'none';
  }
}

/**
 * Create SDG card
 */
function createSDGCard(sdgNumber, count) {
  const card = document.createElement('div');
  card.className = 'sdg-stat';

  const numberDiv = document.createElement('div');
  numberDiv.className = 'sdg-number';
  numberDiv.textContent = `SDG ${sdgNumber}`;

  const countDiv = document.createElement('div');
  countDiv.className = 'sdg-count';
  countDiv.textContent = count;

  const labelDiv = document.createElement('div');
  labelDiv.className = 'sdg-label';
  labelDiv.textContent = count === 1 ? 'artwork' : 'artworks';

  card.appendChild(numberDiv);
  card.appendChild(countDiv);
  card.appendChild(labelDiv);

  return card;
}
