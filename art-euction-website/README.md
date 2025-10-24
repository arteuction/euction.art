# ART EUction Website

**Art Meets Impact** - A complete multi-page website for the ART EUction platform, where creativity drives social change through blockchain-powered auctions supporting the UN Sustainable Development Goals.

## 🎯 Overview

This is a full front-end implementation of the ART EUction platform built with:
- **HTML5** - Semantic, accessible markup
- **CSS3** - Custom properties, glassmorphism, gradients
- **Vanilla JavaScript (ES6 modules)** - No frameworks

## 📁 Project Structure

```
art-euction-website/
├── index.html                      # Homepage
├── about.html                      # About page
├── team.html                       # Team page
├── events.html                     # Events page
├── partners.html                   # Partners page
├── sia.html                        # Social Impact Analytics dashboard
├── artist-signup.html              # Artist signup form
├── artwork-submission.html         # Artwork submission form
├── css/
│   ├── styles.css                  # Global styles & design system
│   ├── header.css                  # Header & navigation styles
│   ├── sidebar.css                 # SDG sidebar styles
│   └── responsive.css              # Mobile-first responsive styles
├── js/
│   ├── main.js                     # Application entry point
│   ├── navigation.js               # Navigation & menu logic
│   ├── animations.js               # Scroll animations & effects
│   ├── data.js                     # SDG data & mock content
│   └── utils.js                    # Utility functions
├── sdg/
│   ├── sdg-1.html through sdg-17.html  # Individual SDG pages
│   └── sdg-overview.html           # SDG overview grid
├── images/                         # Image assets (placeholder)
└── data/
    └── content.json                # Mock content data
```

## 🚀 Setup & Running

### Option 1: Direct Browser Access
Simply open `index.html` in your web browser:
```bash
open index.html
```

### Option 2: Local Server (Recommended)
For best results, use a local server to properly handle ES6 modules:

**Using Python:**
```bash
python3 -m http.server 8080
```
Then visit: http://localhost:8080

**Using Node.js (http-server):**
```bash
npx http-server . -p 8080
```
Then visit: http://localhost:8080

**Using PHP:**
```bash
php -S localhost:8080
```

**Using VS Code Live Server:**
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎨 Design System

### Color Palette
- **Primary Gradient:** `linear-gradient(135deg, #d4ff00 0%, #4ade80 50%, #06b6d4 100%)`
- **Background:** `linear-gradient(to bottom right, #f9fafb, #dbeafe, #d1fae5)`
- **17 Official UN SDG Colors** - Each goal has its unique color

### Typography
- **Headings:** Poppins (Google Fonts)
- **Body:** Inter (Google Fonts)

### Key Features
- Glassmorphism cards with backdrop-filter
- Smooth transitions (0.3s)
- Mobile-first responsive design
- Scroll-triggered animations
- Custom CSS properties for theming

## 📄 Pages Overview

### Main Pages
- **Homepage (index.html)** - Hero, featured artworks, stats, how it works
- **About (about.html)** - Mission, vision, values, detailed process
- **Team (team.html)** - Team member profiles
- **Events (events.html)** - Upcoming auctions and past events
- **Partners (partners.html)** - NGO and corporate partners
- **SIA (sia.html)** - Social Impact Analytics dashboard

### Forms
- **Artist Signup (artist-signup.html)** - Multi-section artist registration
- **Artwork Submission (artwork-submission.html)** - Detailed artwork submission form

### SDG Pages
- **17 Individual SDG Pages** - Each SDG has dedicated page with artworks and NGO partners
- **SDG Overview (sdg/sdg-overview.html)** - Grid view of all 17 SDGs

## ⚙️ Functionality

### JavaScript Modules

**main.js** - Application initialization
- Page-specific setup
- Form handling
- Stats counter updates

**navigation.js** - Navigation controls
- Mobile hamburger menu
- SDG sidebar population
- Active link highlighting
- Smooth scroll

**animations.js** - Visual effects
- Scroll-triggered fade-ins
- Counter animations
- Parallax effects
- Reduced motion support

**data.js** - Data management
- 17 SDG definitions with official colors
- Mock artists, artworks, NGOs, events
- Helper functions (formatting, filtering)
- LocalStorage caching

**utils.js** - Utility functions
- Debounce/throttle
- Validation helpers
- DOM manipulation
- Device detection

## 🎯 Key Components

### Header
- Sticky navigation with glassmorphism
- Responsive hamburger menu
- Active link highlighting
- CTA buttons

### SDG Sidebar
- Fixed sidebar with all 17 SDGs
- Color-coded SDG cards
- Mobile toggle button
- Overlay for mobile

### Cards
- Glassmorphism effect
- Hover animations
- Consistent padding and spacing
- Responsive grid layouts

### Forms
- Clear validation indicators
- Organized sections
- File upload previews
- Supabase-ready structure (comments included)

## 🔄 Supabase Integration (Ready)

Forms include comments marking where to integrate with Supabase:
- `artist-signup.html` - Form with ID `artist-signup-form`
- `artwork-submission.html` - Form with ID `artwork-submission-form`

To integrate:
1. Set up Supabase project
2. Create tables for artists and artworks
3. Replace form submission handlers in `main.js`
4. Add Supabase client library

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- **Mobile:** < 768px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+
- **Large Desktop:** 1280px+

### Mobile Optimizations
- Hamburger menu
- Collapsible sidebar
- Stacked grids
- Touch-friendly buttons (min 44px)
- Optimized typography

## 🎭 Mock Data

The platform includes realistic mock data for:
- **4 Featured Artists** with bios and portfolios
- **4 Featured Artworks** with bids and NGO assignments
- **4 NGO Partners** with funding stats
- **3 Upcoming Events** with participant counts
- **Platform Stats** - 247 artworks, 156 artists, $1.2M raised

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Reduced motion preferences respected
- High contrast mode support
- Focus indicators

## 📈 Future Enhancements

Ready for integration with:
- [ ] Supabase backend for data persistence
- [ ] Wallet connection (MetaMask, etc.)
- [ ] Real-time bidding functionality
- [ ] Image upload to cloud storage
- [ ] User authentication
- [ ] Email notifications
- [ ] Search functionality
- [ ] Filtering by SDG/artist/price

## 🤝 Contributing

This is a front-end only implementation. To add features:
1. Create new components in appropriate files
2. Follow existing naming conventions
3. Use CSS custom properties for theming
4. Maintain mobile-first responsive design
5. Test across browsers

## 📝 License

MIT License - See LICENSE file for details

## 🎨 Credits

- **Design System:** Custom gradient-based design
- **Fonts:** Google Fonts (Inter, Poppins)
- **Icons:** Unicode emoji (no external dependencies)
- **UN SDG Colors:** Official UN color palette

---

**Built with ❤️ for social impact**

For questions or support, visit the team page or check the SIA dashboard to see the impact we're making together.
