# 📺 ExistTV

**Stream the world. For free.**

A modern, open-source IPTV streaming application with 10,000+ live channels from around the globe.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- **10,000+ Channels** — News, sports, movies, music, kids, and more
- **Zero Cost** — No subscriptions, no sign-up required
- **Global Coverage** — Channels from 100+ countries
- **Favorites** — Save your preferred channels locally
- **Quality Selection** — Choose stream quality (Auto, 720p, 1080p, etc.)
- **Modern UI** — Dark cinematic theme with smooth animations
- **Mobile Friendly** — Responsive sidebar that collapses on mobile

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/faeemxccc/ExistTV.git
cd ExistTV

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ How It Works

### Architecture

```
ExistTV
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page with typewriter effect
│   ├── watch/page.tsx     # Main streaming page
│   ├── globals.css        # Design system (Cinema Mode theme)
│   └── layout.tsx         # Root layout with Inter font
│
├── components/
│   ├── dashboard.tsx      # Watch page layout (sidebar + player)
│   ├── sidebar.tsx        # Channel browser with filters
│   └── player.tsx         # HLS video player with controls
│
├── utils/
│   └── m3u-parser.ts      # Parses M3U playlist from IPTV-org
│
└── public/
    └── logo.svg           # TV remote icon
```

### Data Flow

1. **Fetch Channels** — On page load, `watch/page.tsx` fetches the M3U playlist from [IPTV-org](https://github.com/iptv-org/iptv)
2. **Parse Playlist** — `m3u-parser.ts` extracts channel metadata (name, logo, category, country, URL)
3. **Display Sidebar** — Channels are shown in the sidebar with search, category pills, and country filter
4. **Play Stream** — When a channel is selected, the HLS.js player loads and plays the stream

### Key Technologies

| Tech | Purpose |
|------|---------|
| **Next.js 16** | React framework with App Router |
| **HLS.js** | HTTP Live Streaming playback |
| **Tailwind CSS** | Utility-first styling |
| **Lucide Icons** | Clean icon set |
| **IPTV-org** | Open-source channel database |

---

## 🎨 Design System

The app uses a **Cinema Mode** theme:

```css
--bg: #0a0a0a       /* Deep black background */
--fg: #f5f5f5       /* Bright white text */
--muted: #666666    /* Secondary text */
--surface: #141414  /* Card backgrounds */
--border: #222222   /* Subtle borders */
```

### Animations

- `animate-in` — Fade in
- `animate-up` — Fade up with slide
- `animate-scale` — Scale from 96% to 100%
- `delay-1` to `delay-5` — Staggered entrance

---

## 📱 Responsive Behavior

| Screen | Sidebar | Behavior |
|--------|---------|----------|
| Desktop (≥768px) | Always visible | Fixed 280px width |
| Mobile (<768px) | Overlay | Slides in with backdrop |

---

## ⚙️ Player Features

- **Play/Pause** — Click video or button
- **Volume** — Slider + mute toggle
- **Quality** — Auto or manual selection
- **Fullscreen** — Proper container fullscreen
- **Live Badge** — Shows "LIVE" indicator
- **Error Recovery** — Auto-retries on network/media errors

---

## 🔧 Configuration

### Environment Variables (Optional)

```env
# Custom playlist URL (defaults to IPTV-org)
NEXT_PUBLIC_PLAYLIST_URL=https://iptv-org.github.io/iptv/index.m3u
```

---

## 📄 License

MIT © [faeemxccc](https://github.com/faeemxccc)

---

## 🙏 Credits

- [IPTV-org](https://github.com/iptv-org/iptv) — Open-source IPTV channel collection
- [HLS.js](https://github.com/video-dev/hls.js) — JavaScript HLS client
- [Lucide](https://lucide.dev) — Beautiful icons
