/**
 * ART EUction - Navigation Module
 * Handles navigation, mobile menu, sidebar, and active link highlighting
 */

import { SDG_DATA } from './data.js';

/**
 * Initialize navigation
 */
export function initNavigation() {
  setupMobileMenu();
  setupSidebar();
  highlightActiveLink();
  setupSmoothScroll();
  setupScrollHeader();
}

/**
 * Setup mobile hamburger menu
 */
function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('active')) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * Setup SDG sidebar
 */
function setupSidebar() {
  const sidebar = document.querySelector('.sdg-sidebar');
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      if (sidebarOverlay) {
        sidebarOverlay.classList.toggle('active');
      }
    });

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
      });
    }
  }

  // Populate SDG sidebar if it exists
  populateSDGSidebar();
}

/**
 * Populate SDG sidebar with cards
 */
function populateSDGSidebar() {
  const sdgGrid = document.querySelector('.sdg-grid');
  if (!sdgGrid) return;

  // Clear existing content
  sdgGrid.innerHTML = '';

  // Create SDG cards
  SDG_DATA.forEach(sdg => {
    const card = createSDGCard(sdg);
    sdgGrid.appendChild(card);
  });

  // Highlight active SDG if on SDG page
  highlightActiveSDG();
}

/**
 * Create SDG card element
 */
function createSDGCard(sdg) {
  const card = document.createElement('a');
  card.href = `/art-euction-website/sdg/sdg-${sdg.number}.html`;
  card.className = 'sdg-card';
  card.dataset.sdg = sdg.number;
  card.style.color = sdg.color;
  card.title = sdg.description;

  card.innerHTML = `
    <div class="sdg-number">${sdg.number}</div>
    <div class="sdg-name">${sdg.name}</div>
  `;

  return card;
}

/**
 * Highlight active SDG in sidebar
 */
function highlightActiveSDG() {
  const currentPath = window.location.pathname;
  const sdgMatch = currentPath.match(/sdg-(\d+)\.html/);

  if (sdgMatch) {
    const sdgNumber = parseInt(sdgMatch[1]);
    const activeCard = document.querySelector(`.sdg-card[data-sdg="${sdgNumber}"]`);
    if (activeCard) {
      activeCard.classList.add('active');
    }
  }
}

/**
 * Highlight active navigation link
 */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;

    // Check if the link matches the current path
    if (currentPath === linkPath ||
        currentPath.includes(linkPath) && linkPath !== '/') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Special handling for homepage
  if (currentPath === '/' || currentPath.endsWith('index.html')) {
    const homeLink = document.querySelector('.nav-link[href*="index.html"]');
    if (homeLink) {
      homeLink.classList.add('active');
    }
  }
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Setup header scroll behavior
 */
function setupScrollHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/**
 * Create breadcrumb navigation
 */
export function createBreadcrumb() {
  const breadcrumbContainer = document.querySelector('.breadcrumb');
  if (!breadcrumbContainer) return;

  const path = window.location.pathname;
  const segments = path.split('/').filter(s => s && s !== 'art-euction-website');

  let breadcrumbHTML = '<a href="/art-euction-website/index.html">Home</a>';

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const displayName = segment
      .replace('.html', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    if (isLast) {
      breadcrumbHTML += ` <span class="separator">/</span> <span>${displayName}</span>`;
    } else {
      const href = '/' + segments.slice(0, index + 1).join('/');
      breadcrumbHTML += ` <span class="separator">/</span> <a href="${href}">${displayName}</a>`;
    }
  });

  breadcrumbContainer.innerHTML = breadcrumbHTML;
}

/**
 * Update page title with SDG info
 */
export function updatePageTitle(sdgNumber) {
  if (!sdgNumber) return;

  const sdg = SDG_DATA.find(s => s.number === sdgNumber);
  if (sdg) {
    document.title = `SDG ${sdg.number}: ${sdg.name} | ART EUction`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = sdg.description;
    }
  }
}

/**
 * Initialize search functionality
 */
export function initSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length < 2) {
      if (searchResults) searchResults.innerHTML = '';
      return;
    }

    // Search SDGs
    const matchingSDGs = SDG_DATA.filter(sdg =>
      sdg.name.toLowerCase().includes(query) ||
      sdg.description.toLowerCase().includes(query)
    );

    if (searchResults && matchingSDGs.length > 0) {
      displaySearchResults(matchingSDGs, searchResults);
    }
  });
}

/**
 * Display search results
 */
function displaySearchResults(results, container) {
  const html = results.map(sdg => `
    <a href="/art-euction-website/sdg/sdg-${sdg.number}.html" class="search-result-item">
      <span class="sdg-number" style="color: ${sdg.color}">${sdg.number}</span>
      <div>
        <div class="result-title">${sdg.name}</div>
        <div class="result-description">${sdg.description}</div>
      </div>
    </a>
  `).join('');

  container.innerHTML = html;
}

/**
 * Close announcement bar
 */
export function setupAnnouncementBar() {
  const announcementBar = document.querySelector('.announcement-bar');
  const closeButton = document.querySelector('.announcement-close');

  if (announcementBar && closeButton) {
    closeButton.addEventListener('click', () => {
      announcementBar.style.display = 'none';
      // Save preference
      localStorage.setItem('announcement-closed', 'true');
    });

    // Check if previously closed
    if (localStorage.getItem('announcement-closed') === 'true') {
      announcementBar.style.display = 'none';
    }
  }
}
