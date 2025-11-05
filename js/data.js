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
    icon: '💰'
  },
  {
    id: 2,
    number: 2,
    name: 'Zero Hunger',
    color: '#DDA63A',
    description: 'End hunger, achieve food security and improved nutrition',
    icon: '🌾'
  },
  {
    id: 3,
    number: 3,
    name: 'Good Health',
    color: '#4C9F38',
    description: 'Ensure healthy lives and promote well-being for all',
    icon: '❤️'
  },
  {
    id: 4,
    number: 4,
    name: 'Quality Education',
    color: '#C5192D',
    description: 'Ensure inclusive and equitable quality education',
    icon: '📚'
  },
  {
    id: 5,
    number: 5,
    name: 'Gender Equality',
    color: '#FF3A21',
    description: 'Achieve gender equality and empower all women and girls',
    icon: '⚖️'
  },
  {
    id: 6,
    number: 6,
    name: 'Clean Water',
    color: '#26BDE2',
    description: 'Ensure availability and sustainable management of water',
    icon: '💧'
  },
  {
    id: 7,
    number: 7,
    name: 'Clean Energy',
    color: '#FCC30B',
    description: 'Ensure access to affordable, reliable, sustainable energy',
    icon: '⚡'
  },
  {
    id: 8,
    number: 8,
    name: 'Decent Work',
    color: '#A21942',
    description: 'Promote sustained, inclusive economic growth and employment',
    icon: '💼'
  },
  {
    id: 9,
    number: 9,
    name: 'Industry & Innovation',
    color: '#FD6925',
    description: 'Build resilient infrastructure and foster innovation',
    icon: '🏗️'
  },
  {
    id: 10,
    number: 10,
    name: 'Reduced Inequalities',
    color: '#DD1367',
    description: 'Reduce inequality within and among countries',
    icon: '🤝'
  },
  {
    id: 11,
    number: 11,
    name: 'Sustainable Cities',
    color: '#FD9D24',
    description: 'Make cities and human settlements inclusive and sustainable',
    icon: '🏙️'
  },
  {
    id: 12,
    number: 12,
    name: 'Responsible Consumption',
    color: '#BF8B2E',
    description: 'Ensure sustainable consumption and production patterns',
    icon: '♻️'
  },
  {
    id: 13,
    number: 13,
    name: 'Climate Action',
    color: '#3F7E44',
    description: 'Take urgent action to combat climate change',
    icon: '🌍'
  },
  {
    id: 14,
    number: 14,
    name: 'Life Below Water',
    color: '#0A97D9',
    description: 'Conserve and sustainably use oceans, seas and marine resources',
    icon: '🐠'
  },
  {
    id: 15,
    number: 15,
    name: 'Life on Land',
    color: '#56C02B',
    description: 'Protect, restore and promote sustainable use of ecosystems',
    icon: '🌳'
  },
  {
    id: 16,
    number: 16,
    name: 'Peace & Justice',
    color: '#00689D',
    description: 'Promote peaceful and inclusive societies for sustainable development',
    icon: '⚖️'
  },
  {
    id: 17,
    number: 17,
    name: 'Partnerships',
    color: '#19486A',
    description: 'Strengthen means of implementation and global partnerships',
    icon: '🤝'
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
