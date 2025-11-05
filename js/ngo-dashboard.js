/**
 * NGO Dashboard
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

async function loadDashboard() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = 'login.html?redirect=ngo-dashboard.html';
      return;
    }

    const client = await initSupabase();

    // Get NGO info
    const { data: ngo } = await client
      .from('NGOs')
      .select('*')
      .eq('email', user.email)
      .single();

    if (!ngo) {
      window.location.href = 'ngo-registration.html';
      return;
    }

    document.getElementById('ngo-name').textContent = ngo.name;

    // Get auctions benefiting this NGO
    const { data: auctions } = await client
      .from('Auctions')
      .select('*, Artworks(*)')
      .eq('ngo_id', ngo.id)
      .order('end_date', { ascending: false });

    // Calculate stats
    const completedAuctions = auctions?.filter(a => new Date(a.end_date) < new Date()) || [];
    const totalDonations = completedAuctions.reduce((sum, a) => sum + (a.current_bid || 0) * 0.75, 0);
    const pendingPayouts = completedAuctions.filter(a => a.payout_status !== 'paid').reduce((sum, a) => sum + (a.current_bid || 0) * 0.75, 0);

    document.getElementById('total-donations').textContent = `$${totalDonations.toLocaleString()}`;
    document.getElementById('auction-count').textContent = completedAuctions.length;
    document.getElementById('pending-payouts').textContent = `$${pendingPayouts.toLocaleString()}`;
    document.getElementById('artworks-count').textContent = auctions?.length || 0;

    // Display donations table
    displayDonations(completedAuctions);

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

function displayDonations(auctions) {
  const tbody = document.querySelector('#donations-table tbody');

  if (!auctions || auctions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--gray-500);">No donations yet</td></tr>';
    return;
  }

  tbody.innerHTML = auctions.map(auction => {
    const ngoShare = (auction.current_bid || 0) * 0.75;
    const status = auction.payout_status === 'paid' ? 'Paid' : 'Pending';

    return `
      <tr>
        <td>${new Date(auction.end_date).toLocaleDateString()}</td>
        <td><strong>${auction.Artworks?.title || 'Unknown'}</strong></td>
        <td>$${auction.current_bid?.toLocaleString()}</td>
        <td style="color: var(--success-green); font-weight: 600;">$${ngoShare.toLocaleString()}</td>
        <td><span class="status-badge ${status.toLowerCase()}">${status}</span></td>
      </tr>
    `;
  }).join('');
}

async function init() {
  await loadDashboard();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
