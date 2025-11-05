/**
 * NGO Registration Form Handler
 */

import { config } from './config.js';
import { showNotification } from './utils.js';
import { uploadImage } from './artwork-submission.js';

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

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  try {
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Upload certificate
    const certificateFile = formData.get('certificate');
    const certificateUrl = await uploadImage(certificateFile, 'ngo-certificates');

    // Upload tax document if provided
    let taxDocUrl = null;
    const taxDocFile = formData.get('tax_document');
    if (taxDocFile && taxDocFile.size > 0) {
      taxDocUrl = await uploadImage(taxDocFile, 'ngo-documents');
    }

    // Prepare NGO data
    const ngoData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      website: formData.get('website'),
      description: formData.get('description'),
      country: formData.get('country'),
      registration_number: formData.get('registration_number'),
      primary_sdg: parseInt(formData.get('primary_sdg')),
      impact_statement: formData.get('impact_statement'),
      certificate_url: certificateUrl,
      tax_document_url: taxDocUrl,
      bank_name: formData.get('bank_name'),
      account_number: formData.get('account_number'),
      swift_code: formData.get('swift_code'),
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    // Submit to database
    const client = await initSupabase();
    const { error } = await client.from('NGOs').insert([ngoData]);

    if (error) throw error;

    showNotification('✓ Registration submitted successfully! We\'ll review your application within 5-7 business days.', 'success');

    // Reset form
    form.reset();

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);

  } catch (error) {
    console.error('Error submitting NGO registration:', error);
    showNotification('Error: ' + error.message, 'error');

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Registration';
  }
}

// Initialize
function init() {
  const form = document.getElementById('ngo-registration-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
