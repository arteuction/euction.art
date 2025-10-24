# 🎨 Euction.art — MVP

**Euction.art** is a Web3-inspired art auction platform where creativity meets sustainability.  
Artists submit works that align with the UN Sustainable Development Goals (SDGs), and collectors support global change.

This MVP is built with **Next.js**, **TailwindCSS**, **Supabase**, and **Netlify Functions** — fully deployable with one click.

---

## 🚀 Features

✅ **Homepage**
- Hero section introducing the mission  
- Featured SDG cards (Education, Equality, Climate)  
- Blog feed powered by Supabase  
- Newsletter signup form

✅ **Artist Application**
- Submission form storing artist details in Supabase  
- Supports SDG tagging and portfolio links

✅ **NGO Portal (Coming Soon)**
- Placeholder ready for future NGO dashboard

✅ **Serverless Functions (Netlify)**
- `submit-artist.js` → Save artist form data  
- `subscribe.js` → Save newsletter subscribers  
- `get-posts.js` → Fetch blog posts from Supabase

---

## 🧠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React 18 |
| Styling | TailwindCSS |
| Backend | Netlify Functions |
| Database | Supabase |
| Hosting | Netlify |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- A **Supabase** account (free tier works)
- A **Netlify** account (for deployment)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/arteuction/euction.art.git
cd euction.art
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get your Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use an existing one)
3. Navigate to Settings → API
4. Copy the Project URL and anon/public key

### 4. Set Up Supabase Database

Create the following tables in your Supabase project:

**Table: `artists`**
```sql
CREATE TABLE artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  portfolio_url TEXT,
  sdg_tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Table: `subscribers`**
```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Table: `posts`**
```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🚢 Deployment

### Deploy to Netlify

1. **Connect Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `functions`

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live in minutes!

---

## 🗂️ Project Structure

```
euction.art/
├── functions/              # Netlify serverless functions
│   ├── get-posts.js       # Fetch blog posts from Supabase
│   ├── submit-artist.js   # Handle artist application submissions
│   └── subscribe.js       # Handle newsletter subscriptions
├── pages/                 # Next.js pages
│   ├── index.js          # Homepage
│   ├── artist-application.js  # Artist submission form
│   └── ngo.js            # NGO portal (placeholder)
├── styles/               # Global styles
│   └── globals.css       # TailwindCSS and global styles
├── netlify.toml          # Netlify configuration
├── tailwind.config.js    # TailwindCSS configuration
├── postcss.config.js     # PostCSS configuration
└── package.json          # Project dependencies
```

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

---

## 🔌 API Endpoints (Netlify Functions)

All functions are accessible at `/.netlify/functions/[function-name]`

### `GET /get-posts`
Fetches all blog posts from Supabase.

**Response:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Post Title",
      "content": "Post content...",
      "author": "Author Name",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `POST /submit-artist`
Submits artist application data.

**Request Body:**
```json
{
  "name": "Artist Name",
  "email": "artist@example.com",
  "portfolio_url": "https://portfolio.com",
  "sdg_tags": ["Education", "Climate"]
}
```

### `POST /subscribe`
Adds email to newsletter subscribers.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

## 🎨 Customization

### Modify SDG Cards
Edit `/pages/index.js` to update the featured SDG cards on the homepage.

### Update Styling
- Global styles: `styles/globals.css`
- TailwindCSS config: `tailwind.config.js`

### Add New Pages
Create new files in the `/pages` directory. Next.js automatically handles routing.

---

## 🐛 Troubleshooting

**Issue: "Module not found" errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue: Supabase connection errors**
- Verify your `.env.local` file has the correct credentials
- Check that your Supabase project is active
- Ensure tables are created properly

**Issue: Netlify Functions not working locally**
- Install Netlify CLI: `npm install -g netlify-cli`
- Run: `netlify dev` instead of `npm run dev`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌍 About the Mission

Euction.art connects art with purpose. Every piece auctioned supports UN Sustainable Development Goals, empowering artists and NGOs to create real-world impact through creativity.

**Learn more:** [UN SDGs](https://sdgs.un.org/goals)

---

## 📧 Contact

For questions or support, reach out via GitHub Issues or contact the maintainers.

**Built with ❤️ for a better world.**
