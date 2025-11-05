/**
 * ART EUction - Main Application Entry Point
 * Initializes all modules and handles page-specific logic
 */

import { initNavigation, setupAnnouncementBar } from './navigation.js';
import { initAnimations } from './animations.js';
import { formatCurrency } from './data.js';
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
 * Stats will be loaded from Supabase in the future
 */
function updateStatsCounters() {
  // TODO: Fetch real stats from Supabase
  console.log('Stats counters will be updated when Supabase integration is complete');
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

  // Setup file preview for main image
  const mainImageInput = document.getElementById('main-image');
  if (mainImageInput) {
    mainImageInput.addEventListener('change', (e) => previewMainImage(e));
  }

  // Setup file preview for additional images
  const additionalImagesInput = document.getElementById('additional-images');
  if (additionalImagesInput) {
    additionalImagesInput.addEventListener('change', (e) => previewAdditionalImages(e));
  }

  // Add character counter for description
  const descriptionField = document.getElementById('description');
  if (descriptionField) {
    descriptionField.addEventListener('input', updateCharacterCount);
  }
}

/**
 * Handle artwork submission form
 */
async function handleArtworkSubmission(e) {
  e.preventDefault();

  // Disable submit button to prevent double submission
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  try {
    // Validate files
    const mainImageInput = document.getElementById('main-image');
    const mainImageFile = mainImageInput?.files?.[0];

    if (!mainImageFile) {
      showNotification('Please select a main artwork image', 'error');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (mainImageFile.size > maxSize) {
      showNotification('Main image must be under 10MB', 'error');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff'];
    if (!allowedTypes.includes(mainImageFile.type)) {
      showNotification('Invalid image format. Please use JPG, PNG, WEBP, or TIFF', 'error');
      return;
    }

    // Validate additional images if present
    const additionalImagesInput = document.getElementById('additional-images');
    const additionalFiles = additionalImagesInput?.files || [];

    for (let i = 0; i < additionalFiles.length; i++) {
      if (additionalFiles[i].size > maxSize) {
        showNotification(`Additional image ${i + 1} must be under 10MB`, 'error');
        return;
      }
      if (!allowedTypes.includes(additionalFiles[i].type)) {
        showNotification(`Additional image ${i + 1} has invalid format`, 'error');
        return;
      }
    }

    // Create FormData object with all form fields
    const formData = new FormData(e.target);

    // Show uploading notification
    showNotification('Uploading artwork and images...', 'info');

    // Submit to Netlify function
    const response = await fetch('/.netlify/functions/submit-artwork', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showNotification(
        result.message || 'Artwork submitted successfully! We will review it within 3-5 business days.',
        'success'
      );

      // Reset form
      e.target.reset();

      // Clear image previews
      clearImagePreviews();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showNotification(
        result.error || 'Failed to submit artwork. Please try again.',
        'error'
      );
    }
  } catch (error) {
    console.error('Error submitting artwork:', error);
    showNotification(
      'An error occurred while submitting your artwork. Please try again.',
      'error'
    );
  } finally {
    // Re-enable submit button
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}

/**
 * Preview main artwork image
 */
function previewMainImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file size
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showNotification('Image must be under 10MB', 'error');
    e.target.value = '';
    return;
  }

  // Create preview container if it doesn't exist
  let previewContainer = document.getElementById('main-image-preview');
  if (!previewContainer) {
    previewContainer = document.createElement('div');
    previewContainer.id = 'main-image-preview';
    previewContainer.style.marginTop = '1rem';
    e.target.parentElement.appendChild(previewContainer);
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    previewContainer.innerHTML = `
      <div style="border: 2px solid var(--gray-300); border-radius: 0.5rem; padding: 1rem; background: var(--gray-50);">
        <img src="${event.target.result}" alt="Preview" style="max-width: 100%; max-height: 400px; border-radius: 0.5rem; margin-bottom: 0.5rem;">
        <p style="margin: 0; font-size: 0.875rem; color: var(--gray-800);">
          <strong>${file.name}</strong> (${fileSize} MB)
        </p>
      </div>
    `;
  };
  reader.readAsDataURL(file);
}

/**
 * Preview additional artwork images
 */
function previewAdditionalImages(e) {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  // Create preview container if it doesn't exist
  let previewContainer = document.getElementById('additional-images-preview');
  if (!previewContainer) {
    previewContainer = document.createElement('div');
    previewContainer.id = 'additional-images-preview';
    previewContainer.style.marginTop = '1rem';
    e.target.parentElement.appendChild(previewContainer);
  }

  previewContainer.innerHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;"></div>';
  const grid = previewContainer.querySelector('div');

  files.forEach((file, index) => {
    // Validate file size
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showNotification(`Image ${index + 1} is over 10MB and will be skipped`, 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      const fileSize = (file.size / 1024 / 1024).toFixed(2);
      const previewItem = document.createElement('div');
      previewItem.style.cssText = 'border: 2px solid var(--gray-300); border-radius: 0.5rem; padding: 0.5rem; background: var(--gray-50);';
      previewItem.innerHTML = `
        <img src="${event.target.result}" alt="Preview ${index + 1}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 0.5rem;">
        <p style="margin: 0; font-size: 0.75rem; color: var(--gray-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${file.name} (${fileSize} MB)
        </p>
      `;
      grid.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Clear all image previews
 */
function clearImagePreviews() {
  const mainPreview = document.getElementById('main-image-preview');
  if (mainPreview) mainPreview.remove();

  const additionalPreview = document.getElementById('additional-images-preview');
  if (additionalPreview) additionalPreview.remove();
}

/**
 * Update character count for description field
 */
function updateCharacterCount(e) {
  const maxLength = 500;
  const currentLength = e.target.value.length;

  let counter = e.target.parentElement.querySelector('.character-counter');
  if (!counter) {
    counter = document.createElement('p');
    counter.className = 'character-counter';
    counter.style.cssText = 'font-size: 0.875rem; color: var(--gray-500); margin-top: 0.5rem;';
    e.target.parentElement.appendChild(counter);
  }

  counter.textContent = `${currentLength} / ${maxLength} characters`;

  if (currentLength > maxLength) {
    counter.style.color = 'var(--error-red)';
  } else {
    counter.style.color = 'var(--gray-500)';
  }
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
