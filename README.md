# CineSlate - Movie Discovery Application

A modern, dark-themed movie discovery web application built with SvelteKit, inspired by Letterboxd. Browse trending movies, search for films, and manage your personal movie collection using the TMDB API.

## 🎯 Project Overview

This is a B3 Web Development module individual project that combines a SvelteKit frontend with TMDB API for movie content. The application features a sleek, modern dark UI with comprehensive movie browsing capabilities.

**Stack:**
- **Framework:** SvelteKit 2.0
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS v4
- **State Management:** Svelte 5 Universal Reactivity (`.svelte.ts`)
- **Backend:** Supabase (for auth & favorites persistence)
- **Content API:** TMDB (The Movie Database)
- **Deployment:** Vercel

## 📋 Implemented Features

### ✅ Core Features
- [x] **Homepage with trending movies** - Grid display of trending films from TMDB
- [x] **Search functionality** - Real-time movie search with API integration
- [x] **Movie cards** - Modern hover effects and visual design
- [x] **Favorites system** - Add/remove movies with localStorage persistence
- [x] **Loading states** - Skeleton placeholders during data fetches
- [x] **Error handling** - User-friendly error messages
- [x] **Responsive design** - Mobile-first with TailwindCSS v4
- [x] **TypeScript strict mode** - Full type safety for API responses

### 🎁 Bonus Features (Planned)
- [ ] Movie detail pages with full information
- [ ] Ratings and reviews
- [ ] Dark/light theme toggle
- [ ] User authentication with Supabase
- [ ] Favorites persistence to database
- [ ] Advanced filtering and sorting

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file with API keys
cp .env.example .env
# Edit .env and add your TMDB API key
```

### Development

```bash
# Start dev server at http://localhost:5173
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## 📁 Project Structure

```
skibidi/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte          # Main layout wrapper
│   │   ├── +layout.server.ts       # Layout server-side logic
│   │   ├── +page.svelte            # Homepage component
│   │   ├── +page.server.ts         # Homepage data loading
│   │   └── api/
│   │       └── search/
│   │           └── +server.ts      # Search API endpoint
│   ├── lib/
│   │   ├── api/
│   │   │   └── tmdb.ts            # TMDB API utilities
│   │   ├── stores/
│   │   │   └── favorites.svelte.ts # Universal Reactivity store
│   │   └── types/
│   │       └── tmdb.ts            # TypeScript interfaces
│   └── app.css                     # Global styles with Tailwind
├── svelte.config.js                # SvelteKit config
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # TailwindCSS configuration
└── .env                            # Environment variables
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
VITE_TMDB_API_KEY=your_api_key_here
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

The `VITE_` prefix makes variables available in the browser.

## 🎨 Design System

- **Color Scheme:** Dark theme (slate-950 background)
- **Gradients:** Cyan to blue accents
- **Typography:** Modern sans-serif via system fonts
- **Spacing:** TailwindCSS scale-based system
- **Animations:** Smooth transitions and hover effects

## 🧪 Development Notes

### TypeScript Strict Mode
All components use strict TypeScript with full type inference. API responses are typed with interfaces in `src/lib/types/tmdb.ts`.

### Universal Reactivity
The favorites store uses Svelte 5's universal reactivity pattern with `.svelte.ts` files for client-side state management.

### Server Actions
The search API uses SvelteKit's `+server.ts` routes for server-side API integration while protecting the TMDB API key.

## 📱 Mobile Responsiveness

- Responsive grid: 2 columns (mobile) → 3 (tablet) → 5 (desktop)
- Touch-friendly hover states
- Optimized images for different screen sizes
- Flexible spacing and typography scales

## 🐛 Known Issues & Solutions

- **API Rate Limiting:** TMDB API has rate limits; consider implementing caching
- **Image Loading:** Uses TMDB CDN; fallback placeholder for missing images
- **Browser Storage:** Favorites use localStorage (limited to 5-10MB)

## 📚 Dependencies

- `@sveltejs/kit` - Full-stack framework
- `@sveltejs/adapter-vercel` - Vercel deployment adapter
- `svelte` - Reactive JavaScript framework
- `tailwindcss` - Utility-first CSS framework
- `typescript` - Type-safe JavaScript
- `vite` - Fast build tool

## 🚢 Deployment

Deployed on **Vercel** with automatic deployments from the main branch.

```bash
# Deploy to Vercel
npm run build
vercel deploy
```

## 📖 Learning Resources

- [SvelteKit Docs](https://kit.svelte.dev)
- [Svelte 5 Docs](https://svelte.dev)
- [TMDB API Docs](https://developer.themoviedb.org/docs)
- [TailwindCSS v4 Docs](https://tailwindcss.com)

## 📝 License

Private project for educational purposes.

---

**Start Date:** May 26, 2026  
**Deadline:** June 29, 2026  
**Status:** In Development
