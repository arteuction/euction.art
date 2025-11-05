/**
 * ART EUction - Admin Auctions Management
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

// Load auctions based on filter
async function loadAuctions(status = 'all') {
  try {
    const client = await initSupabase();
    let query = client.from('Auctions').select('*, Artworks(title, artist_name)').order('created_at', { ascending: false });

    const now = new Date().toISOString();

    if (status === 'upcoming') {
      query = query.gt('start_date', now);
    } else if (status === 'active') {
      query = query.lte('start_date', now).gte('end_date', now);
    } else if (status === 'ended') {
      query = query.lt('end_date', now);
    }

    const { data: auctions, error } = await query;
    if (error) throw error;

    const tbody = document.querySelector('#auctions-table tbody');

    if (!auctions || auctions.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--gray-500);">No auctions found</td></tr>';
      return;
    }

    tbody.innerHTML = auctions.map(auction => {
      const now = new Date();
      const startDate = new Date(auction.start_date);
      const endDate = new Date(auction.end_date);

      let auctionStatus = 'upcoming';
      if (startDate <= now && endDate >= now) {
        auctionStatus = 'active';
      } else if (endDate < now) {
        auctionStatus = 'ended';
      }

      return `
        <tr>
          <td><strong>${auction.Artworks?.title || 'Unknown'}</strong></td>
          <td>${auction.Artworks?.artist_name || 'Unknown'}</td>
          <td>${startDate.toLocaleString()}</td>
          <td>${endDate.toLocaleString()}</td>
          <td>$${auction.current_bid?.toLocaleString() || auction.starting_bid?.toLocaleString()}</td>
          <td>${auction.bid_count || 0}</td>
          <td><span class="status-badge ${auctionStatus}">${auctionStatus}</span></td>
          <td>
            <button class="action-btn edit" onclick="editAuction(${auction.id})">Edit</button>
            ${auctionStatus === 'active' ? `
              <button class="action-btn end" onclick="endAuction(${auction.id})">End Now</button>
            ` : ''}
          </td>
        </tr>
      `;
    }).join('');

  } catch (error) {
    console.error('Error loading auctions:', error);
    showNotification('Error loading auctions: ' + error.message, 'error');
  }
}

// Load approved artworks for dropdown
async function loadApprovedArtworks() {
  try {
    const client = await initSupabase();
    const { data: artworks, error } = await client
      .from('Artworks')
      .select('id, title, artist_name')
      .eq('status', 'approved')
      .is('auction_id', null); // Only artworks not yet auctioned

    if (error) throw error;

    const select = document.getElementById('artwork-select');
    if (!artworks || artworks.length === 0) {
      select.innerHTML = '<option value="">No approved artworks available</option>';
      return;
    }

    select.innerHTML = '<option value="">Select an artwork</option>' +
      artworks.map(artwork => `
        <option value="${artwork.id}">${artwork.title} by ${artwork.artist_name}</option>
      `).join('');

  } catch (error) {
    console.error('Error loading artworks:', error);
  }
}

// Load verified NGOs for dropdown
async function loadVerifiedNGOs() {
  try {
    const client = await initSupabase();
    const { data: ngos, error } = await client
      .from('NGOs')
      .select('id, name')
      .eq('status', 'verified');

    if (error) throw error;

    const select = document.getElementById('ngo-select');
    if (!ngos || ngos.length === 0) {
      select.innerHTML = '<option value="">No verified NGOs available</option>';
      return;
    }

    select.innerHTML = '<option value="">Select an NGO</option>' +
      ngos.map(ngo => `
        <option value="${ngo.id}">${ngo.name}</option>
      `).join('');

  } catch (error) {
    console.error('Error loading NGOs:', error);
  }
}

// Open create auction modal
window.openCreateAuctionModal = function() {
  const modal = document.getElementById('auction-modal');
  document.getElementById('modal-title').textContent = 'Create New Auction';
  document.getElementById('auction-form').reset();
  loadApprovedArtworks();
  loadVerifiedNGOs();
  modal.classList.add('active');
};

// Close modal
window.closeModal = function() {
  document.getElementById('auction-modal').classList.remove('active');
};

// Create auction
document.getElementById('auction-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  try {
    const client = await initSupabase();

    const formData = new FormData(e.target);
    const auctionData = {
      artwork_id: parseInt(document.getElementById('artwork-select').value),
      ngo_id: parseInt(document.getElementById('ngo-select').value),
      starting_bid: parseFloat(document.getElementById('starting-bid').value),
      current_bid: parseFloat(document.getElementById('starting-bid').value),
      start_date: document.getElementById('start-date').value,
      end_date: document.getElementById('end-date').value,
      featured: document.getElementById('featured').checked,
      bid_count: 0,
      status: 'upcoming'
    };

    const { error } = await client.from('Auctions').insert([auctionData]);

    if (error) throw error;

    showNotification('Auction created successfully!', 'success');
    closeModal();
    loadAuctions(currentFilter);

    // TODO: Schedule email notifications

  } catch (error) {
    console.error('Error creating auction:', error);
    showNotification('Error creating auction: ' + error.message, 'error');
  }
});

// End auction early
window.endAuction = async function(auctionId) {
  if (!confirm('Are you sure you want to end this auction now?')) return;

  try {
    const client = await initSupabase();
    const { error } = await client
      .from('Auctions')
      .update({ end_date: new Date().toISOString(), status: 'ended' })
      .eq('id', auctionId);

    if (error) throw error;

    showNotification('Auction ended successfully!', 'success');
    loadAuctions(currentFilter);

    // TODO: Notify winner and process payment

  } catch (error) {
    console.error('Error ending auction:', error);
    showNotification('Error ending auction: ' + error.message, 'error');
  }
};

// Setup filter buttons
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.status;
      loadAuctions(currentFilter);
    });
  });
}

// Initialize
async function init() {
  setupFilters();
  await loadAuctions('all');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
