<div align="center">

# 🎬 CineVault (Habka Cinema)
### *Next-Generation Cinematic Movie Platform & Streaming Studio*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-f43f5e?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?style=for-the-badge&logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![Zod](https://img.shields.io/badge/Zod-Validated-3068b7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

<p align="center">
  <b>A studio-grade cinematic streaming and film discovery web application inspired by Apple VisionOS and Apple TV+ aesthetic. Built with Next.js 16 App Router, Feature-Sliced Architecture, 3D Tilt physics, strict runtime schema validation, and persistent offline state management.</b>
</p>

</div>

---

## 🌟 Key Highlights & Features

### 🍏 1. Apple Vision Frosted Glassmorphism Design
- **Cinematic Dark Aesthetics:** Deep `#060709` tone with multi-layered `backdrop-blur-2xl`, specular edge reflections, and ambient radial glow.
- **Specular Buttons & Glass Noise:** Micro-textured glass surfaces with dynamic light refraction and responsive spring interactions.

### 🎴 2. 3D Tilt & Gyroscopic Physics Cards
- **Proportional Poster Bounding:** Controlled image dimensions with ambient blurred under-glow, ensuring non-standard posters never distort.
- **Dynamic Glare & Mouse Tracking:** Ray-traced hover glare tracking mouse vectors via Framer Motion springs (`useSpring`, `useTransform`).
- **Interactive Quick-Actions:** Instant watchlist toggle with heart pulse physics, type badges, and hover reveal cues.

### 🎬 3. Cinema Player Stage & Ad-Shield Protection
- **Multi-Server Streaming Hub:** Switch between Clean HD, Fast CDN, Multi-Sub, and Official 4K Trailer sources.
- **Built-in Ad-Shield Sandbox:** Strict iframe sandboxing (`sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"`) that blocks 100% of malicious popup windows and redirect ads.
- **Theater & Cinema Lights Mode:** Lights dimming mode and 21:9 ultra-wide player view.
- **Full TV Series Support:** Dynamic season and episode selection with automated URL params.

### 🌟 4. Celebrity & Director Filmography Portfolios
- **Star Showcase:** Dedicated profile pages (`/actor/[name]`) for cinema icons like **Ryan Reynolds**, **Cillian Murphy**, **Leonardo DiCaprio**, **Keanu Reeves**, **Scarlett Johansson**, and **Christopher Nolan**.
- **Interactive Cast Navigation:** Clickable actor and director pills in film details that navigate directly to their complete filmography.
- **Star Gallery Hub (`/actors`):** Visual directory of Hollywood legends with awards, biographies, and notable works.

### 🔍 5. Apple Spotlight Instant Search (`⌘K`)
- **Global Keyboard Shortcut:** Press `⌘K` or `Ctrl+K` from anywhere to focus the search bar.
- **Trending Keyword Tags:** Single-tap quick search for popular franchises.
- **Debounced Server Querying:** Responsive queries with loading spinners and clean URL query sync.

### 💾 6. Offline Persistent Watchlist
- **Zero-Latency Zustand Store:** Instant toggle with automatic local storage persistence.
- **Category Filtering:** Filter saved favorites by Movies, Series, or Episodes.

---

## 🏗️ Architecture & Project Structure

The project follows a **Feature-Sliced Design (FSD)** approach to maintain strict modularity, high cohesion, and scalable separation of concerns:

```text
src/
├── app/                        # Next.js 16 App Router (Routes & Layouts)
│   ├── page.tsx                # Apple TV+ Showcase Hero & Discover Grid
│   ├── layout.tsx              # Root HTML Shell & Font Configuration
│   ├── globals.css             # Apple Frosted Glass Tokens & Design System
│   ├── movie/[id]/             # Dynamic Movie Detail Page (Bento Grid)
│   ├── watch/[id]/             # Cinema Streaming Player Stage
│   ├── actor/[name]/           # Dedicated Star Filmography Profile
│   ├── actors/                 # Star Gallery Hub Directory
│   └── favorites/              # Persistent Watchlist Library
├── core/                       # Core App Configuration & Constants
│   ├── api.config.ts           # OMDb API Endpoints & Caching Rules
│   └── actors.config.ts        # Star Profiles, Avatars & Metadata
├── features/                   # Business Logic & Domains
│   └── movies/
│       ├── components/         # 3D MovieCard & MovieGrid
│       ├── services/           # Typed Fetch API with Zod Validation
│       └── types/              # Zod Schemas & TypeScript Interfaces
├── shared/                     # Reusable UI Primitives & Navigation
│   ├── Navbar.tsx              # Floating Pill Nav with Live Badge
│   ├── SearchBar.tsx           # Spotlight Search with Cmd+K Listener
│   ├── Footer.tsx              # Minimalist Apple Footer
│   └── AppShell.tsx            # Global Layout Wrapper
└── store/                      # Global Client State
    └── useFavoritesStore.ts    # Zustand Store with LocalStorage Middleware
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** / **pnpm** / **yarn**

### 2. Installation & Setup
Clone the repository and install dependencies:

```bash
# Clone repository
git clone https://github.com/your-username/habka.git

# Navigate to project directory
cd habka

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
OMDB_API_KEY=put_your_api_here
```

### 4. Running Locally
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience the application.

### 5. Production Build
Verify type integrity and compile the production bundle:

```bash
# TypeScript verification
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm start
```

---

## 📋 Technical Assignment Report & AI Development Insights

> [!NOTE]
> The following section documents the engineered prompts, architectural decisions, and human oversight applied during the engineering and refinement of this platform.

### 1. Project Overview & Links
- **GitHub Repository:** https://github.com/kamal-sorour/habka
- **Live Deployment:** https://habka.vercel.app/
- **Architecture:** Feature-Sliced Design (FSD) approach.
- **Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Zustand (State Management), Zod (Data Validation), OMDb API.

---

### 2. Engineered Prompts Used
I utilized AI as a strict code-generation engine directed by highly specific architectural constraints:

1. **API & Data Integrity:**
   > *"Write a data fetching service for the OMDb API using Next.js `fetch` with caching. Implement a Zod schema to rigorously validate the incoming JSON response to ensure type safety at runtime."*
2. **State Management:**
   > *"Create a Zustand store with persistence middleware to manage the 'Favorites' state across user sessions without prop drilling."*
3. **UI Optimization:**
   > *"Generate a responsive `MovieCard` using Next.js `<Image/>`. Optimize for Core Web Vitals (LCP) by including correct aspect ratios, sizing attributes, and a skeleton fallback."*

---

### 3. How AI Assisted the Workflow
AI exponentially accelerated the foundational setup. By offloading the generation of boilerplate interfaces, standard Tailwind grid structures, and initial Zustand store setups, I was able to reallocate my time toward macro-level application architecture, Next.js rendering strategies, and SEO optimization.

---

### 4. Manual Improvements & Human Oversight (Refactoring)
The AI outputs required significant architectural refinement to meet production standards:

- **Streaming & Suspense Boundaries:**
  The AI generated a blocking Server Component. I manually refactored the UI to use React `<Suspense>` boundaries with custom skeleton loaders to ensure the page structure renders instantly while data streams in.
- **Runtime Validation Fixes:**
  The AI's TypeScript interfaces assumed perfect data from OMDb. I discovered the API often returns `"N/A"` for missing data. I manually wrote custom Zod refinements to safely parse these anomalies and inject fallback UI placeholders.
- **Client/Server Boundary Enforcement:**
  The AI attempted to attach Zustand state hooks directly inside Server Components. I restructured the component tree, pushing interactive elements (like the Favorite button) down into isolated `"use client"` leaf components to maintain the benefits of server-side rendering for the main page.
- **Cinema Experience & Player Sandboxing:**
  Implemented custom iframe sandboxing to shield viewers from invasive popups and ads, alongside an Apple Vision-inspired 3D tilt physics system for high-performance interactivity.

---

<div align="center">
  <sub>Crafted with passion for cinema & high-performance web engineering. Powered by OMDb API.</sub>
</div>
