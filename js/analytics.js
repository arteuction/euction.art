/**
 * Analytics Integration - Google Analytics 4 & Event Tracking
 */

// Initialize Google Analytics 4
export function initAnalytics(measurementId) {
  if (!measurementId) {
    console.warn('Google Analytics measurement ID not provided');
    return;
  }

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: true,
    anonymize_ip: true
  });
}

// Track custom events
export function trackEvent(eventName, eventParams = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
}

// Track page views
export function trackPageView(pagePath, pageTitle) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
}

// Track artwork views
export function trackArtworkView(artworkId, artworkTitle, artist) {
  trackEvent('view_artwork', {
    artwork_id: artworkId,
    artwork_title: artworkTitle,
    artist_name: artist
  });
}

// Track bid placed
export function trackBidPlaced(auctionId, artworkTitle, bidAmount) {
  trackEvent('place_bid', {
    auction_id: auctionId,
    artwork_title: artworkTitle,
    bid_amount: bidAmount,
    currency: 'USD'
  });
}

// Track artwork submission
export function trackArtworkSubmission(artworkTitle, sdg) {
  trackEvent('submit_artwork', {
    artwork_title: artworkTitle,
    sdg: sdg
  });
}

// Track artist signup
export function trackArtistSignup(artistName) {
  trackEvent('artist_signup', {
    artist_name: artistName
  });
}

// Track NGO registration
export function trackNGORegistration(ngoName) {
  trackEvent('ngo_registration', {
    ngo_name: ngoName
  });
}

// Track auction completion
export function trackAuctionComplete(auctionId, finalBid, artworkTitle) {
  trackEvent('auction_complete', {
    auction_id: auctionId,
    final_bid: finalBid,
    artwork_title: artworkTitle,
    currency: 'USD'
  });
}

// Initialize analytics on page load with your GA4 measurement ID
// Replace 'G-XXXXXXXXXX' with your actual GA4 measurement ID
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Add your GA4 ID here

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAnalytics(GA_MEASUREMENT_ID);
  });
} else {
  initAnalytics(GA_MEASUREMENT_ID);
}

export default {
  initAnalytics,
  trackEvent,
  trackPageView,
  trackArtworkView,
  trackBidPlaced,
  trackArtworkSubmission,
  trackArtistSignup,
  trackNGORegistration,
  trackAuctionComplete
};
