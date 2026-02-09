'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Github, Tv, Radio, Film, Music, Gamepad2,
  Mic2, Video, Wifi, Play, Headphones, MonitorPlay, Satellite,
  Globe, Podcast, Clapperboard, Camera
} from 'lucide-react';

const taglines = [
  "10,000+ live channels. Zero cost.",
  "News from every corner of the world.",
  "Sports. Movies. Music. Everything.",
  "No sign-up. No credit card.",
  "Just click and watch.",
];

// Icon pattern configuration
const patternIcons = [
  { Icon: Tv, size: 32, top: '8%', left: '5%', delay: 0, animation: 'float-slow' },
  { Icon: Radio, size: 28, top: '15%', left: '85%', delay: 0.5, animation: 'float-medium' },
  { Icon: Film, size: 36, top: '25%', left: '12%', delay: 1, animation: 'float-slow' },
  { Icon: Music, size: 24, top: '35%', left: '92%', delay: 1.5, animation: 'float-fast' },
  { Icon: Gamepad2, size: 30, top: '45%', left: '3%', delay: 2, animation: 'float-medium' },
  { Icon: Mic2, size: 26, top: '55%', left: '88%', delay: 0.3, animation: 'float-slow' },
  { Icon: Video, size: 34, top: '65%', left: '8%', delay: 0.8, animation: 'float-fast' },
  { Icon: Wifi, size: 28, top: '75%', left: '95%', delay: 1.2, animation: 'float-medium' },
  { Icon: Play, size: 22, top: '82%', left: '15%', delay: 1.8, animation: 'float-slow' },
  { Icon: Headphones, size: 30, top: '12%', left: '45%', delay: 0.2, animation: 'shimmer' },
  { Icon: MonitorPlay, size: 38, top: '88%', left: '80%', delay: 0.6, animation: 'float-medium' },
  { Icon: Satellite, size: 26, top: '5%', left: '70%', delay: 1.1, animation: 'float-fast' },
  { Icon: Globe, size: 32, top: '92%', left: '45%', delay: 0.4, animation: 'float-slow' },
  { Icon: Podcast, size: 24, top: '40%', left: '75%', delay: 1.4, animation: 'shimmer' },
  { Icon: Clapperboard, size: 28, top: '60%', left: '20%', delay: 0.7, animation: 'float-medium' },
  { Icon: Camera, size: 26, top: '20%', left: '30%', delay: 1.6, animation: 'float-fast' },
  { Icon: Tv, size: 20, top: '70%', left: '60%', delay: 0.9, animation: 'shimmer' },
  { Icon: Film, size: 22, top: '30%', left: '65%', delay: 1.3, animation: 'float-slow' },
];

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    const currentTagline = taglines[currentIndex];
    const typeSpeed = isDeleting ? 30 : 50;

    if (!isDeleting && displayText === currentTagline) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % taglines.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentTagline.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentTagline.substring(0, displayText.length + 1));
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex]);

  // Mouse tracking for cursor glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-bg text-fg flex flex-col relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Cursor Glow Effect */}
      <div
        className="cursor-glow hidden md:block"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          opacity: isHovering ? 1 : 0
        }}
      />

      {/* Icon Pattern Background */}
      <div className="icon-pattern">
        {patternIcons.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={index}
              className={`icon-pattern-item ${item.animation} pointer-events-auto`}
              style={{
                top: item.top,
                left: item.left,
                animationDelay: `${item.delay}s`,
              }}
            >
              <IconComponent size={item.size} strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-bg via-transparent to-bg/80 pointer-events-none z-0" />

      {/* Floating Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between animate-in">
        <Link href="/" className="flex items-center gap-2.5 group magnetic">
          <img src="/logo.svg" className="h-7 w-7 transition-transform group-hover:scale-110" alt="" />
          <span className="text-base font-semibold group-hover:opacity-70 transition-fast">ExistTV</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/how-it-works" className="text-sm text-muted hover:text-fg transition-fast hidden sm:block">
            How it works
          </Link>
          <a
            href="https://github.com/faeemxccc/ExistTV"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-muted hover:text-fg transition-fast hover:rotate-12 transition-transform"
          >
            <Github className="h-5 w-5" />
          </a>
          <Link
            href="/watch"
            className="px-4 py-2 bg-fg text-bg text-sm font-medium rounded-full hover:opacity-90 transition-fast flex items-center gap-2 btn-press hover-lift"
          >
            Watch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <div className="max-w-2xl space-y-8">
          {/* Animated Badge */}
          <div className="animate-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm animate-border">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted">Live streaming</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight animate-up text-balance">
            Stream the world.
          </h1>

          {/* Typewriter Tagline */}
          <div className="h-16 flex items-center justify-center animate-up delay-1">
            <p className="text-xl sm:text-2xl text-muted font-normal">
              {displayText}
              <span className="inline-block w-0.5 h-6 bg-fg/50 ml-1 animate-pulse" />
            </p>
          </div>

          <div className="animate-up delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/watch"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-fg text-bg text-lg font-semibold rounded-full hover:opacity-90 transition-fast hover-lift btn-press animate-glow"
            >
              <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
              Start watching
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-4 text-muted hover:text-fg text-lg font-medium transition-fast group"
            >
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-up delay-3 flex items-center justify-center gap-8 pt-8">
            <div className="text-center group cursor-default">
              <div className="text-2xl font-bold transition-transform group-hover:scale-110">10K+</div>
              <div className="text-sm text-muted">Channels</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center group cursor-default">
              <div className="text-2xl font-bold transition-transform group-hover:scale-110">100+</div>
              <div className="text-sm text-muted">Countries</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center group cursor-default">
              <div className="text-2xl font-bold transition-transform group-hover:scale-110">Free</div>
              <div className="text-sm text-muted">Forever</div>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-6 h-10 rounded-full border-2 border-fg/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-fg/50 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted animate-in delay-3">
        <Link href="/how-it-works" className="hover:text-fg transition-fast">How it works</Link>
        <span className="hidden sm:block opacity-30">·</span>
        <a href="https://github.com/iptv-org/iptv" target="_blank" rel="noreferrer" className="hover:text-fg transition-fast">Powered by IPTV-org</a>
        <span className="hidden sm:block opacity-30">·</span>
        <span className="opacity-50">© 2025</span>
      </footer>
    </div>
  );
}
