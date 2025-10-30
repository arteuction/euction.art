/**
 * ART EUction - Main Application Entry Point
 * Initializes all modules and handles page-specific logic
 */

import { initNavigation, setupAnnouncementBar } from './navigation.js';
import { initAnimations } from './animations.js';
import { PLATFORM_STATS, formatCurrency } from './data.js';
import { showNotification } from './utils.js';
import { initAuthUI } from './auth.js';

/**
 * Initialize application
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core modules
  initNavigation();
  initAnimations();
  setupAnnouncementBar();
  initAuthUI();

  // Page-specific initialization
  initPageSpecific();

  // Setup global event listeners
  setupGlobalEvents();

  // Load cached preferences
  loadUserPreferences();
});

/**
 * Initialize page-specific functionality
 */
function initPageSpecific() {
  const path = window.location.pathname;

  if (path.includes('index.html') || path.endsWith('/')) {
    initHomePage();
  } else if (path.includes('about.html')) {
    initAboutPage();
  } else if (path.includes('team.html')) {
    initTeamPage();
  } else if (path.includes('events.html')) {
    initEventsPage();
  } else if (path.includes('partners.html')) {
    initPartnersPage();
  } else if (path.includes('sia.html')) {
    initSIAPage();
  } else if (path.includes('sdg/sdg-')) {
    initSDGPage();
  } else if (path.includes('artist-signup.html')) {
    initArtistSignupForm();
  } else if (path.includes('artwork-submission.html')) {
    initArtworkSubmissionForm();
  }
}

/**
 * Initialize homepage
 */
function initHomePage() {
  // Update stats counters
  updateStatsCounters();

  // Setup featured artworks carousel (if implemented)
  // setupArtworkCarousel();
}

/**
 * Initialize about page
 */
function initAboutPage() {
  // Any about page specific functionality
  console.log('About page initialized');
}

/**
 * Initialize team page
 */
function initTeamPage() {
  // Team page specific functionality
  console.log('Team page initialized');
}

/**
 * Initialize events page
 */
function initEventsPage() {
  // Events page specific functionality
  setupEventFilters();
}

/**
 * Initialize partners page
 */
function initPartnersPage() {
  // Partners page specific functionality
  console.log('Partners page initialized');
}

/**
 * Initialize SIA dashboard
 */
function initSIAPage() {
  // SIA dashboard specific functionality
  updateSIADashboard();
}

/**
 * Initialize SDG page
 */
function initSDGPage() {
  // Extract SDG number from URL
  const match = window.location.pathname.match(/sdg-(\d+)\.html/);
  if (match) {
    const sdgNumber = parseInt(match[1]);
    loadSDGContent(sdgNumber);
  }
}

/**
 * Update stats counters on homepage
 */
function updateStatsCounters() {
  const statsElements = {
    artworks: document.getElementById('stat-artworks'),
    artists: document.getElementById('stat-artists'),
    ngos: document.getElementById('stat-ngos'),
    funds: document.getElementById('stat-funds')
  };

  if (statsElements.artworks) {
    statsElements.artworks.dataset.counter = PLATFORM_STATS.totalArtworks;
  }
  if (statsElements.artists) {
    statsElements.artists.dataset.counter = PLATFORM_STATS.totalArtists;
  }
  if (statsElements.ngos) {
    statsElements.ngos.dataset.counter = PLATFORM_STATS.totalNGOs;
  }
  if (statsElements.funds) {
    statsElements.funds.textContent = formatCurrency(PLATFORM_STATS.fundsRaised);
  }
}

/**
 * Load SDG-specific content
 */
function loadSDGContent(sdgNumber) {
  // This would typically fetch data from an API
  // For now, we'll use mock data
  console.log(`Loading content for SDG ${sdgNumber}`);

  // Update page with SDG-specific artworks, NGOs, etc.
  // displaySDGArtworks(sdgNumber);
  // displaySDGNGOs(sdgNumber);
}

/**
 * Setup event filters
 */
function setupEventFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Filter events
      filterEvents(filter);
    });
  });
}

/**
 * Filter events by category
 */
function filterEvents(filter) {
  const eventCards = document.querySelectorAll('.event-card');

  eventCards.forEach(card => {
    if (filter === 'all' || card.dataset.category === filter) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Update SIA dashboard
 */
function updateSIADashboard() {
  // Mock data for SIA dashboard
  const siaData = {
    totalImpact: 85000,
    activeProjects: 12,
    beneficiaries: 5400,
    sdgsCovered: 15
  };

  // Update dashboard elements
  const elements = {
    impact: document.getElementById('sia-impact'),
    projects: document.getElementById('sia-projects'),
    beneficiaries: document.getElementById('sia-beneficiaries'),
    sdgs: document.getElementById('sia-sdgs')
  };

  if (elements.impact) elements.impact.textContent = formatCurrency(siaData.totalImpact);
  if (elements.projects) elements.projects.textContent = siaData.activeProjects;
  if (elements.beneficiaries) elements.beneficiaries.textContent = siaData.beneficiaries.toLocaleString();
  if (elements.sdgs) elements.sdgs.textContent = siaData.sdgsCovered;
}

/**
 * Initialize artist signup form
 */
function initArtistSignupForm() {
  const form = document.getElementById('artist-signup-form');
  if (!form) return;

  form.addEventListener('submit', handleArtistSignup);
}

/**
 * Handle artist signup form submission
 */
async function handleArtistSignup(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  console.log('Artist signup data:', data);

  // TODO: Integrate with Supabase
  // For now, show success message
  showNotification('Artist signup successful! We will review your application.', 'success');

  // Reset form
  e.target.reset();
}

/**
 * Initialize artwork submission form
 */
function initArtworkSubmissionForm() {
  const form = document.getElementById('artwork-submission-form');
  if (!form) return;

  form.addEventListener('submit', handleArtworkSubmission);

  // Setup file preview
  const fileInput = document.getElementById('artwork-image');
  if (fileInput) {
    fileInput.addEventListener('change', previewArtworkImage);
  }
}

/**
 * Handle artwork submission form
 */
async function handleArtworkSubmission(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  console.log('Artwork submission data:', data);

  // TODO: Integrate with Supabase
  // For now, show success message
  showNotification('Artwork submitted successfully! We will review it shortly.', 'success');

  // Reset form
  e.target.reset();

  // Clear image preview
  const preview = document.getElementById('image-preview');
  if (preview) preview.innerHTML = '';
}

/**
 * Preview artwork image
 */
function previewArtworkImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const preview = document.getElementById('image-preview');
  if (!preview) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    preview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-width: 100%; border-radius: 0.5rem;">`;
  };
  reader.readAsDataURL(file);
}

/**
 * Setup global event listeners
 */
function setupGlobalEvents() {
  // Handle back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.style.display = 'flex';
      } else {
        backToTop.style.display = 'none';
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Handle external links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/**
 * Load user preferences from localStorage
 */
function loadUserPreferences() {
  // Load any saved preferences
  const preferences = localStorage.getItem('userPreferences');
  if (preferences) {
    try {
      const prefs = JSON.parse(preferences);
      applyPreferences(prefs);
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  }
}

/**
 * Apply user preferences
 */
function applyPreferences(prefs) {
  // Apply preferences (e.g., theme, language, etc.)
  if (prefs.theme) {
    document.body.dataset.theme = prefs.theme;
  }
}

/**
 * Save user preferences
 */
export function saveUserPreferences(prefs) {
  try {
    const current = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const updated = { ...current, ...prefs };
    localStorage.setItem('userPreferences', JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving preferences:', e);
  }
}

// Export for use in other modules
export { initPageSpecific, updateStatsCounters };
