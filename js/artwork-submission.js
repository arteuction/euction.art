/**
 * ART EUction - Artwork Submission Form Handler
 * Handles artwork submission with image uploads to Supabase Storage
 */

import { config } from './config.js';
import { showNotification } from './utils.js';

// Initialize Supabase client
let supabase = null;

async function initSupabase() {
  if (supabase) return supabase;

  if (!window.supabase) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    document.head.appendChild(script);

    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
    });
  }

  supabase = window.supabase.createClient(config.supabase.url, config.supabase.anonKey);
  return supabase;
}

// Upload image to Supabase Storage
async function uploadImage(file, folder = 'artworks') {
  try {
    const client = await initSupabase();

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${sanitizedFilename}`;
    const filePath = `${folder}/${filename}`;

    // Upload file to Supabase Storage
    const { data, error } = await client.storage
      .from('artwork-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = client.storage
      .from('artwork-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image: ' + error.message);
  }
}

// Show loading state
function setLoading(isLoading) {
  const form = document.getElementById('artwork-submission-form');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span style="display: inline-block; margin-right: 0.5rem;">⏳</span> Uploading...';
    form.style.opacity = '0.6';
    form.style.pointerEvents = 'none';
  } else {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Artwork for Review';
    form.style.opacity = '1';
    form.style.pointerEvents = 'auto';
  }
}

// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  try {
    setLoading(true);

    const form = event.target;
    const formData = new FormData(form);

    // Get main image file
    const mainImageFile = document.getElementById('main-image').files[0];
    if (!mainImageFile) {
      throw new Error('Please select a main artwork image');
    }

    // Validate file size (max 10MB)
    if (mainImageFile.size > 10 * 1024 * 1024) {
      throw new Error('Main image file size must be less than 10MB');
    }

    // Upload main image
    showNotification('Uploading main image...', 'info');
    const mainImageUrl = await uploadImage(mainImageFile, 'artworks/main');

    // Upload additional images if any
    const additionalImagesFiles = document.getElementById('additional-images').files;
    const additionalImageUrls = [];

    if (additionalImagesFiles.length > 0) {
      showNotification(`Uploading ${additionalImagesFiles.length} additional images...`, 'info');

      for (let i = 0; i < Math.min(additionalImagesFiles.length, 4); i++) {
        const file = additionalImagesFiles[i];

        // Validate file size
        if (file.size > 10 * 1024 * 1024) {
          console.warn(`Skipping file ${file.name} - exceeds 10MB`);
          continue;
        }

        const url = await uploadImage(file, 'artworks/additional');
        additionalImageUrls.push(url);
      }
    }

    // Get secondary SDGs
    const secondarySDGs = [];
    const secondarySDGCheckboxes = form.querySelectorAll('input[name="secondary-sdg"]:checked');
    secondarySDGCheckboxes.forEach(checkbox => {
      secondarySDGs.push(parseInt(checkbox.value));
    });

    // Prepare artwork data
    const artworkData = {
      artist_name: formData.get('artist-name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      artist_bio: formData.get('artist-bio'),
      artwork_title: formData.get('artwork-title'),
      description: formData.get('description'),
      medium: formData.get('medium'),
      year_created: formData.get('year-created'),
      dimensions: formData.get('dimensions'),
      edition: formData.get('edition'),
      primary_sdg: formData.get('primary-sdg'),
      secondary_sdgs: secondarySDGs,
      sdg_connection: formData.get('sdg-connection'),
      reserve_price: formData.get('reserve-price'),
      starting_bid: formData.get('starting-bid'),
      artwork_type: formData.get('artwork-type'),
      shipping_info: formData.get('shipping-info'),
      exhibition_history: formData.get('exhibition-history'),
      certificate: formData.get('certificate'),
      additional_notes: formData.get('additional-notes'),
      main_image_url: mainImageUrl,
      additional_image_urls: additionalImageUrls
    };

    // Submit to backend
    showNotification('Submitting artwork...', 'info');
    const response = await fetch('/.netlify/functions/submit-artwork', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(artworkData)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to submit artwork');
    }

    // Success!
    showNotification('✓ Artwork submitted successfully! Our team will review it within 3-5 business days.', 'success');

    // Reset form
    form.reset();

    // Redirect to success page or artist dashboard after 2 seconds
    setTimeout(() => {
      window.location.href = 'artist-dashboard.html';
    }, 2000);

  } catch (error) {
    console.error('Submission error:', error);
    showNotification('Error: ' + error.message, 'error');
  } finally {
    setLoading(false);
  }
}

// Character counter for description
function setupCharacterCounter() {
  const descriptionTextarea = document.getElementById('description');
  const counterElement = descriptionTextarea.parentElement.querySelector('p');

  if (descriptionTextarea && counterElement) {
    descriptionTextarea.addEventListener('input', () => {
      const length = descriptionTextarea.value.length;
      counterElement.textContent = `${length} / 500 characters`;

      if (length > 500) {
        counterElement.style.color = 'var(--error-red)';
      } else {
        counterElement.style.color = 'var(--gray-500)';
      }
    });
  }
}

// File input preview
function setupFilePreview() {
  const mainImageInput = document.getElementById('main-image');
  const additionalImagesInput = document.getElementById('additional-images');

  if (mainImageInput) {
    mainImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showNotification('Please select an image file', 'error');
          mainImageInput.value = '';
          return;
        }

        // Show file name
        const container = mainImageInput.closest('div');
        const fileName = container.querySelector('.file-name') || document.createElement('p');
        fileName.className = 'file-name';
        fileName.textContent = `Selected: ${file.name}`;
        fileName.style.marginTop = '0.5rem';
        fileName.style.fontWeight = 'bold';
        fileName.style.color = 'var(--accent-cyan)';

        if (!container.querySelector('.file-name')) {
          container.appendChild(fileName);
        }
      }
    });
  }

  if (additionalImagesInput) {
    additionalImagesInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        const container = additionalImagesInput.closest('div');
        const fileList = container.querySelector('.file-list') || document.createElement('p');
        fileList.className = 'file-list';
        fileList.textContent = `Selected: ${files.length} file(s)`;
        fileList.style.marginTop = '0.5rem';
        fileList.style.fontWeight = 'bold';
        fileList.style.color = 'var(--accent-cyan)';

        if (!container.querySelector('.file-list')) {
          container.appendChild(fileList);
        }
      }
    });
  }
}

// Initialize form handler
function init() {
  const form = document.getElementById('artwork-submission-form');

  if (form) {
    form.addEventListener('submit', handleSubmit);
    setupCharacterCounter();
    setupFilePreview();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { handleSubmit, uploadImage };
