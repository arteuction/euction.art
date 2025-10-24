/**
 * ART EUction - Data Module
 * Contains SDG data, mock content, and application data
 */

// ==================== SDG DATA ====================
export const SDG_DATA = [
  {
    id: 1,
    number: 1,
    name: 'No Poverty',
    color: '#E5243B',
    description: 'End poverty in all its forms everywhere',
    icon: '<'
  },
  {
    id: 2,
    number: 2,
    name: 'Zero Hunger',
    color: '#DDA63A',
    description: 'End hunger, achieve food security and improved nutrition',
    icon: '<>'
  },
  {
    id: 3,
    number: 3,
    name: 'Good Health',
    color: '#4C9F38',
    description: 'Ensure healthy lives and promote well-being for all',
    icon: 'd'
  },
  {
    id: 4,
    number: 4,
    name: 'Quality Education',
    color: '#C5192D',
    description: 'Ensure inclusive and equitable quality education',
    icon: '=Ú'
  },
  {
    id: 5,
    number: 5,
    name: 'Gender Equality',
    color: '#FF3A21',
    description: 'Achieve gender equality and empower all women and girls',
    icon: '–'
  },
  {
    id: 6,
    number: 6,
    name: 'Clean Water',
    color: '#26BDE2',
    description: 'Ensure availability and sustainable management of water',
    icon: '=§'
  },
  {
    id: 7,
    number: 7,
    name: 'Clean Energy',
    color: '#FCC30B',
    description: 'Ensure access to affordable, reliable, sustainable energy',
    icon: '¡'
  },
  {
    id: 8,
    number: 8,
    name: 'Decent Work',
    color: '#A21942',
    description: 'Promote sustained, inclusive economic growth and employment',
    icon: '=¼'
  },
  {
    id: 9,
    number: 9,
    name: 'Industry & Innovation',
    color: '#FD6925',
    description: 'Build resilient infrastructure and foster innovation',
    icon: '<í'
  },
  {
    id: 10,
    number: 10,
    name: 'Reduced Inequalities',
    color: '#DD1367',
    description: 'Reduce inequality within and among countries',
    icon: '>'
  },
  {
    id: 11,
    number: 11,
    name: 'Sustainable Cities',
    color: '#FD9D24',
    description: 'Make cities and human settlements inclusive and sustainable',
    icon: '<Ù'
  },
  {
    id: 12,
    number: 12,
    name: 'Responsible Consumption',
    color: '#BF8B2E',
    description: 'Ensure sustainable consumption and production patterns',
    icon: '{'
  },
  {
    id: 13,
    number: 13,
    name: 'Climate Action',
    color: '#3F7E44',
    description: 'Take urgent action to combat climate change',
    icon: '<!'
  },
  {
    id: 14,
    number: 14,
    name: 'Life Below Water',
    color: '#0A97D9',
    description: 'Conserve and sustainably use oceans, seas and marine resources',
    icon: '<
'
  },
  {
    id: 15,
    number: 15,
    name: 'Life on Land',
    color: '#56C02B',
    description: 'Protect, restore and promote sustainable use of ecosystems',
    icon: '<3'
  },
  {
    id: 16,
    number: 16,
    name: 'Peace & Justice',
    color: '#00689D',
    description: 'Promote peaceful and inclusive societies for sustainable development',
    icon: '–'
  },
  {
    id: 17,
    number: 17,
    name: 'Partnerships',
    color: '#19486A',
    description: 'Strengthen means of implementation and global partnerships',
    icon: '>'
  }
];

// ==================== MOCK ARTISTS ====================
export const MOCK_ARTISTS = [
  {
    id: 1,
    name: 'Maria Chen',
    bio: 'Environmental artist focusing on climate change awareness through mixed media installations.',
    image: 'https://via.placeholder.com/300x300/4ade80/ffffff?text=MC',
    specialty: 'Installation Art',
    sdgs: [13, 14, 15],
    artworks: 12,
    location: 'Vancouver, Canada'
  },
  {
    id: 2,
    name: 'David Okafor',
    bio: 'Digital artist creating powerful visual narratives about social justice and equality.',
    image: 'https://via.placeholder.com/300x300/06b6d4/ffffff?text=DO',
    specialty: 'Digital Art',
    sdgs: [1, 10, 16],
    artworks: 24,
    location: 'Lagos, Nigeria'
  },
  {
    id: 3,
    name: 'Sofia Rodriguez',
    bio: 'Painter and muralist dedicated to depicting stories of resilience and community.',
    image: 'https://via.placeholder.com/300x300/d4ff00/333333?text=SR',
    specialty: 'Mural Art',
    sdgs: [3, 5, 11],
    artworks: 18,
    location: 'Mexico City, Mexico'
  },
  {
    id: 4,
    name: 'Amir Patel',
    bio: 'Sculptor working with recycled materials to promote sustainable consumption.',
    image: 'https://via.placeholder.com/300x300/FD6925/ffffff?text=AP',
    specialty: 'Sculpture',
    sdgs: [12, 13],
    artworks: 15,
    location: 'Mumbai, India'
  }
];

// ==================== MOCK ARTWORKS ====================
export const MOCK_ARTWORKS = [
  {
    id: 1,
    title: 'Rising Tides',
    artist: 'Maria Chen',
    artistId: 1,
    description: 'An immersive installation depicting the effects of sea level rise on coastal communities.',
    image: 'https://via.placeholder.com/600x400/0A97D9/ffffff?text=Rising+Tides',
    sdg: 14,
    currentBid: 5000,
    minBid: 5500,
    endDate: '2025-11-15',
    bids: 23,
    ngo: 'Ocean Conservancy'
  },
  {
    id: 2,
    title: 'Voices Unheard',
    artist: 'David Okafor',
    artistId: 2,
    description: 'A digital collage highlighting marginalized communities and their stories of resilience.',
    image: 'https://via.placeholder.com/600x400/DD1367/ffffff?text=Voices+Unheard',
    sdg: 10,
    currentBid: 3200,
    minBid: 3500,
    endDate: '2025-11-10',
    bids: 18,
    ngo: 'Equality Now'
  },
  {
    id: 3,
    title: 'Green Futures',
    artist: 'Amir Patel',
    artistId: 4,
    description: 'Sculpture made entirely from recycled ocean plastics, symbolizing hope and renewal.',
    image: 'https://via.placeholder.com/600x400/56C02B/ffffff?text=Green+Futures',
    sdg: 12,
    currentBid: 4800,
    minBid: 5000,
    endDate: '2025-11-20',
    bids: 31,
    ngo: 'Plastic Pollution Coalition'
  },
  {
    id: 4,
    title: 'Community Mural',
    artist: 'Sofia Rodriguez',
    artistId: 3,
    description: 'Vibrant mural celebrating diversity and community strength in urban spaces.',
    image: 'https://via.placeholder.com/600x400/FD9D24/ffffff?text=Community+Mural',
    sdg: 11,
    currentBid: 2800,
    minBid: 3000,
    endDate: '2025-11-12',
    bids: 15,
    ngo: 'Habitat for Humanity'
  }
];

// ==================== MOCK NGOs ====================
export const MOCK_NGOS = [
  {
    id: 1,
    name: 'Ocean Conservancy',
    description: 'Working to protect the ocean from today\'s greatest global challenges.',
    logo: 'https://via.placeholder.com/200x100/0A97D9/ffffff?text=Ocean',
    sdgs: [14],
    benefitPercent: 75,
    totalRaised: 125000
  },
  {
    id: 2,
    name: 'Equality Now',
    description: 'Dedicated to achieving legal and systemic equality for women and girls.',
    logo: 'https://via.placeholder.com/200x100/DD1367/ffffff?text=Equality',
    sdgs: [5, 10],
    benefitPercent: 80,
    totalRaised: 98000
  },
  {
    id: 3,
    name: 'Climate Action Network',
    description: 'Worldwide network of organizations working to promote action to limit climate change.',
    logo: 'https://via.placeholder.com/200x100/3F7E44/ffffff?text=Climate',
    sdgs: [13],
    benefitPercent: 75,
    totalRaised: 156000
  },
  {
    id: 4,
    name: 'Education for All',
    description: 'Ensuring quality education and lifelong learning opportunities for everyone.',
    logo: 'https://via.placeholder.com/200x100/C5192D/ffffff?text=Education',
    sdgs: [4],
    benefitPercent: 70,
    totalRaised: 87000
  }
];

// ==================== MOCK EVENTS ====================
export const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Climate Art Euction',
    description: 'Special auction featuring artworks focused on climate action and environmental conservation.',
    date: '2025-11-15',
    time: '18:00 UTC',
    sdgs: [13, 14, 15],
    artworks: 15,
    participants: 250,
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Equality & Justice Showcase',
    description: 'Celebrating artworks that promote social justice, equality, and human rights.',
    date: '2025-12-01',
    time: '19:00 UTC',
    sdgs: [5, 10, 16],
    artworks: 20,
    participants: 180,
    status: 'upcoming'
  },
  {
    id: 3,
    title: 'Sustainable Cities Auction',
    description: 'Featuring urban art and installations highlighting sustainable development.',
    date: '2025-12-10',
    time: '17:00 UTC',
    sdgs: [11, 12],
    artworks: 12,
    participants: 320,
    status: 'upcoming'
  }
];

// ==================== MOCK TEAM MEMBERS ====================
export const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Alexandra Sterling',
    role: 'Founder & CEO',
    bio: 'Visionary leader with 15 years in art curation and social impact initiatives.',
    image: 'https://via.placeholder.com/300x300/06b6d4/ffffff?text=AS',
    linkedin: '#',
    twitter: '#'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Chief Technology Officer',
    bio: 'Blockchain expert passionate about leveraging technology for social good.',
    image: 'https://via.placeholder.com/300x300/4ade80/ffffff?text=MJ',
    linkedin: '#',
    twitter: '#'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Head of Partnerships',
    bio: 'Connecting NGOs, artists, and collectors to maximize impact.',
    image: 'https://via.placeholder.com/300x300/d4ff00/333333?text=PS',
    linkedin: '#',
    twitter: '#'
  },
  {
    id: 4,
    name: 'Elena Volkov',
    role: 'Art Director',
    bio: 'Curator with expertise in contemporary art and global social movements.',
    image: 'https://via.placeholder.com/300x300/FD6925/ffffff?text=EV',
    linkedin: '#',
    twitter: '#'
  }
];

// ==================== MOCK PARTNERS ====================
export const PARTNERS = [
  {
    id: 1,
    name: 'United Nations',
    logo: 'https://via.placeholder.com/200x100/0A97D9/ffffff?text=UN',
    type: 'Organization'
  },
  {
    id: 2,
    name: 'World Wildlife Fund',
    logo: 'https://via.placeholder.com/200x100/56C02B/ffffff?text=WWF',
    type: 'NGO'
  },
  {
    id: 3,
    name: 'Christie\'s',
    logo: 'https://via.placeholder.com/200x100/333333/ffffff?text=Christies',
    type: 'Auction House'
  },
  {
    id: 4,
    name: 'Ethereum Foundation',
    logo: 'https://via.placeholder.com/200x100/8A92B2/ffffff?text=Ethereum',
    type: 'Technology'
  }
];

// ==================== STATS ====================
export const PLATFORM_STATS = {
  totalArtworks: 247,
  totalArtists: 156,
  totalNGOs: 42,
  fundsRaised: 1250000,
  activeEuctions: 18,
  upcomingEvents: 5
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get SDG by number
 */
export function getSDGByNumber(number) {
  return SDG_DATA.find(sdg => sdg.number === number);
}

/**
 * Get SDG color by number
 */
export function getSDGColor(number) {
  const sdg = getSDGByNumber(number);
  return sdg ? sdg.color : '#999999';
}

/**
 * Get artworks by SDG
 */
export function getArtworksBySDG(sdgNumber) {
  return MOCK_ARTWORKS.filter(artwork => artwork.sdg === sdgNumber);
}

/**
 * Get NGOs by SDG
 */
export function getNGOsBySDG(sdgNumber) {
  return MOCK_NGOS.filter(ngo => ngo.sdgs.includes(sdgNumber));
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get days until date
 */
export function getDaysUntil(dateString) {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

/**
 * Save to localStorage
 */
export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return false;
  }
}

/**
 * Load from localStorage
 */
export function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return null;
  }
}
