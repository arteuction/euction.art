/**
 * Social Media Integration & Sharing
 */

// Add Open Graph meta tags dynamically
export function setOpenGraphTags(data) {
  const {
    title,
    description,
    image,
    url,
    type = 'website'
  } = data;

  // Remove existing OG tags
  document.querySelectorAll('meta[property^="og:"]').forEach(el => el.remove());
  document.querySelectorAll('meta[name^="twitter:"]').forEach(el => el.remove());

  // Add new OG tags
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:url', content: url || window.location.href },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: 'ART EUction' },

    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image }
  ];

  const head = document.head;
  ogTags.forEach(tag => {
    const meta = document.createElement('meta');
    if (tag.property) meta.setAttribute('property', tag.property);
    if (tag.name) meta.setAttribute('name', tag.name);
    meta.setAttribute('content', tag.content);
    head.appendChild(meta);
  });

  // Update page title
  document.title = title;
}

// Share on Facebook
export function shareOnFacebook(url, title) {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  window.open(shareUrl, 'facebook-share', 'width=600,height=400');
}

// Share on Twitter
export function shareOnTwitter(url, title, hashtags = 'ArtEUction,SDGs,SocialImpact') {
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${hashtags}`;
  window.open(shareUrl, 'twitter-share', 'width=600,height=400');
}

// Share on LinkedIn
export function shareOnLinkedIn(url, title, summary) {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(shareUrl, 'linkedin-share', 'width=600,height=400');
}

// Share on Pinterest
export function shareOnPinterest(url, image, description) {
  const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(description)}`;
  window.open(shareUrl, 'pinterest-share', 'width=600,height=400');
}

// Copy link to clipboard
export async function copyLinkToClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy link:', error);
    return false;
  }
}

// Generate share buttons HTML
export function createShareButtons(url, title, image, description) {
  return `
    <div class="share-buttons" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button onclick="shareOnFacebook('${url}', '${title}')" class="share-btn facebook" style="background: #1877F2; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
        📘 Facebook
      </button>
      <button onclick="shareOnTwitter('${url}', '${title}')" class="share-btn twitter" style="background: #1DA1F2; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
        🐦 Twitter
      </button>
      <button onclick="shareOnLinkedIn('${url}', '${title}')" class="share-btn linkedin" style="background: #0A66C2; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
        💼 LinkedIn
      </button>
      <button onclick="shareOnPinterest('${url}', '${image}', '${description}')" class="share-btn pinterest" style="background: #E60023; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
        📌 Pinterest
      </button>
      <button onclick="copyLinkToClipboard('${url}')" class="share-btn copy" style="background: #666; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
        🔗 Copy Link
      </button>
    </div>
  `;
}

// Instagram integration helper
export function createInstagramCaption(artworkTitle, artistName, sdg, url) {
  return `
🎨 ${artworkTitle} by ${artistName}

Supporting SDG ${sdg} through art! 🌍

Bid now to own this incredible piece while making a difference.

🔗 Link in bio or visit: ${url}

#ArtEUction #SocialImpactArt #SDGs #ArtForChange #SustainableDevelopmentGoals #ArtAuction #ContemporaryArt #SDG${sdg}
  `.trim();
}

// Make functions globally available
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnLinkedIn = shareOnLinkedIn;
window.shareOnPinterest = shareOnPinterest;
window.copyLinkToClipboard = copyLinkToClipboard;

export default {
  setOpenGraphTags,
  shareOnFacebook,
  shareOnTwitter,
  shareOnLinkedIn,
  shareOnPinterest,
  copyLinkToClipboard,
  createShareButtons,
  createInstagramCaption
};
